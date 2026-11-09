import { Recipe } from '../types/recipe';

export const SAMPLE_RECIPES: Recipe[] = [
  {
    id: 'butter-chicken-1',
    name: 'Authentic Butter Chicken (Murgh Makhani)',
    cuisine: 'North Indian',
    difficulty: 'Medium',
    prepTime: '20 mins (+ 30 mins marination)',
    cookTime: '30 mins',
    totalTime: '50 mins (plus marination)',
    servings: 4,
    summary:
      'Tender, spiced chicken pieces gently simmered in a silky, velvety tomato, butter, and fenugreek gravy.',
    foodSafetyTemp: 'Ensure chicken reaches a safe internal temperature of 74°C (165°F).',
    allergensNotice:
      'Contains Dairy (butter, heavy cream, yogurt). For a dairy-free version, use cashew cream and coconut oil.',
    ingredientSections: [
      {
        title: 'Chicken & Marinade',
        items: [
          { raw: '600g — Boneless skinless chicken thighs', name: 'Boneless skinless chicken thighs', amount: 600, unit: 'g', notes: 'cut into 3cm bite-sized chunks' },
          { raw: '120g — Plain Greek yogurt / curd', name: 'Plain Greek yogurt / curd', amount: 120, unit: 'g', notes: 'full fat' },
          { raw: '15g — Ginger-garlic paste', name: 'Ginger-garlic paste', amount: 15, unit: 'g', notes: 'approx. 1 tbsp' },
          { raw: '1 tsp — Kashmiri red chili powder', name: 'Kashmiri red chili powder', amount: 1, unit: 'tsp', notes: 'for bright red color without burning heat' },
          { raw: '1 tsp — Garam masala', name: 'Garam masala', amount: 1, unit: 'tsp' },
          { raw: '1 tbsp — Lemon juice', name: 'Lemon juice', amount: 1, unit: 'tbsp' },
          { raw: '1 tsp — Fine sea salt', name: 'Fine sea salt', amount: 1, unit: 'tsp' },
        ],
      },
      {
        title: 'Makhani Sauce & Gravy',
        items: [
          { raw: '50g — Unsalted butter', name: 'Unsalted butter', amount: 50, unit: 'g', notes: 'divided' },
          { raw: '15ml — Cooking oil', name: 'Cooking oil', amount: 15, unit: 'ml', notes: '1 tbsp' },
          { raw: '500g — Ripe Roma tomatoes', name: 'Ripe Roma tomatoes', amount: 500, unit: 'g', notes: 'finely pureed' },
          { raw: '15g — Fresh ginger', name: 'Fresh ginger', amount: 15, unit: 'g', notes: 'minced' },
          { raw: '4 cloves — Garlic', name: 'Garlic cloves', amount: 4, unit: 'cloves', notes: 'minced' },
          { raw: '1 tsp — Ground cumin', name: 'Ground cumin', amount: 1, unit: 'tsp' },
          { raw: '1 tbsp — Kasuri methi (dried fenugreek leaves)', name: 'Kasuri methi (dried fenugreek leaves)', amount: 1, unit: 'tbsp', notes: 'crushed between palms' },
          { raw: '100ml — Heavy cream', name: 'Heavy cream', amount: 100, unit: 'ml' },
          { raw: '1 tsp — Sugar or honey', name: 'Sugar or honey', amount: 1, unit: 'tsp', notes: 'to balance tomato acidity' },
        ],
      },
    ],
    instructions: [
      {
        stepNumber: 1,
        title: 'Marinate the chicken',
        text: 'In a large bowl, whisk together the Greek yogurt, ginger-garlic paste, Kashmiri chili powder, garam masala, lemon juice, and salt. Add the chicken pieces, toss thoroughly to coat, and let marinate for at least 30 minutes in the refrigerator.',
        timerMinutes: 30,
        tempTip: 'Keep refrigerated below 4°C (40°F) while marinating.',
      },
      {
        stepNumber: 2,
        title: 'Sear the chicken',
        text: 'Heat 15ml oil and 15g butter in a heavy-bottomed skillet or grill pan over medium-high heat. Add chicken pieces in a single layer (shake off excess marinade). Sear undisturbed for 3–4 minutes per side until charred on edges and nearly cooked through. Transfer to a clean plate.',
        timerMinutes: 8,
        tempTip: 'Internal temp should reach at least 70°C here; it will finish cooking in the simmering gravy.',
      },
      {
        stepNumber: 3,
        title: 'Build the aromatic tomato gravy',
        text: 'In the same pan, melt another 15g of butter over medium heat. Sauté the minced garlic and ginger for 1 minute until fragrant. Pour in the pureed tomatoes and cumin. Bring to a boil, then reduce heat to medium-low and simmer gently until the sauce thickens and oil begins separating at edges (about 12–15 minutes).',
        timerMinutes: 14,
      },
      {
        stepNumber: 4,
        title: 'Simmer and finish with cream',
        text: 'Stir in the seared chicken along with any resting juices into the simmering tomato gravy. Reduce heat to low, cover, and simmer for 8–10 minutes so chicken absorbs the flavors. Stir in the heavy cream, remaining 20g cold butter, sugar, and crushed Kasuri methi. Stir gently for 2 minutes until glossy.',
        timerMinutes: 10,
        tempTip: 'Confirm chicken reaches an internal temperature of 74°C (165°F).',
      },
      {
        stepNumber: 5,
        title: 'Rest and garnish',
        text: 'Turn off the heat. Let the curry sit for 3 minutes for flavors to settle. Garnish with a swirl of fresh cream and fresh coriander leaves.',
        timerMinutes: 3,
      },
    ],
    servingSuggestions: [
      'Serve warm with garlic butter naan, flaky parathas, or steamed basmati rice.',
      'Accompany with sliced red onions pickled in lemon juice and a cooling cucumber raita.',
    ],
    variations: [
      'Vegetarian Paneer Makhani: Replace chicken with 450g paneer cubes lightly seared in ghee.',
      'Dairy-Free: Replace cream and butter with soaked blended cashews (cashew cream) and coconut oil.',
      'Spicier: Add 2 finely slit green chilies (birdseye or serrano) along with the pureed tomatoes.',
    ],
    storage:
      'Cool completely and store in an airtight glass container in the refrigerator for up to 3–4 days. The flavors actually deepen overnight! Reheat gently on the stovetop with a splash of water or cream. Freezes well for up to 2 months.',
    chefTips: [
      'Crushing Kasuri Methi between your dry palms releases essential aromatic oils right before adding.',
      'Do not boil vigorously after adding heavy cream to prevent curdling.',
    ],
    followUp: 'Want a vegetarian Paneer Makhani version or scaled for 8–10 guests?',
    source: 'curated',
  },
  {
    id: 'pizza-at-home-2',
    name: 'Artisanal Neapolitan-Style Pizza at Home',
    cuisine: 'Italian',
    difficulty: 'Medium',
    prepTime: '25 mins (+ 2 hrs dough rest)',
    cookTime: '10 mins',
    totalTime: '35 mins (plus proofing)',
    servings: 4,
    summary:
      'Crisp-bottomed, airy-crusted homemade Margherita pizza with blistered edges, sweet San Marzano tomato sauce, and molten mozzarella.',
    foodSafetyTemp: 'Ensure oven is preheated to its maximum setting for safe, rapid cooking.',
    allergensNotice: 'Contains Gluten (wheat flour) and Dairy (mozzarella, parmesan).',
    ingredientSections: [
      {
        title: 'Dough (makes 2 x 10-inch pizzas)',
        items: [
          { raw: '300g — Italian Tipo 00 flour or strong bread flour', name: 'Tipo 00 or Bread Flour', amount: 300, unit: 'g' },
          { raw: '195ml — Lukewarm water (approx 32°C / 90°F)', name: 'Lukewarm water', amount: 195, unit: 'ml', notes: '65% hydration' },
          { raw: '4g — Instant dry yeast', name: 'Instant dry yeast', amount: 4, unit: 'g', notes: 'approx. 1 tsp' },
          { raw: '6g — Fine sea salt', name: 'Fine sea salt', amount: 6, unit: 'g', notes: 'approx. 1 tsp' },
          { raw: '10ml — Extra virgin olive oil', name: 'Extra virgin olive oil', amount: 10, unit: 'ml' },
        ],
      },
      {
        title: 'Sauce & Toppings',
        items: [
          { raw: '200g — Canned San Marzano whole peeled tomatoes', name: 'San Marzano tomatoes', amount: 200, unit: 'g', notes: 'crushed by hand with a pinch of salt' },
          { raw: '200g — Fresh low-moisture mozzarella or Fior di Latte', name: 'Fresh mozzarella', amount: 200, unit: 'g', notes: 'torn into chunks, patted dry' },
          { raw: '10 leaves — Fresh basil leaves', name: 'Fresh basil leaves', amount: 10, unit: 'leaves' },
          { raw: '20g — Parmigiano-Reggiano', name: 'Parmigiano-Reggiano', amount: 20, unit: 'g', notes: 'freshly grated' },
          { raw: '15ml — Extra virgin olive oil for drizzling', name: 'Extra virgin olive oil', amount: 15, unit: 'ml' },
        ],
      },
    ],
    instructions: [
      {
        stepNumber: 1,
        title: 'Mix and knead the dough',
        text: 'In a bowl, dissolve yeast in lukewarm water. Add flour and stir until a shaggy dough forms. Add salt and 10ml olive oil. Turn onto a clean counter and knead for 8–10 minutes until smooth, supple, and elastic. Shape into a smooth ball.',
        timerMinutes: 10,
      },
      {
        stepNumber: 2,
        title: 'First proof and divide',
        text: 'Place dough in a lightly oiled bowl, cover with a damp cloth, and let rise at room temperature for 1.5 to 2 hours until doubled in size. Gently deflate and divide into 2 equal balls (approx 250g each). Let rest covered for 20 minutes.',
        timerMinutes: 110,
      },
      {
        stepNumber: 3,
        title: 'Preheat oven & baking surface to max',
        text: 'Place a pizza stone, baking steel, or an inverted heavy baking sheet on the highest rack of your oven. Preheat to the maximum temperature (250°C / 480°F or higher) for at least 45 minutes.',
        timerMinutes: 45,
        tempTip: 'Oven at 250°C (480°F) or highest possible domestic temperature.',
      },
      {
        stepNumber: 4,
        title: 'Shape the crust (no rolling pin!)',
        text: 'Dust counter with semolina or flour. Using your fingertips, gently press the center of the dough outwards to push trapped air into the outer rim (cornicione). Stretch carefully over the backs of your hands into a 25cm (10-inch) round. Do not flatten the outer border!',
      },
      {
        stepNumber: 5,
        title: 'Top and bake',
        text: 'Spread 3–4 tbsp of crushed tomatoes evenly, leaving a 2cm border. Scatter torn mozzarella, grated parmesan, and a light drizzle of olive oil. Slide onto preheated stone/steel using parchment paper or a peel. Bake for 7–9 minutes until crust is puffed, blistered, and cheese is bubbling.',
        timerMinutes: 8,
      },
      {
        stepNumber: 6,
        title: 'Garnish and serve',
        text: 'Remove with tongs. Immediately scatter fresh basil leaves over the hot melted cheese. Slice and eat hot.',
      },
    ],
    servingSuggestions: [
      'Pair with a crisp arugula and shaved parmesan salad dressed with lemon and olive oil.',
      'Serve alongside a light Italian sparkling water or chilled beverage.',
    ],
    variations: [
      'Stovetop & Broiler Skillet Method (No pizza stone): Cook shaped dough in a smoking-hot cast-iron skillet on the stovetop for 2 minutes to crisp the bottom, top it, then transfer under high oven broiler for 3 minutes.',
      'Spicy Diavola: Add thinly sliced hot soppressata or pepperoni and a drizzle of hot chili honey.',
      'Vegetarian Quattro Formaggi: Top with mozzarella, gorgonzola, fontina, and parmesan.',
    ],
    storage:
      'Refrigerate leftover slices in foil or an airtight box for up to 3 days. Reheat in a dry skillet over medium-low heat with a lid for 3–4 minutes for a crispy bottom and melted cheese (never microwave!).',
    chefTips: [
      'Pat your fresh mozzarella dry with paper towels 30 minutes before baking to avoid a soggy pizza center.',
      'Crushing whole peeled San Marzano tomatoes with your hands leaves rustic texture that caramelizes better than watery blended puree.',
    ],
    followUp: 'Want instructions for the Stovetop Cast-Iron Skillet method if you do not have a pizza stone?',
    source: 'curated',
  },
  {
    id: 'potato-egg-skillet-3',
    name: 'Spanish Potato & Egg Skillet (Tortilla Española)',
    cuisine: 'Spanish / Mediterranean',
    difficulty: 'Easy',
    prepTime: '15 mins',
    cookTime: '25 mins',
    totalTime: '40 mins',
    servings: 4,
    summary:
      'The classic comforting Spanish tortilla made with tender golden potatoes and velvety eggs, naturally rich, savory, and satisfying using kitchen staples.',
    foodSafetyTemp: 'Eggs should be cooked until custardy and set, with an internal temperature reaching at least 71°C (160°F).',
    allergensNotice: 'Contains Eggs.',
    ingredientSections: [
      {
        title: 'Main Ingredients',
        items: [
          { raw: '600g — Russet or Yukon Gold potatoes', name: 'Potatoes (Yukon Gold or Russet)', amount: 600, unit: 'g', notes: 'peeled and cut into 3mm thin rounds' },
          { raw: '6 large — Fresh eggs', name: 'Fresh eggs', amount: 6, unit: 'eggs' },
          { raw: '1 large — Yellow onion', name: 'Yellow onion', amount: 1, unit: 'piece', notes: 'thinly sliced (optional but traditional in Tortilla de Patatas con Cebolla)' },
          { raw: '120ml — Extra virgin olive oil', name: 'Extra virgin olive oil', amount: 120, unit: 'ml', notes: 'for gently poaching the potatoes' },
          { raw: '1 tsp — Fine sea salt', name: 'Fine sea salt', amount: 1, unit: 'tsp', notes: 'divided' },
          { raw: '¼ tsp — Freshly ground black pepper', name: 'Freshly ground black pepper', amount: 0.25, unit: 'tsp' },
        ],
      },
    ],
    instructions: [
      {
        stepNumber: 1,
        title: 'Slice and season potatoes',
        text: 'Peel and slice potatoes uniformly into 3mm thick discs. Rinse briefly in cold water and pat thoroughly dry with a kitchen towel. Toss with ½ tsp salt.',
      },
      {
        stepNumber: 2,
        title: 'Slowly confit potatoes & onions in olive oil',
        text: 'Heat 120ml olive oil in a 23cm (9-inch) non-stick or well-seasoned cast iron skillet over medium-low heat. Add potatoes and sliced onions. They should be submerged in oil and gently poach/simmer without browning crisp. Cook for 18–20 minutes, turning occasionally with a spatula, until fork-tender and yielding.',
        timerMinutes: 20,
      },
      {
        stepNumber: 3,
        title: 'Drain and infuse with whisked eggs',
        text: 'Carefully drain the tender potatoes and onions through a colander over a bowl, reserving the aromatic olive oil for later use. In a large bowl, whisk the 6 eggs with the remaining ½ tsp salt and black pepper until frothy. Immediately fold in the warm potatoes and onions. Let soak for 10 minutes so potatoes absorb the egg custard.',
        timerMinutes: 10,
      },
      {
        stepNumber: 4,
        title: 'Cook the base',
        text: 'Wipe the skillet and add 1 tbsp of the reserved potato-infused oil over medium heat. Pour in the egg and potato mixture. Cook for 2–3 minutes, using a rubber spatula to run around the edges to tuck the tortilla into a neat disc and prevent sticking.',
        timerMinutes: 3,
      },
      {
        stepNumber: 5,
        title: 'The classic plate flip',
        text: 'When the bottom is golden and edges are set but the center is still slightly runny, place a flat dinner plate upside-down over the skillet. With one hand firmly on the plate and one on the pan handle, invert swiftly in one confident motion over a sink or counter. Slide the tortilla back into the pan, uncooked side down.',
      },
      {
        stepNumber: 6,
        title: 'Finish cooking and rest',
        text: 'Tuck the edges inward with your spatula to form a smooth rounded border. Cook over low heat for another 2–3 minutes for a juicy, creamy interior. Slide onto a serving platter and rest for 10 minutes before slicing.',
        timerMinutes: 3,
        tempTip: 'Ensure center is cooked through to at least 71°C (160°F) for food safety.',
      },
    ],
    servingSuggestions: [
      'Cut into wedges and serve with crusty rustic bread rubbed with ripe tomato and garlic (Pan con Tomate).',
      'Delicious served warm, at room temperature, or cold as tapas.',
    ],
    variations: [
      'Cheesy Potato Skillet: Layer in 80g grated sharp white cheddar or Manchego cheese in the middle.',
      'Vegetable Boost: Add sliced zucchini or diced red bell peppers when poaching the potatoes.',
      'Spicy Paprika: Add 1 tsp smoked Spanish pimentón (paprika) into the whisked eggs.',
    ],
    storage:
      'Store covered in the refrigerator for up to 3 days. Can be eaten chilled or gently warmed in a toaster oven or skillet.',
    chefTips: [
      'Letting the warm potatoes rest in the raw whisked eggs for 10 minutes is the secret to a rich, cohesive tortilla that holds together without falling apart.',
      'Save the drained olive oil in a jar! It is infused with sweet onion and potato flavor and is incredible for frying eggs or roasting vegetables.',
    ],
    followUp: 'Want a variation with cheese and herbs, or scaled for a larger gathering of 8 people?',
    source: 'curated',
  },
  {
    id: 'healthy-lemon-chicken-4',
    name: 'Herb-Roasted Lemon Chicken & Mediterranean Vegetables',
    cuisine: 'Mediterranean / Healthy',
    difficulty: 'Easy',
    prepTime: '15 mins',
    cookTime: '25 mins',
    totalTime: '40 mins',
    servings: 4,
    summary:
      'Nutrient-dense, vibrant chicken breasts marinated in fresh lemon, garlic, and Mediterranean herbs, roasted alongside colorful seasonal vegetables for a complete high-protein meal.',
    foodSafetyTemp: 'Poultry must be cooked to a minimum internal temperature of 74°C (165°F).',
    allergensNotice: 'Naturally gluten-free, dairy-free, and nut-free. Always check herb seasoning labels.',
    ingredientSections: [
      {
        title: 'Chicken & Citrus Marinade',
        items: [
          { raw: '650g — Boneless skinless chicken breasts', name: 'Boneless skinless chicken breasts', amount: 650, unit: 'g', notes: 'butterflied or pounded to even 2cm thickness' },
          { raw: '30ml — Extra virgin olive oil', name: 'Extra virgin olive oil', amount: 30, unit: 'ml', notes: '2 tbsp' },
          { raw: '1 large — Fresh lemon', name: 'Fresh lemon', amount: 1, unit: 'piece', notes: 'zested and juiced (approx 40ml juice)' },
          { raw: '4 cloves — Garlic', name: 'Garlic cloves', amount: 4, unit: 'cloves', notes: 'finely minced' },
          { raw: '1 tbsp — Dried oregano', name: 'Dried oregano', amount: 1, unit: 'tbsp' },
          { raw: '1 tsp — Dried thyme', name: 'Dried thyme', amount: 1, unit: 'tsp' },
          { raw: '1 tsp — Sea salt', name: 'Sea salt', amount: 1, unit: 'tsp' },
          { raw: '½ tsp — Fresh cracked black pepper', name: 'Fresh cracked black pepper', amount: 0.5, unit: 'tsp' },
        ],
      },
      {
        title: 'Roasted Vegetables',
        items: [
          { raw: '1 medium — Zucchini', name: 'Zucchini', amount: 1, unit: 'piece', notes: 'sliced into 1.5cm half-moons' },
          { raw: '1 medium — Red bell pepper', name: 'Red bell pepper', amount: 1, unit: 'piece', notes: 'cut into 2.5cm chunks' },
          { raw: '200g — Cherry tomatoes', name: 'Cherry tomatoes', amount: 200, unit: 'g', notes: 'left whole' },
          { raw: '1 medium — Red onion', name: 'Red onion', amount: 1, unit: 'piece', notes: 'cut into wedges' },
          { raw: '15ml — Extra virgin olive oil', name: 'Extra virgin olive oil', amount: 15, unit: 'ml', notes: '1 tbsp' },
        ],
      },
    ],
    instructions: [
      {
        stepNumber: 1,
        title: 'Preheat oven and prep sheet pan',
        text: 'Preheat oven to 200°C (400°F) or 190°C fan. Line a large rimmed baking sheet with parchment paper.',
        tempTip: 'Oven preheated to 200°C (400°F).',
      },
      {
        stepNumber: 2,
        title: 'Marinate chicken',
        text: 'Whisk olive oil, lemon zest, lemon juice, minced garlic, oregano, thyme, salt, and black pepper in a shallow dish. Add chicken breasts, turning to coat evenly. Let marinate on counter for 10–15 minutes while preparing vegetables.',
        timerMinutes: 15,
      },
      {
        stepNumber: 3,
        title: 'Toss vegetables',
        text: 'In a bowl, toss zucchini, red bell pepper, cherry tomatoes, and red onion wedges with 1 tbsp olive oil, a pinch of salt, and pepper. Spread evenly across the baking sheet, leaving space in the center for the chicken.',
      },
      {
        stepNumber: 4,
        title: 'Roast to perfection',
        text: 'Nestle the marinated chicken pieces onto the sheet pan between the vegetables. Pour any remaining marinade over the top. Roast in the preheated oven for 20–22 minutes until vegetables are caramelized and chicken is cooked through.',
        timerMinutes: 22,
        tempTip: 'Check with an instant-read meat thermometer at the thickest part: internal temperature must reach 74°C (165°F).',
      },
      {
        stepNumber: 5,
        title: 'Rest and serve',
        text: 'Transfer chicken to a cutting board and let rest for 5 minutes before slicing across the grain. This retains maximum juiciness. Drizzle pan juices over the sliced chicken and roasted vegetables.',
        timerMinutes: 5,
      },
    ],
    servingSuggestions: [
      'Serve with warm fluffy quinoa, brown rice, or a dollop of Greek yogurt tzatziki.',
      'Squeeze fresh lemon wedges over the top right before enjoying.',
    ],
    variations: [
      'Air Fryer Adaptation: Cook marinated chicken breasts in air fryer at 190°C (375°F) for 12–15 minutes, flipping halfway. Cook veggies separately for 8–10 minutes.',
      'Vegetarian Tofu Swap: Replace chicken with 500g extra-firm pressed tofu, cubed and tossed in cornstarch before roasting for ultra-crispy edges.',
    ],
    storage:
      'Refrigerate leftovers in airtight meal-prep containers for up to 4 days. Pack vegetables and sliced chicken with a wedge of lemon. Excellent eaten cold over salad or reheated gently.',
    chefTips: [
      'Pounding chicken breasts to an even 2cm thickness ensures the tapered end does not dry out before the thick center is cooked through.',
      'Resting for 5 minutes allows moisture redistribution; slicing immediately leaks all the delicious flavorful juices.',
    ],
    followUp: 'Want instructions for an Air Fryer conversion or meal-prep portions for the week?',
    source: 'curated',
  },
  {
    id: 'tuscan-pasta-5',
    name: '15-Minute Creamy Tuscan Garlic & Spinach Pasta',
    cuisine: 'Italian-American',
    difficulty: 'Easy',
    prepTime: '5 mins',
    cookTime: '10 mins',
    totalTime: '15 mins',
    servings: 4,
    summary:
      'Silky pasta coated in an aromatic garlic sauce with sweet sun-dried tomatoes, wilted baby spinach, and parmesan cheese.',
    foodSafetyTemp: 'Ensure dairy sauce is kept above 60°C (140°F) while serving.',
    allergensNotice: 'Contains Wheat/Gluten and Dairy. See variations for gluten-free and vegan swaps.',
    ingredientSections: [
      {
        title: 'Pasta',
        items: [
          { raw: '350g — Penne, rigatoni, or fettuccine pasta', name: 'Penne or Fettuccine pasta', amount: 350, unit: 'g' },
          { raw: '1 tbsp — Salt for pasta water', name: 'Salt for pasta water', amount: 1, unit: 'tbsp' },
        ],
      },
      {
        title: 'Tuscan Cream Sauce',
        items: [
          { raw: '20g — Butter', name: 'Butter', amount: 20, unit: 'g' },
          { raw: '15ml — Olive oil (from sun-dried tomato jar)', name: 'Olive oil', amount: 15, unit: 'ml' },
          { raw: '5 cloves — Garlic', name: 'Garlic cloves', amount: 5, unit: 'cloves', notes: 'thinly sliced' },
          { raw: '80g — Sun-dried tomatoes', name: 'Sun-dried tomatoes in oil', amount: 80, unit: 'g', notes: 'drained and julienned' },
          { raw: '200ml — Heavy cream', name: 'Heavy cream', amount: 200, unit: 'ml' },
          { raw: '100ml — Low-sodium vegetable or chicken broth', name: 'Vegetable broth', amount: 100, unit: 'ml' },
          { raw: '100g — Fresh baby spinach', name: 'Fresh baby spinach', amount: 100, unit: 'g' },
          { raw: '60g — Parmigiano-Reggiano', name: 'Parmigiano-Reggiano', amount: 60, unit: 'g', notes: 'freshly grated' },
          { raw: '½ tsp — Red pepper flakes', name: 'Red pepper flakes', amount: 0.5, unit: 'tsp', notes: 'optional for gentle heat' },
          { raw: '60ml — Starchy pasta cooking water', name: 'Starchy pasta cooking water', amount: 60, unit: 'ml', notes: 'reserved before draining' },
        ],
      },
    ],
    instructions: [
      {
        stepNumber: 1,
        title: 'Boil pasta',
        text: 'Bring a large pot of salted water to a rolling boil. Add pasta and cook 1 minute less than package directions for al dente. Dip a mug in to reserve 60ml starchy cooking water before draining.',
        timerMinutes: 9,
      },
      {
        stepNumber: 2,
        title: 'Sauté aromatics',
        text: 'While pasta boils, melt butter and sun-dried tomato oil in a large skillet over medium heat. Add sliced garlic, sun-dried tomatoes, and red pepper flakes. Sauté for 1–2 minutes until garlic is golden and fragrant (do not burn).',
        timerMinutes: 2,
      },
      {
        stepNumber: 3,
        title: 'Simmer sauce',
        text: 'Pour in broth and heavy cream. Bring to a gentle simmer for 3 minutes until slightly reduced and creamy.',
        timerMinutes: 3,
      },
      {
        stepNumber: 4,
        title: 'Wilt spinach and emulsify',
        text: 'Stir in fresh baby spinach and cook for 1 minute until wilted. Stir in grated parmesan cheese until melted and smooth.',
        timerMinutes: 1,
      },
      {
        stepNumber: 5,
        title: 'Toss and gloss',
        text: 'Add drained hot pasta into the skillet along with a splash of reserved pasta water. Toss vigorously for 1 minute so the starch binds the sauce to every ridge of the pasta.',
        timerMinutes: 1,
      },
    ],
    servingSuggestions: [
      'Garnish with extra grated parmesan and fresh basil leaves.',
      'Serve with warm garlic focaccia and a side green salad.',
    ],
    variations: [
      'Add Protein: Top with grilled sliced chicken breast or sautéed garlic butter shrimp.',
      'Dairy-Free / Vegan: Swap heavy cream for soaked pureed raw cashews blended with water, and use nutritional yeast or vegan parmesan.',
      'Gluten-Free: Use chickpea or brown rice penne pasta.',
    ],
    storage:
      'Store in an airtight container for up to 3 days in the fridge. When reheating, add a splash of milk or water to loosen the cream sauce as the pasta absorbs moisture.',
    chefTips: [
      'Always reserve starchy pasta cooking water; the salty starch emulsifies the fat from the butter, cream, and cheese into a restaurant-glossy sauce.',
    ],
    followUp: 'Want to add grilled chicken or shrimp to this recipe?',
    source: 'curated',
  },
];

export interface CuratedSubstitution {
  ingredient: string;
  substitute: string;
  note: string;
  category: string;
}

export const CURATED_SUBSTITUTIONS: CuratedSubstitution[] = [
  {
    ingredient: 'Heavy cream',
    substitute: 'Full-fat milk + butter (¾ cup milk + ¼ cup melted butter)',
    note: 'The texture may be slightly lighter, but fat content is comparable for sauces and soups. Note: Cannot be whipped into stiff peaks.',
    category: 'Dairy',
  },
  {
    ingredient: 'Buttermilk',
    substitute: '1 cup milk + 1 tbsp lemon juice or white vinegar',
    note: 'Let sit for 5 minutes until curdled. Perfect acidity for fluffy pancakes and tenderizing fried chicken.',
    category: 'Dairy',
  },
  {
    ingredient: 'Egg (in baking)',
    substitute: '1 tbsp ground flaxseed + 3 tbsp water (flax egg)',
    note: 'Whisk and let gelatinize for 5 minutes. Imparts a mild nutty flavor; works best in cookies, quick breads, and pancakes.',
    category: 'Baking',
  },
  {
    ingredient: 'Cornstarch (thickener)',
    substitute: 'All-purpose flour (use 2 tbsp flour for every 1 tbsp cornstarch)',
    note: 'Must be cooked for 2 minutes longer to remove raw flour taste and achieve full thickening power.',
    category: 'Pantry',
  },
  {
    ingredient: 'Fish sauce',
    substitute: 'Soy sauce + a pinch of brown sugar + squeeze of lime (or Worcestershire sauce)',
    note: 'Provides similar savory umami and salinity, though slightly less pungent.',
    category: 'Condiments',
  },
  {
    ingredient: 'Mirin (sweet rice wine)',
    substitute: 'Dry white wine or rice vinegar + ½ tsp sugar per tbsp',
    note: 'Balances acidity and sweetness for teriyaki and marinades.',
    category: 'Condiments',
  },
  {
    ingredient: 'Brown sugar',
    substitute: '1 cup white granulated sugar + 1 tbsp molasses',
    note: 'Mix thoroughly until moisture and caramel depth match light brown sugar.',
    category: 'Baking',
  },
  {
    ingredient: 'Sour cream',
    substitute: 'Plain Greek yogurt (1:1 ratio)',
    note: 'Nearly identical tangy flavor and creamy body with extra protein and less saturated fat.',
    category: 'Dairy',
  },
  {
    ingredient: 'Tomato paste',
    substitute: 'Tomato sauce or passata (simmered down to ⅓ volume)',
    note: 'Cook down over low heat to evaporate excess moisture and concentrate sugars.',
    category: 'Pantry',
  },
  {
    ingredient: 'Fresh ginger',
    substitute: 'Ground ginger (use ¼ tsp ground ginger for 1 tbsp fresh)',
    note: 'Provides warmth and earthiness, though lacks the bright floral punch of fresh root.',
    category: 'Spices',
  },
  {
    ingredient: 'White wine (in cooking)',
    substitute: 'Chicken/vegetable broth + 1 tsp lemon juice or white wine vinegar',
    note: 'Replaces the acidity needed to cut through rich sauces and deglaze pan fond.',
    category: 'Pantry',
  },
  {
    ingredient: 'Breadcrumbs',
    substitute: 'Crushed rolled oats, crushed crackers, or toasted grated stale bread',
    note: 'Yields a pleasant crisp crust and acts as a binder for meatballs or patties.',
    category: 'Pantry',
  },
];
