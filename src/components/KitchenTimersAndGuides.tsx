import React, { useState } from 'react';
import {
  Timer as TimerIcon,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  Plus,
  ShieldAlert,
  Thermometer,
  Calculator,
  Flame,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { ActiveTimer } from '../types/recipe';

interface KitchenTimersAndGuidesProps {
  timers: ActiveTimer[];
  setTimers: React.Dispatch<React.SetStateAction<ActiveTimer[]>>;
  onAddTimer: (label: string, minutes: number) => void;
}

export const KitchenTimersAndGuides: React.FC<KitchenTimersAndGuidesProps> = ({
  timers,
  setTimers,
  onAddTimer,
}) => {
  const [timerLabel, setTimerLabel] = useState('');
  const [timerMinutes, setTimerMinutes] = useState(10);

  // Unit converter state
  const [convertType, setConvertType] = useState<'temp' | 'weight' | 'volume'>('temp');
  const [convertVal, setConvertVal] = useState('180');

  const handleCreateTimer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!timerMinutes || timerMinutes <= 0) return;
    onAddTimer(timerLabel.trim() || `Kitchen Timer (${timerMinutes}m)`, timerMinutes);
    setTimerLabel('');
  };

  const toggleTimerRunning = (id: string) => {
    setTimers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isRunning: !t.isRunning } : t))
    );
  };

  const resetTimer = (id: string) => {
    setTimers((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, remainingSeconds: t.totalSeconds, isRunning: false } : t
      )
    );
  };

  const deleteTimer = (id: string) => {
    setTimers((prev) => prev.filter((t) => t.id !== id));
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Temperature guides according to food safety guidelines
  const SAFE_TEMPS = [
    {
      food: 'Poultry & Fowl',
      desc: 'Chicken, turkey, duck (breasts, thighs, ground, wings)',
      celsius: '74°C',
      fahrenheit: '165°F',
      dangerNote: 'Must never be served rare. Test at thickest part away from bone.',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    },
    {
      food: 'Ground Meats',
      desc: 'Minced beef, pork, veal, lamb burgers & meatballs',
      celsius: '71°C',
      fahrenheit: '160°F',
      dangerNote: 'Surface bacteria are mixed throughout grinding process; full cook required.',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      food: 'Whole Steaks, Chops & Roasts',
      desc: 'Beef, pork, lamb, veal steaks (Medium: 63°C / Medium-Well: 68°C)',
      celsius: '63°C',
      fahrenheit: '145°F',
      dangerNote: 'Allow a mandatory 3-minute rest time after removing from heat.',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
      food: 'Fish & Fin Seafood',
      desc: 'Salmon, white fish, cod, halibut',
      celsius: '63°C',
      fahrenheit: '145°F',
      dangerNote: 'Flesh turns opaque and flakes easily with a fork.',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    },
    {
      food: 'Egg Dishes & Custards',
      desc: 'Frittatas, quiches, breakfast bakes',
      celsius: '71°C',
      fahrenheit: '160°F',
      dangerNote: 'Yolk and whites should be set firm, not watery.',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    },
    {
      food: 'Reheated Leftovers & Casseroles',
      desc: 'Any chilled or cooked food warmed for consumption',
      celsius: '74°C',
      fahrenheit: '165°F',
      dangerNote: 'Must be steaming hot throughout. Never reheat leftovers more than once.',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-12">
      {/* 1. Multi-Timer Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600">
              <TimerIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                Kitchen Multi-Timer Hub
              </h2>
              <p className="text-xs text-stone-500">
                Run simultaneous timers with gentle audio chimes when steps finish
              </p>
            </div>
          </div>
        </div>

        {/* Create new timer form */}
        <form onSubmit={handleCreateTimer} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={timerLabel}
            onChange={(e) => setTimerLabel(e.target.value)}
            placeholder="Timer name (e.g. Pasta boiling, Chicken simmering, Bread proofing)..."
            className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-4 py-2 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-600"
          />
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="360"
              value={timerMinutes}
              onChange={(e) => setTimerMinutes(parseInt(e.target.value) || 1)}
              className="w-20 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-amber-600 text-center font-bold"
            />
            <span className="text-xs font-semibold text-stone-600">mins</span>

            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              <span>Start Timer</span>
            </button>
          </div>
        </form>

        {/* Quick Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider mr-1">
            Presets:
          </span>
          {[
            { label: 'Soft Boiled Egg', m: 6 },
            { label: 'Hard Boiled Egg', m: 10 },
            { label: 'Al Dente Pasta', m: 9 },
            { label: 'Steep Tea', m: 4 },
            { label: 'Simmer Sauce', m: 15 },
            { label: 'Rest Meat', m: 5 },
          ].map((preset, idx) => (
            <button
              key={idx}
              onClick={() => onAddTimer(preset.label, preset.m)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-stone-100 hover:bg-amber-50 text-stone-700 hover:text-amber-800 border border-stone-200 transition-colors"
            >
              + {preset.label} ({preset.m}m)
            </button>
          ))}
        </div>

        {/* Active Timers Grid */}
        {timers.length === 0 ? (
          <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-300 text-stone-400 text-xs">
            No timers active. Click a preset above or start one from any recipe step!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {timers.map((timer) => {
              const isFinished = timer.remainingSeconds === 0;

              return (
                <div
                  key={timer.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isFinished
                      ? 'bg-rose-50 border-rose-400 shadow-md animate-pulse'
                      : timer.isRunning
                      ? 'bg-amber-50/60 border-amber-300 shadow-xs'
                      : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm text-stone-800 line-clamp-1">
                      {timer.label}
                    </span>
                    <button
                      onClick={() => deleteTimer(timer.id)}
                      className="text-stone-400 hover:text-rose-600 p-1"
                      title="Delete timer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div
                      className={`font-mono text-3xl font-bold ${
                        isFinished
                          ? 'text-rose-600'
                          : timer.isRunning
                          ? 'text-amber-600'
                          : 'text-stone-700'
                      }`}
                    >
                      {formatSeconds(timer.remainingSeconds)}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleTimerRunning(timer.id)}
                        className={`p-2.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-colors ${
                          timer.isRunning
                            ? 'bg-amber-600 text-white hover:bg-amber-700'
                            : 'bg-stone-800 text-white hover:bg-stone-900'
                        }`}
                      >
                        {timer.isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => resetTimer(timer.id)}
                        className="p-2.5 rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors"
                        title="Reset timer"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Safe Internal Cooking Temperatures (Food Safety Constitution) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-stone-900">
                Safe Minimum Cooking Temperatures
              </h2>
              <p className="text-xs text-stone-500">
                Crucial food-safety standards to prevent foodborne illness
              </p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-300 text-xs text-amber-950 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>The Temperature Danger Zone:</strong> Bacteria multiply rapidly between{' '}
            <strong>4°C and 60°C (40°F – 140°F)</strong>. Never leave cooked or perishable foods at
            room temperature for more than <strong>2 hours</strong> (or 1 hour if above 32°C/90°F).
            Always insert instant-read digital food thermometers into the thickest part of the food.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SAFE_TEMPS.map((item, idx) => (
            <div
              key={idx}
              className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-2 text-xs sm:text-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-stone-900 text-sm sm:text-base">
                    {item.food}
                  </h3>
                  <p className="text-xs text-stone-500">{item.desc}</p>
                </div>
                <div className="text-right whitespace-nowrap">
                  <span className="font-bold text-base text-rose-700 block">
                    {item.celsius}
                  </span>
                  <span className="text-[11px] text-stone-500">
                    ({item.fahrenheit})
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200 text-xs text-stone-600">
                <strong>Cue:</strong> {item.dangerNote}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Kitchen Unit & Oven Temperature Converter */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-stone-200">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-600">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              Kitchen Measurement Quick Reference
            </h2>
            <p className="text-xs text-stone-500">
              Instant conversions for oven dials, liquids, and baking weights
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Temperature Guide */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-amber-900 pb-1 border-b border-stone-200">
              Oven Temperature
            </h4>
            <div className="space-y-1.5 font-mono text-[11px] text-stone-700">
              <div className="flex justify-between">
                <span>150°C (Slow)</span>
                <span>= 300°F (Gas 2)</span>
              </div>
              <div className="flex justify-between">
                <span>180°C (Moderate)</span>
                <span>= 350°F (Gas 4)</span>
              </div>
              <div className="flex justify-between">
                <span>200°C (Hot)</span>
                <span>= 400°F (Gas 6)</span>
              </div>
              <div className="flex justify-between">
                <span>220°C (Very Hot)</span>
                <span>= 425°F (Gas 7)</span>
              </div>
              <div className="flex justify-between">
                <span>250°C (Pizza)</span>
                <span>= 485°F (Gas 9)</span>
              </div>
            </div>
          </div>

          {/* Volume Guide */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-amber-900 pb-1 border-b border-stone-200">
              Volume Equivalents
            </h4>
            <div className="space-y-1.5 font-mono text-[11px] text-stone-700">
              <div className="flex justify-between">
                <span>1 tsp (teaspoon)</span>
                <span>= 5 ml</span>
              </div>
              <div className="flex justify-between">
                <span>1 tbsp (tablespoon)</span>
                <span>= 3 tsp / 15 ml</span>
              </div>
              <div className="flex justify-between">
                <span>1/4 Cup</span>
                <span>= 4 tbsp / 60 ml</span>
              </div>
              <div className="flex justify-between">
                <span>1 Cup</span>
                <span>= 16 tbsp / 240 ml</span>
              </div>
              <div className="flex justify-between">
                <span>1 Liter (1000ml)</span>
                <span>≈ 4.2 Cups</span>
              </div>
            </div>
          </div>

          {/* Weight & Flour */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-amber-900 pb-1 border-b border-stone-200">
              Baking Weight Baselines
            </h4>
            <div className="space-y-1.5 font-mono text-[11px] text-stone-700">
              <div className="flex justify-between">
                <span>1 Cup All-Purpose Flour</span>
                <span>≈ 120–125 g</span>
              </div>
              <div className="flex justify-between">
                <span>1 Cup Granulated Sugar</span>
                <span>≈ 200 g</span>
              </div>
              <div className="flex justify-between">
                <span>1 Cup Brown Sugar</span>
                <span>≈ 220 g (packed)</span>
              </div>
              <div className="flex justify-between">
                <span>1 Stick Butter (US)</span>
                <span>= 8 tbsp / 113 g</span>
              </div>
              <div className="flex justify-between">
                <span>1 Ounce (oz)</span>
                <span>≈ 28.35 g</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
