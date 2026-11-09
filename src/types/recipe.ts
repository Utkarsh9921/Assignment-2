export interface IngredientItem {
  raw: string;
  name: string;
  amount?: number;
  unit?: string;
  notes?: string;
}

export interface IngredientSection {
  title: string;
  items: IngredientItem[];
}

export interface RecipeStep {
  stepNumber: number;
  title: string;
  text: string;
  timerMinutes?: number;
  tempTip?: string;
}

export interface Recipe {
  id: string;
  name: string;
  cuisine: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: number;
  summary?: string;
  ingredientSections: IngredientSection[];
  instructions: RecipeStep[];
  servingSuggestions: string[];
  variations: string[];
  storage: string;
  chefTips: string[];
  allergensNotice?: string;
  foodSafetyTemp?: string;
  followUp?: string;
  source?: 'curated' | 'generated';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  parsedRecipe?: Recipe;
  followUpOptions?: string[];
}

export interface ShoppingItem {
  id: string;
  name: string;
  amount?: string;
  category: string;
  checked: boolean;
  recipeName?: string;
}

export interface ActiveTimer {
  id: string;
  label: string;
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
}

export interface KitchenPreferences {
  servings: number;
  dietary: string;
  equipment: string;
  pantry: string;
  spiceLevel: string;
  units: 'metric' | 'us';
}
