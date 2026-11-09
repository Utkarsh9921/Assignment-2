import React, { useState } from 'react';
import {
  Bookmark,
  Clock,
  Flame,
  Users,
  Search,
  BookOpen,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { Recipe } from '../types/recipe';

interface SavedRecipesProps {
  savedRecipes: Recipe[];
  curatedRecipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  onRemoveSaved: (id: string) => void;
}

export const SavedRecipes: React.FC<SavedRecipesProps> = ({
  savedRecipes,
  curatedRecipes,
  onSelectRecipe,
  onRemoveSaved,
}) => {
  const [filter, setFilter] = useState<'all' | 'saved' | 'curated'>('all');
  const [search, setSearch] = useState('');

  const all = [
    ...savedRecipes,
    ...curatedRecipes.filter((c) => !savedRecipes.some((s) => s.id === c.id)),
  ];

  const displayedList = all.filter((r) => {
    const isSaved = savedRecipes.some((s) => s.id === r.id);
    if (filter === 'saved' && !isSaved) return false;
    if (filter === 'curated' && isSaved) return false;

    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.cuisine.toLowerCase().includes(q) ||
      r.difficulty.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 flex items-center gap-2.5">
            <Bookmark className="w-6 h-6 text-amber-600" />
            <span>Recipe Collection</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {savedRecipes.length} saved personal recipes • {curatedRecipes.length} chef specialties
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All ({all.length})
          </button>
          <button
            onClick={() => setFilter('saved')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filter === 'saved'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Saved ({savedRecipes.length})
          </button>
          <button
            onClick={() => setFilter('curated')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filter === 'curated'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Curated Classics
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-4 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by recipe name, cuisine, or ingredients..."
          className="w-full bg-white border border-stone-300 rounded-2xl pl-11 pr-4 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-600 shadow-2xs"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedList.map((recipe) => {
          const isUserSaved = savedRecipes.some((s) => s.id === recipe.id);

          return (
            <div
              key={recipe.id}
              className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between overflow-hidden group cursor-pointer"
              onClick={() => onSelectRecipe(recipe)}
            >
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                    {recipe.cuisine}
                  </span>

                  <div className="flex items-center gap-1">
                    {isUserSaved && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                        Saved
                      </span>
                    )}
                    {isUserSaved && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveSaved(recipe.id);
                        }}
                        className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                        title="Remove from saved"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <h3 className="font-serif font-bold text-xl text-stone-900 group-hover:text-amber-700 transition-colors line-clamp-2">
                  🍽️ {recipe.name}
                </h3>

                {recipe.summary && (
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {recipe.summary}
                  </p>
                )}

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-stone-100 text-[11px] text-stone-600 font-medium">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>{recipe.totalTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-600" />
                    <span>{recipe.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-amber-600" />
                    <span>{recipe.servings} Servings</span>
                  </div>
                </div>
              </div>

              <div className="bg-stone-50 px-6 py-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-amber-700 group-hover:bg-amber-50/60 transition-colors">
                <span>View Recipe Card & Scaler</span>
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {displayedList.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 text-stone-400 text-xs">
          No recipes found matching your filter.
        </div>
      )}
    </div>
  );
};
