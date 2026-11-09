import React from 'react';
import {
  UtensilsCrossed,
  MessageSquare,
  BookOpen,
  ChefHat,
  Replace,
  ShoppingCart,
  Timer,
  Bookmark,
  SlidersHorizontal,
  Flame,
} from 'lucide-react';
import { KitchenPreferences } from '../types/recipe';

export type ActiveTab =
  | 'chat'
  | 'recipe'
  | 'pantry'
  | 'substitutions'
  | 'shopping'
  | 'timers'
  | 'saved';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  shoppingCount: number;
  activeTimersCount: number;
  savedCount: number;
  preferences: KitchenPreferences;
  setPreferences: React.Dispatch<React.SetStateAction<KitchenPreferences>>;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  shoppingCount,
  activeTimersCount,
  savedCount,
  preferences,
  setPreferences,
}) => {
  const [showPrefModal, setShowPrefModal] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 shadow-md border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('chat')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-600/30 group-hover:scale-105 transition-transform">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  GourmetAI
                </span>
                <span className="px-1.5 py-0.5 text-[10px] uppercase font-semibold tracking-wider bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                  Assistant
                </span>
              </div>
              <p className="text-xs text-stone-400 hidden sm:block">
                Expert Cooking & Practical Culinary Guide
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'chat'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Assistant</span>
            </button>

            <button
              onClick={() => setActiveTab('recipe')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'recipe'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Recipe Card</span>
            </button>

            <button
              onClick={() => setActiveTab('pantry')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'pantry'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <ChefHat className="w-4 h-4" />
              <span>Pantry Cook</span>
            </button>

            <button
              onClick={() => setActiveTab('substitutions')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'substitutions'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Replace className="w-4 h-4" />
              <span>Substitutions</span>
            </button>

            <button
              onClick={() => setActiveTab('shopping')}
              className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'shopping'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Grocery</span>
              {shoppingCount > 0 && (
                <span className="w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full bg-amber-400 text-stone-900">
                  {shoppingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('timers')}
              className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'timers'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Timer className="w-4 h-4" />
              <span>Timers</span>
              {activeTimersCount > 0 && (
                <span className="w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full bg-rose-500 text-white animate-pulse">
                  {activeTimersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'saved'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved</span>
              {savedCount > 0 && (
                <span className="w-5 h-5 flex items-center justify-center text-xs font-bold rounded-full bg-stone-700 text-amber-300">
                  {savedCount}
                </span>
              )}
            </button>
          </nav>

          {/* Preferences Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPrefModal(!showPrefModal)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-300 bg-stone-800 hover:bg-stone-700 hover:text-white rounded-lg border border-stone-700 transition-colors"
              title="Kitchen Preferences"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Preferences</span>
              <span className="px-1.5 py-0.2 bg-stone-700 rounded text-amber-300">
                {preferences.units === 'metric' ? 'Metric' : 'US'}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden overflow-x-auto py-2 border-t border-stone-800 gap-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'chat' ? 'bg-amber-600 text-white' : 'text-stone-300 bg-stone-800/80'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Assistant
          </button>
          <button
            onClick={() => setActiveTab('recipe')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'recipe' ? 'bg-amber-600 text-white' : 'text-stone-300 bg-stone-800/80'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Recipe
          </button>
          <button
            onClick={() => setActiveTab('pantry')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'pantry' ? 'bg-amber-600 text-white' : 'text-stone-300 bg-stone-800/80'
            }`}
          >
            <ChefHat className="w-3.5 h-3.5" />
            Pantry
          </button>
          <button
            onClick={() => setActiveTab('substitutions')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'substitutions' ? 'bg-amber-600 text-white' : 'text-stone-300 bg-stone-800/80'
            }`}
          >
            <Replace className="w-3.5 h-3.5" />
            Substitutes
          </button>
          <button
            onClick={() => setActiveTab('shopping')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'shopping' ? 'bg-amber-600 text-white' : 'text-stone-300 bg-stone-800/80'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Grocery {shoppingCount > 0 && `(${shoppingCount})`}
          </button>
          <button
            onClick={() => setActiveTab('timers')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'timers' ? 'bg-amber-600 text-white' : 'text-stone-300 bg-stone-800/80'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            Timers {activeTimersCount > 0 && `(${activeTimersCount})`}
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'saved' ? 'bg-amber-600 text-white' : 'text-stone-300 bg-stone-800/80'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            Saved {savedCount > 0 && `(${savedCount})`}
          </button>
        </div>
      </div>

      {/* Preferences Popover Modal */}
      {showPrefModal && (
        <div className="absolute top-16 right-4 sm:right-8 w-80 bg-stone-900 border border-stone-700 rounded-xl shadow-2xl p-5 z-50 text-stone-200">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <h3 className="font-semibold text-sm text-stone-100 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-amber-500" />
              Kitchen Preferences
            </h3>
            <button
              onClick={() => setShowPrefModal(false)}
              className="text-stone-400 hover:text-white text-xs px-2 py-1 rounded"
            >
              Close
            </button>
          </div>

          <div className="space-y-4 pt-3 text-xs">
            {/* Unit System */}
            <div>
              <label className="block text-stone-300 font-medium mb-1">
                Default Measurement Units
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPreferences((p) => ({ ...p, units: 'metric' }))}
                  className={`py-1.5 px-3 rounded-lg border text-center font-medium transition-all ${
                    preferences.units === 'metric'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                      : 'border-stone-700 bg-stone-800 text-stone-400 hover:text-white'
                  }`}
                >
                  Metric (g, ml, kg)
                </button>
                <button
                  onClick={() => setPreferences((p) => ({ ...p, units: 'us' }))}
                  className={`py-1.5 px-3 rounded-lg border text-center font-medium transition-all ${
                    preferences.units === 'us'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                      : 'border-stone-700 bg-stone-800 text-stone-400 hover:text-white'
                  }`}
                >
                  US / Imperial (oz, cups)
                </button>
              </div>
            </div>

            {/* Default Servings */}
            <div>
              <label className="block text-stone-300 font-medium mb-1">
                Default Servings: <span className="text-amber-400 font-bold">{preferences.servings} people</span>
              </label>
              <div className="flex items-center gap-1.5">
                {[2, 4, 6, 8, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => setPreferences((p) => ({ ...p, servings: num }))}
                    className={`flex-1 py-1 rounded border text-xs font-semibold ${
                      preferences.servings === num
                        ? 'border-amber-500 bg-amber-500 text-stone-900'
                        : 'border-stone-700 bg-stone-800 text-stone-300 hover:bg-stone-700'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary Preference */}
            <div>
              <label className="block text-stone-300 font-medium mb-1">
                Dietary Focus (Optional)
              </label>
              <select
                value={preferences.dietary}
                onChange={(e) => setPreferences((p) => ({ ...p, dietary: e.target.value }))}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500"
              >
                <option value="">No Restrictions</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Gluten-free">Gluten-Free</option>
                <option value="Dairy-free">Dairy-Free</option>
                <option value="Nut-free">Nut-Free</option>
                <option value="Halal">Halal</option>
                <option value="Jain">Jain (No root vegetables)</option>
                <option value="High-protein">High Protein</option>
                <option value="Low-carb">Low Carb / Keto</option>
              </select>
            </div>

            {/* Spice Level */}
            <div>
              <label className="block text-stone-300 font-medium mb-1">
                Spice Preference
              </label>
              <select
                value={preferences.spiceLevel}
                onChange={(e) => setPreferences((p) => ({ ...p, spiceLevel: e.target.value }))}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500"
              >
                <option value="Mild">Mild / Gentle</option>
                <option value="Medium">Medium (Balanced)</option>
                <option value="Spicy">Spicy (Authentic heat)</option>
                <option value="Extra Hot">Extra Hot</option>
              </select>
            </div>

            <div className="pt-2 text-[11px] text-stone-400 border-t border-stone-800 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              <span>These preferences will guide all new recipes and AI chats.</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
