import React, { useState } from 'react';
import {
  ShoppingCart,
  Plus,
  Trash2,
  Check,
  Copy,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { ShoppingItem } from '../types/recipe';

interface ShoppingListProps {
  items: ShoppingItem[];
  setItems: React.Dispatch<React.SetStateAction<ShoppingItem[]>>;
  onGoToRecipes: () => void;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({
  items,
  setItems,
  onGoToRecipes,
}) => {
  const [customName, setCustomName] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [copied, setCopied] = useState(false);

  const toggleCheck = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newItem: ShoppingItem = {
      id: `shop_${Date.now()}`,
      name: customName.trim(),
      amount: customAmount.trim() || undefined,
      category: 'Pantry & Grocery',
      checked: false,
    };

    setItems((prev) => [newItem, ...prev]);
    setCustomName('');
    setCustomAmount('');
  };

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearChecked = () => {
    setItems((prev) => prev.filter((item) => !item.checked));
  };

  const handleClearAll = () => {
    if (window.confirm('Clear entire grocery list?')) {
      setItems([]);
    }
  };

  const handleCopyList = () => {
    if (items.length === 0) return;
    const text = items
      .map((item) => `${item.checked ? '[x]' : '[ ]'} ${item.amount ? `${item.amount} ` : ''}${item.name}`)
      .join('\n');

    navigator.clipboard.writeText(`🛒 GourmetAI Grocery List:\n\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Group by category
  const categories = Array.from(new Set(items.map((i) => i.category || 'General')));

  const uncheckedCount = items.filter((i) => !i.checked).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Kitchen Grocery List
            </h1>
            <p className="text-xs text-stone-500">
              {uncheckedCount} items left to buy • {items.length - uncheckedCount} checked off
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {items.length > 0 && (
            <>
              <button
                onClick={handleCopyList}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                title="Copy grocery list"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleClearChecked}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
              >
                Clear Checked
              </button>

              <button
                onClick={handleClearAll}
                className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-stone-100 transition-colors"
                title="Clear all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Add Custom Item */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs">
        <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Add grocery item (e.g. Greek yogurt, Sourdough bread)..."
            className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-4 py-2 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-600"
          />
          <input
            type="text"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            placeholder="Qty (e.g. 500g, 2 cans)"
            className="sm:w-36 bg-stone-50 border border-stone-300 rounded-xl px-4 py-2 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-600"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </form>
      </div>

      {/* List Items */}
      {items.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-2xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-800">
              Your grocery list is empty
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
              Add individual or full ingredients with 1 click directly from any recipe card!
            </p>
          </div>
          <button
            onClick={onGoToRecipes}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Browse Recipes
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((category) => {
            const catItems = items.filter((i) => (i.category || 'General') === category);
            if (catItems.length === 0) return null;

            return (
              <div
                key={category}
                className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs space-y-3"
              >
                <h3 className="font-bold text-xs uppercase tracking-wider text-amber-800 pb-2 border-b border-stone-100 flex items-center justify-between">
                  <span>{category}</span>
                  <span className="text-[11px] font-normal text-stone-400">
                    {catItems.length} items
                  </span>
                </h3>

                <ul className="space-y-2">
                  {catItems.map((item) => (
                    <li
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors group select-none ${
                        item.checked
                          ? 'bg-emerald-50 text-stone-400 line-through'
                          : 'hover:bg-stone-50 text-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => {}} // handled by parent onClick
                          className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer accent-amber-600"
                        />
                        <span className="text-sm font-medium">
                          {item.name}
                          {item.amount && (
                            <span className="ml-2 text-xs text-stone-500 font-normal">
                              ({item.amount})
                            </span>
                          )}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(item.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-stone-400 hover:text-rose-600 transition-opacity"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
