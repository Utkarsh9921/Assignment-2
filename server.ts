import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY || '';

const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

export const RECIPE_ASSISTANT_SYSTEM_PROMPT = `
You are an expert AI cooking and recipe assistant. Your job is to help users discover, create, customize, and understand recipes for different foods and cuisines.

Your Core Responsibilities:
When a user asks for a recipe, provide a clear, practical, and easy-to-follow recipe.
For every recipe, include:
- Recipe Name
- Cuisine / Food Type
- Preparation Time
- Cooking Time
- Total Time
- Servings
- Difficulty Level
- Ingredients:
  Give exact quantities wherever possible.
  Use commonly available measurements such as grams, ml, teaspoons, tablespoons, cups, etc.
- Step-by-Step Instructions:
  Number each step.
  Keep instructions clear and beginner-friendly.
  Mention important cooking temperatures, timings, and visual cues when relevant.
- Serving Suggestions
- Storage Instructions, when relevant
- Optional Variations, when useful

Understanding User Requests:
- "Give me a recipe for butter chicken" → Provide a complete butter chicken recipe.
- "How do I make pizza at home?" → Provide a homemade pizza recipe.
- "I have potatoes and eggs. What can I make?" → Suggest recipes using those ingredients.
- "Give me a healthy chicken recipe" → Provide a recipe with relatively nutritious ingredients and explain any relevant substitutions.
- "Make this recipe vegetarian" → Modify the recipe while preserving its intended flavor and cooking method as much as possible.
- "I don't have an oven" → Adapt the recipe to a stovetop, air fryer, pressure cooker, or other suitable method when possible.
- "Make it spicy" → Adjust ingredients and instructions to increase the spice level.
- "Give me a recipe for 10 people" → Scale the ingredient quantities appropriately.

Personalization:
When useful, ask the user for missing information such as:
Dietary preference, Allergies or ingredients to avoid, Number of servings, Available cooking equipment, Available ingredients, Desired spice level, Cuisine preference, Vegetarian/non-vegetarian preference, Cooking skill level, Time available.
Do not ask unnecessary questions. If the request is clear enough, provide the recipe immediately.

Dietary Requirements:
Respect dietary preferences and restrictions provided by the user (Vegetarian, Vegan, Gluten-free, Dairy-free, Egg-free, Nut-free, High-protein, Low-carb, Jain, Halal).
Never claim that a recipe is completely safe for a medical allergy unless the ingredients and potential cross-contamination risks have been verified. When relevant, remind the user to check ingredient labels and cross-contamination.

Ingredient Substitutions:
When a user doesn't have an ingredient, suggest practical alternatives.
Format substitutions like:
Ingredient: Heavy cream
Substitute: Full-fat milk + butter
Note: The texture may be slightly lighter.
Explain when a substitution will significantly change the taste or texture.

Recipe Scaling:
If the user specifies a different number of servings, scale the ingredients proportionally.
Original recipe: 4 servings; User wants: 8 servings → Double the ingredient quantities while keeping cooking instructions appropriate.
Do not blindly double cooking time. Cooking time depends on the cooking method and quantity.

Accuracy and Safety:
Never invent ingredients, cooking temperatures, or cooking times when you are uncertain.
For food-safety-sensitive recipes:
- Recommend appropriate cooking temperatures when relevant (e.g. poultry: 74°C / 165°F, ground meat: 71°C / 160°F, fish: 63°C / 145°F, eggs cooked until yolk and white are firm).
- Tell users to ensure meat, poultry, seafood, and eggs are adequately cooked.
- Mention refrigeration requirements for perishable foods (refrigerate within 2 hours).
- Warn users when a preparation method carries a meaningful food-safety risk.
- For recipes involving raw or undercooked animal products, clearly indicate the risk and provide a safer alternative when appropriate.

Units:
Use metric measurements by default: grams (g), kilograms (kg), milliliters (ml), liters (L).
You may also provide common household measurements such as teaspoons, tablespoons, and cups.
If the user specifies a country or measurement system, adapt the units accordingly.

Style:
Be: Friendly, Clear, Practical, Concise, Encouraging, Beginner-friendly.
Avoid unnecessary storytelling unless the user asks for it.
Use Markdown headings, bullet points, numbered lists, and tables where they improve readability.

Recipe Output Format:
Unless the user asks for a different format, structure recipes like this:

🍽️ [Recipe Name]

Cuisine: [Cuisine]
Difficulty: [Easy/Medium/Hard]
Prep Time: [Time]
Cook Time: [Time]
Total Time: [Time]
Servings: [Number]

🛒 Ingredients
Main Ingredients
[Quantity] — [Ingredient]
[Quantity] — [Ingredient]

For the Sauce / Marinade / Seasoning
[Quantity] — [Ingredient]
[Quantity] — [Ingredient]

👨🍳 Instructions
1. [Step title] — [Detailed instruction.]
2. [Step title] — [Detailed instruction.]
3. [Step title] — [Detailed instruction.]

🍴 Serving Suggestions
[Suggestion]
[Suggestion]

🔄 Variations & Substitutions
[Variation or substitution]
[Variation or substitution]

🧊 Storage
[Storage instructions when applicable.]

💡 Chef's Tips
[Useful cooking tip]
[Useful cooking tip]

Follow-up:
After providing a recipe, optionally offer one relevant follow-up, such as:
"Want a vegetarian version?"
"Want this recipe scaled for 2/4/10 people?"
"Want an air-fryer version?"
"Want a shopping list for this recipe?"
Do not overwhelm the user with multiple unnecessary questions.

Important Rule:
The goal is not merely to list ingredients. Produce recipes that a real person can realistically cook.
Consider ingredient quantities, cooking order, timing, texture, temperature, and practical kitchen constraints when generating recipes.
`;

const recipeStructuredSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    cuisine: { type: Type.STRING },
    difficulty: { type: Type.STRING, enum: ['Easy', 'Medium', 'Hard'] },
    prepTime: { type: Type.STRING },
    cookTime: { type: Type.STRING },
    totalTime: { type: Type.STRING },
    servings: { type: Type.INTEGER },
    summary: { type: Type.STRING },
    foodSafetyTemp: { type: Type.STRING },
    allergensNotice: { type: Type.STRING },
    ingredientSections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          items: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                raw: { type: Type.STRING },
                name: { type: Type.STRING },
                amount: { type: Type.NUMBER },
                unit: { type: Type.STRING },
                notes: { type: Type.STRING },
              },
              required: ['raw', 'name'],
            },
          },
        },
        required: ['title', 'items'],
      },
    },
    instructions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          stepNumber: { type: Type.INTEGER },
          title: { type: Type.STRING },
          text: { type: Type.STRING },
          timerMinutes: { type: Type.NUMBER },
          tempTip: { type: Type.STRING },
        },
        required: ['stepNumber', 'title', 'text'],
      },
    },
    servingSuggestions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    variations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    storage: { type: Type.STRING },
    chefTips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    followUp: { type: Type.STRING },
  },
  required: [
    'name',
    'cuisine',
    'difficulty',
    'prepTime',
    'cookTime',
    'totalTime',
    'servings',
    'ingredientSections',
    'instructions',
    'servingSuggestions',
    'variations',
    'storage',
    'chefTips',
  ],
};

// Retry helper for handling transient upstream high-demand spikes
async function withRetry<T>(fn: () => Promise<T>, retries = 2, delayMs = 600): Promise<T> {
  let lastError: any;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const msg = String(err?.message || '');
      const isRetryable =
        msg.includes('503') ||
        msg.includes('high demand') ||
        msg.includes('UNAVAILABLE') ||
        msg.includes('RESOURCE_EXHAUSTED') ||
        msg.includes('429');

      if (i < retries && isRetryable) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * (i + 1)));
      } else {
        break;
      }
    }
  }
  throw lastError;
}

// POST /api/recipe/chat - Streaming conversation with Recipe Assistant
app.post('/api/recipe/chat', async (req: Request, res: Response) => {
  try {
    const { messages, userPreferences } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured. Please ensure GEMINI_API_KEY is set in Secrets.',
      });
    }

    // Set headers for Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    let contextualInstruction = RECIPE_ASSISTANT_SYSTEM_PROMPT;
    if (userPreferences) {
      contextualInstruction += `\n\nActive User Kitchen Context:
- Preferred Servings: ${userPreferences.servings || 'Default'}
- Dietary Restrictions: ${userPreferences.dietary || 'None specified'}
- Available Equipment: ${userPreferences.equipment || 'Standard kitchen'}
- Available Ingredients / Pantry: ${userPreferences.pantry || 'Not specified'}
- Spice Level: ${userPreferences.spiceLevel || 'Standard'}
- Preferred Units: ${userPreferences.units || 'Metric (g, ml)'}
`;
    }

    // Format contents for Gemini SDK
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const responseStream = await withRetry(() =>
      ai.models.generateContentStream({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: contextualInstruction,
          temperature: 0.7,
        },
      })
    );

    for await (const chunk of responseStream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error('Error in /api/recipe/chat:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'Failed to generate recipe response' });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message || 'Stream error occurred' })}\n\n`);
      res.end();
    }
  }
});

// POST /api/recipe/generate - Generates structured recipe object for interactive cook mode, scaling, timers
app.post('/api/recipe/generate', async (req: Request, res: Response) => {
  try {
    const { prompt, servings, dietary, equipment, pantryIngredients, modifications } = req.body;

    if (!prompt && !pantryIngredients) {
      return res.status(400).json({ error: 'Prompt or pantry ingredients required' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured. Please ensure GEMINI_API_KEY is set in Secrets.',
      });
    }

    const generationPrompt = `Generate a realistic, delicious recipe according to our system rules for: "${prompt || 'Creative recipe with my pantry ingredients'}".
Context:
- Desired Servings: ${servings || 4}
- Dietary restrictions: ${dietary || 'None'}
- Available cooking equipment: ${equipment || 'Standard stove, oven, pots & pans'}
- Available ingredients to use: ${pantryIngredients ? JSON.stringify(pantryIngredients) : 'Any standard'}
- Modifications/Special Requests: ${modifications || 'None'}

Provide accurate metric ingredient amounts (g, ml, tsp, tbsp, pieces), exact step-by-step instructions with realistic times and temperatures, safety temps for meats/eggs, serving suggestions, substitutions, storage, and 1 helpful follow-up question.`;

    const response = await withRetry(() =>
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: generationPrompt,
        config: {
          systemInstruction: RECIPE_ASSISTANT_SYSTEM_PROMPT,
          responseMimeType: 'application/json',
          responseSchema: recipeStructuredSchema,
          temperature: 0.7,
        },
      })
    );

    const parsed = JSON.parse(response.text || '{}');
    // Ensure an id is present
    parsed.id = `recipe_${Date.now()}`;
    return res.json({ recipe: parsed });
  } catch (error: any) {
    console.error('Error in /api/recipe/generate:', error);
    res.status(500).json({ error: error.message || 'Failed to generate structured recipe' });
  }
});

// POST /api/recipe/substitute - Get immediate substitution guidance matching required format
app.post('/api/recipe/substitute', async (req: Request, res: Response) => {
  try {
    const { ingredient, dishContext } = req.body;
    if (!ingredient) {
      return res.status(400).json({ error: 'Ingredient is required' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured.',
      });
    }

    const prompt = `Provide practical ingredient substitutions for "${ingredient}" ${
      dishContext ? `when making ${dishContext}` : ''
    }.
Format strictly as requested in the system instructions:
Ingredient: [Ingredient]
Substitute: [Practical alternative]
Note: [Texture, flavor, or cooking note. Explain when a substitution significantly changes taste or texture.]

Provide 2 to 4 distinct options (e.g. dairy-free, pantry staple, low-fat if relevant).`;

    const response = await withRetry(() =>
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: RECIPE_ASSISTANT_SYSTEM_PROMPT,
          temperature: 0.5,
        },
      })
    );

    return res.json({ text: response.text });
  } catch (error: any) {
    console.error('Error in /api/recipe/substitute:', error);
    res.status(500).json({ error: error.message || 'Failed to find substitutions' });
  }
});

// POST /api/recipe/pantry-match - Suggest recipes based on on-hand ingredients
app.post('/api/recipe/pantry-match', async (req: Request, res: Response) => {
  try {
    const { ingredients, equipment, dietary, timeLimit } = req.body;
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: 'Please provide at least one ingredient' });
    }

    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API key is not configured.',
      });
    }

    const prompt = `The user says: "I have ${ingredients.join(', ')}. What can I make?"
Constraints:
- Available equipment: ${equipment || 'Any standard equipment (or specify if no oven)'}
- Dietary restrictions: ${dietary || 'None'}
- Time available: ${timeLimit || 'Flexible'}

Please provide 3 realistic, mouth-watering recipe ideas using these ingredients, plus common kitchen staples (oil, salt, pepper, water, flour). For each idea, give:
1. Title and Cuisine
2. Why it works with these ingredients
3. Estimated Time (Prep & Cook)
4. Key staples needed
Then pick the best match and provide a complete recipe following our standard recipe output format!`;

    const response = await withRetry(() =>
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: RECIPE_ASSISTANT_SYSTEM_PROMPT,
          temperature: 0.7,
        },
      })
    );

    return res.json({ text: response.text });
  } catch (error: any) {
    console.error('Error in /api/recipe/pantry-match:', error);
    res.status(500).json({ error: error.message || 'Failed to match pantry recipes' });
  }
});

// Setup Vite in Dev or serve static in Prod
async function startServer() {
  const PORT = process.env.PORT || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🍳 GourmetAI Recipe Assistant Server running on http://localhost:${PORT}`);
  });
}

startServer();
