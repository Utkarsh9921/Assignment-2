import React, { useState } from 'react';
import {
  ChefHat,
  Plus,
  X,
  Sparkles,
  Clock,
  Flame,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Utensils,
  BookOpen,
} from 'lucide-react';
import { Recipe } from '../types/recipe';

interface PantryMatcherProps {
  onSelectRecipe: (recipe: Recipe) => void;
  onSendToChat: (prompt: string) => void;
}

const COMMON_PANTRY_ITEMS = [
  'Potatoes',
  'Eggs',
  'Onion',
  'Garlic',
  'Tomatoes',
  'Chicken',
  'Rice',
  'Cheese',
  'Pasta',
  'Spinach',
  'Canned Beans',
  'Olive Oil',
  'Butter',
  'Flour',
  'Carrots',
  'Greek Yogurt',
];

export const PantryMatcher: React.FC<PantryMatcherProps> = ({
  onSelectRecipe,
  onSendToChat,
}) => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([
    'Potatoes',
    'Eggs',
  ]);
  const [customInput, setCustomInput] = useState('');
  const [equipment, setEquipment] = useState('Stovetop Only (No Oven)');
  const [dietary, setDietary] = useState('None');
  const [timeLimit, setTimeLimit] = useState('30 mins');
  const [isLoading, setIsLoading] = useState(false);
  const [matchedOutput, setMatchedOutput] = useState<string | null>(null);

  const toggleCommonItem = (item: string) => {
    if (selectedIngredients.includes(item)) {
      setSelectedIngredients(selectedIngredients.filter((i) => i !== item));
    } else {
      setSelectedIngredients([...selectedIngredients, item]);
    }
  };

  const handleAddCustom = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customInput.trim();
    if (trimmed && !selectedIngredients.includes(trimmed)) {
      setSelectedIngredients([...selectedIngredients, trimmed]);
      setCustomInput('');
    }
  };

  const handleRemove = (item: string) => {
    setSelectedIngredients(selectedIngredients.filter((i) => i !== item));
  };

  const handleFindRecipes = async () => {
    if (selectedIngredients.length === 0) return;

    setIsLoading(true);
    setMatchedOutput(null);

    try {
      const response = await fetch('/api/recipe/pantry-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: selectedIngredients,
          equipment,
          dietary: dietary === 'None' ? undefined : dietary,
          timeLimit,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to match recipes');
      }

      setMatchedOutput(data.text);
    } catch (err: any) {
      console.error(err);
      setMatchedOutput(
        `Error finding recipes: ${err.message || 'Please check your connection and secrets.'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <ChefHat className="w-5 h-5 text-amber-100" />
          </div>
          <span className="text-xs uppercase tracking-widest font-bold text-amber-200">
            Zero-Waste Cooking
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-2">
          "What can I make with what I have?"
        </h1>
        <p className="text-amber-100 text-sm sm:text-base max-w-2xl leading-relaxed">
          Select or type the ingredients sitting in your fridge or pantry. The Recipe Assistant will formulate realistic, delicious meals adapted to your available kitchen equipment and time!
        </p>
      </div>

      {/* Main Ingredient Selector Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div>
          <h2 className="font-serif text-xl font-bold text-stone-900 mb-2">
            1. What ingredients do you have on hand?
          </h2>
          <p className="text-xs text-stone-500 mb-4">
            Click popular pantry items or type your own below (we assume basic salt, pepper, oil, and water are available).
          </p>

          {/* Quick Item Pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {COMMON_PANTRY_ITEMS.map((item) => {
              const isSelected = selectedIngredients.includes(item);
              return (
                <button
                  key={item}
                  onClick={() => toggleCommonItem(item)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'bg-amber-600 border-amber-600 text-white shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {isSelected && '✓ '}
                  {item}
                </button>
              );
            })}
          </div>

          {/* Add custom item form */}
          <form onSubmit={handleAddCustom} className="flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Add another ingredient (e.g. Bell pepper, Canned tuna, Lentils)..."
              className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-4 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-600"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </form>

          {/* Active Selected List */}
          <div className="mt-4 p-4 bg-amber-50/50 rounded-2xl border border-amber-200/80">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block mb-2">
              Selected Ingredients ({selectedIngredients.length}):
            </span>
            {selectedIngredients.length === 0 ? (
              <p className="text-xs text-stone-400 italic">No ingredients selected yet.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedIngredients.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-amber-300 text-xs font-medium text-stone-800 shadow-2xs"
                  >
                    <span>{item}</span>
                    <button
                      onClick={() => handleRemove(item)}
                      className="text-stone-400 hover:text-rose-600"
                      title={`Remove ${item}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 2. Kitchen Constraints */}
        <div className="pt-6 border-t border-stone-200">
          <h2 className="font-serif text-xl font-bold text-stone-900 mb-4">
            2. Kitchen Equipment & Constraints
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Equipment */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                Cooking Equipment
              </label>
              <select
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-amber-600"
              >
                <option value="Stovetop Only (No Oven)">Stovetop Only (No Oven)</option>
                <option value="Air Fryer">Air Fryer</option>
                <option value="Full Kitchen (Oven & Stovetop)">Full Kitchen (Oven & Stovetop)</option>
                <option value="Pressure Cooker / Instant Pot">Pressure Cooker / Instant Pot</option>
                <option value="Microwave & Kettle">Microwave & Kettle</option>
              </select>
            </div>

            {/* Dietary */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                Dietary Preference
              </label>
              <select
                value={dietary}
                onChange={(e) => setDietary(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-amber-600"
              >
                <option value="None">None (Anything goes)</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Gluten-free">Gluten-Free</option>
                <option value="Dairy-free">Dairy-Free</option>
                <option value="Halal">Halal</option>
                <option value="Jain">Jain</option>
                <option value="High-protein">High Protein</option>
                <option value="Low-carb">Low Carb</option>
              </select>
            </div>

            {/* Time Available */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                Time Available
              </label>
              <select
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:border-amber-600"
              >
                <option value="15-20 mins (Quick weeknight)">15-20 mins (Quick)</option>
                <option value="30 mins (Standard)">30 mins</option>
                <option value="45-60 mins (Take your time)">45-60 mins</option>
                <option value="No limit">No limit</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            onClick={handleFindRecipes}
            disabled={selectedIngredients.length === 0 || isLoading}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-amber-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Formulating Recipes with Your Ingredients...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Find Realistic Recipes ({selectedIngredients.length} Ingredients)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results View */}
      {matchedOutput && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <h3 className="font-serif text-2xl font-bold text-stone-900 flex items-center gap-2">
              <span>🍽️ Chef's Recommendations</span>
            </h3>
            <button
              onClick={() => {
                onSendToChat(`I loved these suggestions for ${selectedIngredients.join(', ')}: Please answer my follow-up.`);
              }}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              <span>Ask Follow-Up in Chat</span>
            </button>
          </div>

          <div className="prose prose-sm max-w-none text-stone-800 whitespace-pre-line text-sm leading-relaxed">
            {matchedOutput}
          </div>
        </div>
      )}
    </div>
  );
};
