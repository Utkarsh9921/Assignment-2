import React, { useState } from 'react';
import {
  Replace,
  Search,
  Sparkles,
  Loader2,
  BookOpen,
  Info,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { CURATED_SUBSTITUTIONS, CuratedSubstitution } from '../data/sampleRecipes';

interface SubstitutionExplorerProps {
  onAskChat: (prompt: string) => void;
}

export const SubstitutionExplorer: React.FC<SubstitutionExplorerProps> = ({
  onAskChat,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [aiCustomInput, setAiCustomInput] = useState('');
  const [aiCustomContext, setAiCustomContext] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  const categories = ['All', 'Dairy', 'Baking', 'Pantry', 'Condiments', 'Spices'];

  const filtered = CURATED_SUBSTITUTIONS.filter((sub) => {
    const matchesCategory =
      selectedCategory === 'All' || sub.category === selectedCategory;
    const matchesSearch =
      sub.ingredient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.substitute.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAskAI = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!aiCustomInput.trim()) return;

    setAiLoading(true);
    setAiResult(null);

    try {
      const response = await fetch('/api/recipe/substitute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredient: aiCustomInput,
          dishContext: aiCustomContext || undefined,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch substitution advice');
      }

      setAiResult(data.text);
    } catch (err: any) {
      console.error(err);
      setAiResult(
        `Error getting substitution: ${err.message || 'Please check your connection.'}`
      );
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <Replace className="w-5 h-5 text-amber-400" />
          </div>
          <span className="text-xs uppercase tracking-widest font-bold text-amber-300">
            Kitchen Savvy
          </span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight mb-2">
          Ingredient Substitutions & Swaps
        </h1>
        <p className="text-stone-300 text-sm sm:text-base max-w-2xl leading-relaxed">
          Missing an ingredient? Don't abandon your recipe! Find practical kitchen alternatives formatted with culinary notes on texture, flavor, and chemistry.
        </p>
      </div>

      {/* AI Custom Substitution Finder */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <h2 className="font-serif text-xl font-bold text-stone-900">
            Ask the AI Chef for Any Substitution
          </h2>
        </div>
        <p className="text-xs text-stone-500">
          Need a replacement for something obscure or cooking for an allergy? Get exact ratios and texture notes.
        </p>

        <form onSubmit={handleAskAI} className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          <div className="sm:col-span-6">
            <input
              type="text"
              value={aiCustomInput}
              onChange={(e) => setAiCustomInput(e.target.value)}
              placeholder="Ingredient you don't have (e.g. Buttermilk, Mirin, Egg, Heavy cream)..."
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-600"
            />
          </div>
          <div className="sm:col-span-4">
            <input
              type="text"
              value={aiCustomContext}
              onChange={(e) => setAiCustomContext(e.target.value)}
              placeholder="Dish (e.g. In chocolate cake, or In curry)..."
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-600"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={!aiCustomInput.trim() || aiLoading}
              className="w-full h-full min-h-[42px] px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Find Swap</span>}
            </button>
          </div>
        </form>

        {aiResult && (
          <div className="mt-4 p-5 bg-amber-50/70 border border-amber-300 rounded-2xl animate-fade-in text-xs sm:text-sm leading-relaxed text-stone-800 whitespace-pre-line">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-200">
              <span className="font-bold text-amber-900">
                Chef Substitution Advice:
              </span>
              <button
                onClick={() => setAiResult(null)}
                className="text-stone-400 hover:text-stone-700 text-xs"
              >
                Clear
              </button>
            </div>
            {aiResult}
          </div>
        )}
      </div>

      {/* Curated Substitution Library */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-stone-200">
          <div>
            <h2 className="font-serif text-xl font-bold text-stone-900">
              Common Pantry Substitutions Library
            </h2>
            <p className="text-xs text-stone-500">
              Tried-and-true kitchen replacements formatted with culinary guidelines
            </p>
          </div>

          {/* Search filter */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search substitutions..."
              className="w-full bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-amber-600"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Substitutions Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              className="bg-stone-50 rounded-2xl p-5 border border-stone-200/80 hover:border-amber-300 transition-colors space-y-2.5 text-xs sm:text-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 text-base flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                  {item.ingredient}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-stone-200 text-stone-600">
                  {item.category}
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-stone-200">
                <span className="font-bold text-amber-800 block text-xs uppercase tracking-wider mb-0.5">
                  Substitute:
                </span>
                <span className="text-stone-800 font-medium">
                  {item.substitute}
                </span>
              </div>

              <div className="flex items-start gap-2 text-stone-600 text-xs">
                <Info className="w-3.5 h-3.5 text-stone-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong className="text-stone-700">Note: </strong>
                  {item.note}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-10 text-stone-400 text-xs">
            No substitutions found matching "{searchTerm}". Try the AI Chef search above!
          </div>
        )}
      </div>
    </div>
  );
};
