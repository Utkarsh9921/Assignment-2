import React, { useState } from 'react';
import {
  Clock,
  Users,
  Flame,
  ChefHat,
  Bookmark,
  BookmarkCheck,
  ShoppingCart,
  Play,
  RotateCcw,
  Sparkles,
  Copy,
  Check,
  Share2,
  AlertCircle,
  Timer as TimerIcon,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { Recipe, IngredientItem } from '../types/recipe';
import { scaleIngredient } from '../utils/scaler';

interface RecipeCardViewProps {
  recipe: Recipe;
  unitSystem: 'metric' | 'us';
  onToggleUnitSystem: () => void;
  onEnterCookMode: (servings: number) => void;
  onAddToShoppingList: (items: { name: string; amount: string; category: string }[]) => void;
  onSaveRecipe: (recipe: Recipe) => void;
  isSaved: boolean;
  onAddTimer: (label: string, minutes: number) => void;
  onAskModification: (modPrompt: string) => void;
}

export const RecipeCardView: React.FC<RecipeCardViewProps> = ({
  recipe,
  unitSystem,
  onToggleUnitSystem,
  onEnterCookMode,
  onAddToShoppingList,
  onSaveRecipe,
  isSaved,
  onAddTimer,
  onAskModification,
}) => {
  const [currentServings, setCurrentServings] = useState(recipe.servings || 4);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [addedGroceryFeedback, setAddedGroceryFeedback] = useState(false);

  // When recipe prop changes, sync servings if needed
  React.useEffect(() => {
    setCurrentServings(recipe.servings || 4);
    setCheckedIngredients({});
  }, [recipe.id]);

  const toggleIngredientCheck = (key: string) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleAddAllToGrocery = () => {
    const itemsToAdd: { name: string; amount: string; category: string }[] = [];

    recipe.ingredientSections.forEach((section) => {
      section.items.forEach((item) => {
        const scaled = scaleIngredient(item, recipe.servings, currentServings, unitSystem);
        itemsToAdd.push({
          name: item.name,
          amount: scaled.displayAmount ? `${scaled.displayAmount} ${scaled.displayUnit}` : item.raw,
          category: section.title.includes('Sauce') || section.title.includes('Marinade')
            ? 'Sauces & Spices'
            : 'Fresh & Main Ingredients',
        });
      });
    });

    onAddToShoppingList(itemsToAdd);
    setAddedGroceryFeedback(true);
    setTimeout(() => setAddedGroceryFeedback(false), 2500);
  };

  const handleCopyMarkdown = () => {
    let md = `🍽️ ${recipe.name}\n\n`;
    md += `Cuisine: ${recipe.cuisine}\n`;
    md += `Difficulty: ${recipe.difficulty}\n`;
    md += `Prep Time: ${recipe.prepTime}\n`;
    md += `Cook Time: ${recipe.cookTime}\n`;
    md += `Total Time: ${recipe.totalTime}\n`;
    md += `Servings: ${currentServings}\n\n`;

    md += `🛒 Ingredients\n`;
    recipe.ingredientSections.forEach((sec) => {
      md += `${sec.title}\n`;
      sec.items.forEach((item) => {
        const scaled = scaleIngredient(item, recipe.servings, currentServings, unitSystem);
        md += `${scaled.fullText}\n`;
      });
      md += `\n`;
    });

    md += `👨🍳 Instructions\n`;
    recipe.instructions.forEach((step) => {
      md += `${step.stepNumber}. ${step.title} — ${step.text}\n`;
    });
    md += `\n`;

    if (recipe.servingSuggestions?.length) {
      md += `🍴 Serving Suggestions\n`;
      recipe.servingSuggestions.forEach((s) => (md += `- ${s}\n`));
      md += `\n`;
    }

    if (recipe.variations?.length) {
      md += `🔄 Variations & Substitutions\n`;
      recipe.variations.forEach((v) => (md += `- ${v}\n`));
      md += `\n`;
    }

    if (recipe.storage) {
      md += `🧊 Storage\n${recipe.storage}\n\n`;
    }

    if (recipe.chefTips?.length) {
      md += `💡 Chef's Tips\n`;
      recipe.chefTips.forEach((t) => (md += `- ${t}\n`));
      md += `\n`;
    }

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const difficultyColors = {
    Easy: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    Medium: 'bg-amber-100 text-amber-800 border-amber-300',
    Hard: 'bg-rose-100 text-rose-800 border-rose-300',
  };

  return (
    <article className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-stone-200/80 overflow-hidden text-stone-800 mb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 text-white p-6 sm:p-10 relative">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {recipe.cuisine}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                difficultyColors[recipe.difficulty] || 'bg-stone-700 text-white'
              }`}
            >
              {recipe.difficulty} Difficulty
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSaveRecipe(recipe)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                isSaved
                  ? 'bg-amber-500 border-amber-400 text-stone-900'
                  : 'bg-stone-800/80 border-stone-700 text-stone-200 hover:bg-stone-700'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>

            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-800/80 border border-stone-700 text-stone-200 hover:bg-stone-700 transition-colors"
              title="Copy recipe formatted text"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>

            <button
              onClick={() => onEnterCookMode(currentServings)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
            >
              <Play className="w-4 h-4 fill-stone-950" />
              <span>Start Cook Mode</span>
            </button>
          </div>
        </div>

        {/* Recipe Title & Summary */}
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight mb-3">
          🍽️ {recipe.name}
        </h1>
        {recipe.summary && (
          <p className="text-stone-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            {recipe.summary}
          </p>
        )}

        {/* Key Time & Serving Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-stone-700/60">
          <div className="bg-stone-800/60 backdrop-blur-sm p-3.5 rounded-2xl border border-stone-700/50">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 block font-semibold mb-1">
              Prep Time
            </span>
            <div className="flex items-center gap-1.5 font-bold text-stone-100 text-sm sm:text-base">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{recipe.prepTime}</span>
            </div>
          </div>

          <div className="bg-stone-800/60 backdrop-blur-sm p-3.5 rounded-2xl border border-stone-700/50">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 block font-semibold mb-1">
              Cook Time
            </span>
            <div className="flex items-center gap-1.5 font-bold text-stone-100 text-sm sm:text-base">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>{recipe.cookTime}</span>
            </div>
          </div>

          <div className="bg-stone-800/60 backdrop-blur-sm p-3.5 rounded-2xl border border-stone-700/50">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 block font-semibold mb-1">
              Total Time
            </span>
            <div className="flex items-center gap-1.5 font-bold text-stone-100 text-sm sm:text-base">
              <TimerIcon className="w-4 h-4 text-amber-400" />
              <span>{recipe.totalTime}</span>
            </div>
          </div>

          <div className="bg-stone-800/60 backdrop-blur-sm p-3.5 rounded-2xl border border-stone-700/50">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 block font-semibold mb-1">
              Base Servings
            </span>
            <div className="flex items-center gap-1.5 font-bold text-amber-400 text-sm sm:text-base">
              <Users className="w-4 h-4" />
              <span>{recipe.servings} Servings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Notice & Allergy Warnings */}
      {(recipe.foodSafetyTemp || recipe.allergensNotice) && (
        <div className="bg-amber-50/80 border-b border-amber-200/80 px-6 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
          {recipe.foodSafetyTemp && (
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0" />
              <span>
                <strong>Food Safety:</strong> {recipe.foodSafetyTemp}
              </span>
            </div>
          )}
          {recipe.allergensNotice && (
            <div className="flex items-center gap-2 text-stone-600">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                <strong>Allergen Note:</strong> {recipe.allergensNotice}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Quick Customization / Modification Bar */}
      <div className="bg-stone-100 border-b border-stone-200 px-6 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Quick Adapt:
          </span>
          <button
            onClick={() => onAskModification(`Make this ${recipe.name} vegetarian while preserving authentic flavor and cooking technique.`)}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 border border-stone-200 shadow-sm transition-colors"
          >
            🌱 Make Vegetarian
          </button>
          <button
            onClick={() => onAskModification(`I don't have an oven. Adapt ${recipe.name} to stovetop, air fryer, or pressure cooker.`)}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white hover:bg-amber-50 text-stone-700 hover:text-amber-800 border border-stone-200 shadow-sm transition-colors"
          >
            🍳 No Oven / Stovetop
          </button>
          <button
            onClick={() => onAskModification(`Make this ${recipe.name} spicy with enhanced chili and spice depth.`)}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white hover:bg-rose-50 text-stone-700 hover:text-rose-800 border border-stone-200 shadow-sm transition-colors"
          >
            🌶️ Make it Spicy
          </button>
          <button
            onClick={() => onAskModification(`Provide an air-fryer version for ${recipe.name} with adjusted temperature and time.`)}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white hover:bg-amber-50 text-stone-700 hover:text-amber-800 border border-stone-200 shadow-sm transition-colors"
          >
            💨 Air-Fryer Version
          </button>
          <button
            onClick={() => {
              setCurrentServings(10);
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white hover:bg-blue-50 text-stone-700 hover:text-blue-800 border border-stone-200 shadow-sm transition-colors"
          >
            👥 Scale for 10 People
          </button>
        </div>
      </div>

      {/* Main Recipe Content Area */}
      <div className="p-6 sm:p-10 space-y-10">
        {/* Ingredients Header with Interactive Servings Scaler & Unit Switcher */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <h2 className="font-serif text-2xl font-bold text-stone-900 flex items-center gap-2">
                <span>🛒 Ingredients</span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Tap items to check them off as you prep in your kitchen
              </p>
            </div>

            {/* Scaler and Unit Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Unit Toggle Button */}
              <button
                onClick={onToggleUnitSystem}
                className="px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold text-stone-700 bg-stone-50 hover:bg-stone-100 transition-colors"
                title="Toggle between Metric and US units"
              >
                Units: <span className="text-amber-700">{unitSystem === 'metric' ? 'Metric (g, ml)' : 'US (oz, cups)'}</span>
              </button>

              {/* Servings Adjuster */}
              <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200">
                <button
                  onClick={() => setCurrentServings((s) => Math.max(1, s - 1))}
                  className="w-7 h-7 rounded-lg bg-white border border-stone-300 hover:bg-stone-200 font-bold text-stone-700 flex items-center justify-center transition-colors shadow-xs"
                  title="Decrease servings"
                >
                  -
                </button>
                <div className="px-2 text-xs font-bold text-stone-800 whitespace-nowrap">
                  {currentServings} Servings
                </div>
                <button
                  onClick={() => setCurrentServings((s) => s + 1)}
                  className="w-7 h-7 rounded-lg bg-white border border-stone-300 hover:bg-stone-200 font-bold text-stone-700 flex items-center justify-center transition-colors shadow-xs"
                  title="Increase servings"
                >
                  +
                </button>
              </div>

              {/* Add All to Shopping List */}
              <button
                onClick={handleAddAllToGrocery}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-colors"
              >
                {addedGroceryFeedback ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Added to List!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add to Grocery</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Categorized Ingredients List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
            {recipe.ingredientSections.map((section, secIdx) => (
              <div key={secIdx} className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80">
                <h3 className="font-semibold text-xs uppercase tracking-wider text-amber-800 font-sans mb-3 pb-2 border-b border-stone-200 flex items-center justify-between">
                  <span>{section.title}</span>
                  <span className="text-[11px] text-stone-500 font-normal">
                    {section.items.length} items
                  </span>
                </h3>

                <ul className="space-y-2.5">
                  {section.items.map((item, itemIdx) => {
                    const scaled = scaleIngredient(item, recipe.servings, currentServings, unitSystem);
                    const itemKey = `${secIdx}-${itemIdx}`;
                    const isChecked = !!checkedIngredients[itemKey];

                    return (
                      <li
                        key={itemIdx}
                        onClick={() => toggleIngredientCheck(itemKey)}
                        className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-colors group select-none ${
                          isChecked ? 'bg-emerald-50 text-stone-400 line-through' : 'hover:bg-white'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by li onClick
                          className="mt-1 rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer accent-amber-600"
                        />
                        <div className="text-sm leading-relaxed">
                          {scaled.displayAmount ? (
                            <span>
                              <strong className={isChecked ? 'text-stone-400' : 'text-stone-900'}>
                                {scaled.displayAmount} {scaled.displayUnit}
                              </strong>{' '}
                              — {item.name}
                              {item.notes && <span className="text-stone-500 text-xs"> ({item.notes})</span>}
                            </span>
                          ) : (
                            <span>{scaled.fullText}</span>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="pt-6 border-t border-stone-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-bold text-stone-900 flex items-center gap-2">
              <span>👨🍳 Instructions</span>
            </h2>
            <button
              onClick={() => onEnterCookMode(currentServings)}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              <span>Distraction-free Cook Mode</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-6">
            {recipe.instructions.map((step) => (
              <div
                key={step.stepNumber}
                className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs hover:border-amber-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-amber-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                      {step.stepNumber}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-stone-900">
                      {step.title}
                    </h3>
                  </div>

                  {/* Embedded Step Timer Button */}
                  {step.timerMinutes && step.timerMinutes > 0 && (
                    <button
                      onClick={() => onAddTimer(`${recipe.name} - Step ${step.stepNumber}`, step.timerMinutes!)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 shadow-xs transition-colors"
                      title="Start kitchen timer for this step"
                    >
                      <TimerIcon className="w-3.5 h-3.5 text-amber-600" />
                      <span>{step.timerMinutes}m Timer</span>
                    </button>
                  )}
                </div>

                <p className="text-stone-700 text-sm sm:text-base leading-relaxed pl-11">
                  {step.text}
                </p>

                {step.tempTip && (
                  <div className="mt-3 ml-11 flex items-center gap-2 text-xs font-medium text-amber-800 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span>{step.tempTip}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Serving Suggestions */}
        {recipe.servingSuggestions && recipe.servingSuggestions.length > 0 && (
          <div className="pt-6 border-t border-stone-200">
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-3 flex items-center gap-2">
              <span>🍴 Serving Suggestions</span>
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recipe.servingSuggestions.map((s, idx) => (
                <li
                  key={idx}
                  className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-sm text-stone-700 flex items-start gap-2.5"
                >
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Variations & Substitutions */}
        {recipe.variations && recipe.variations.length > 0 && (
          <div className="pt-6 border-t border-stone-200">
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-3 flex items-center gap-2">
              <span>🔄 Variations & Substitutions</span>
            </h2>
            <ul className="space-y-2.5">
              {recipe.variations.map((v, idx) => (
                <li
                  key={idx}
                  className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/60 text-sm text-stone-800 flex items-start gap-2.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Storage */}
        {recipe.storage && (
          <div className="pt-6 border-t border-stone-200">
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-3 flex items-center gap-2">
              <span>🧊 Storage & Reheating</span>
            </h2>
            <div className="bg-sky-50/50 p-4 rounded-xl border border-sky-200 text-sm text-stone-700 leading-relaxed">
              {recipe.storage}
            </div>
          </div>
        )}

        {/* Chef's Tips */}
        {recipe.chefTips && recipe.chefTips.length > 0 && (
          <div className="pt-6 border-t border-stone-200">
            <h2 className="font-serif text-xl font-bold text-stone-900 mb-3 flex items-center gap-2">
              <span>💡 Chef's Tips</span>
            </h2>
            <div className="space-y-3">
              {recipe.chefTips.map((tip, idx) => (
                <div
                  key={idx}
                  className="bg-stone-50 p-4 rounded-xl border-l-4 border-amber-500 text-sm text-stone-800 leading-relaxed"
                >
                  {tip}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Follow-up / Assistant Suggestions */}
        {recipe.followUp && (
          <div className="pt-6 border-t border-stone-200 bg-amber-50/60 p-5 rounded-2xl border border-amber-200">
            <h3 className="text-xs uppercase font-bold text-amber-900 tracking-wider mb-2">
              Recommended Next Step
            </h3>
            <p className="text-sm font-semibold text-stone-900 mb-3">
              {recipe.followUp}
            </p>
            <button
              onClick={() => onAskModification(recipe.followUp!)}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors"
            >
              Ask Recipe Assistant
            </button>
          </div>
        )}
      </div>
    </article>
  );
};
