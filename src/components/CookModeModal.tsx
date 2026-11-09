import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Recipe, RecipeStep } from '../types/recipe';
import { scaleIngredient } from '../utils/scaler';
import { playKitchenChime } from '../utils/audio';

interface CookModeModalProps {
  recipe: Recipe;
  servings: number;
  unitSystem: 'metric' | 'us';
  isOpen: boolean;
  onClose: () => void;
  onAddTimer: (label: string, minutes: number) => void;
}

export const CookModeModal: React.FC<CookModeModalProps> = ({
  recipe,
  servings,
  unitSystem,
  isOpen,
  onClose,
  onAddTimer,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showIngredientsPeek, setShowIngredientsPeek] = useState(false);

  // Step-level countdown timer
  const [stepTimerSeconds, setStepTimerSeconds] = useState<number | null>(null);
  const [stepTimerRunning, setStepTimerRunning] = useState(false);

  const steps = recipe.instructions;
  const currentStep: RecipeStep | undefined = steps[currentStepIndex];

  // Reset or initialize step timer when step changes
  useEffect(() => {
    if (currentStep?.timerMinutes && currentStep.timerMinutes > 0) {
      setStepTimerSeconds(currentStep.timerMinutes * 60);
      setStepTimerRunning(false);
    } else {
      setStepTimerSeconds(null);
      setStepTimerRunning(false);
    }
    // Stop any ongoing speech when changing step
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [currentStepIndex, currentStep]);

  // Tick step timer
  useEffect(() => {
    let interval: any = null;
    if (stepTimerRunning && stepTimerSeconds !== null && stepTimerSeconds > 0) {
      interval = setInterval(() => {
        setStepTimerSeconds((prev) => {
          if (prev !== null && prev <= 1) {
            playKitchenChime();
            setStepTimerRunning(false);
            return 0;
          }
          return prev !== null ? prev - 1 : null;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [stepTimerRunning, stepTimerSeconds]);

  if (!isOpen || !currentStep) return null;

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const textToSpeak = `Step ${currentStep.stepNumber}: ${currentStep.title}. ${currentStep.text}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleNext = () => {
    setCompletedSteps((prev) => ({ ...prev, [currentStepIndex]: true }));
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const isLastStep = currentStepIndex === steps.length - 1;
  const progressPercent = Math.round(((currentStepIndex + 1) / steps.length) * 100);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950 text-stone-100 flex flex-col overflow-hidden animate-fade-in">
      {/* Top Bar */}
      <header className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-900/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center font-bold text-white text-sm">
            🍳
          </div>
          <div>
            <h2 className="font-semibold text-stone-100 text-sm sm:text-base line-clamp-1">
              {recipe.name}
            </h2>
            <p className="text-xs text-stone-400">
              Cook Mode • Scaled for {servings} servings ({unitSystem === 'metric' ? 'Metric' : 'US Units'})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Peek ingredients toggle */}
          <button
            onClick={() => setShowIngredientsPeek(!showIngredientsPeek)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              showIngredientsPeek
                ? 'bg-amber-600 border-amber-500 text-white'
                : 'bg-stone-800 border-stone-700 text-stone-300 hover:text-white'
            }`}
          >
            📋 Ingredients
          </button>

          {/* Close cook mode */}
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
            title="Exit Cook Mode"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="w-full bg-stone-800 h-1.5">
        <div
          className="bg-amber-500 h-1.5 transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Step Content */}
        <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 max-w-4xl mx-auto overflow-y-auto">
          <div className="space-y-6">
            {/* Step Counter & TTS Button */}
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Step {currentStep.stepNumber} of {steps.length}
              </span>

              {'speechSynthesis' in window && (
                <button
                  onClick={toggleSpeech}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    isSpeaking
                      ? 'bg-amber-600 border-amber-500 text-white animate-pulse'
                      : 'bg-stone-800 border-stone-700 text-stone-300 hover:text-white'
                  }`}
                  title="Read step out loud"
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-4 h-4 text-white" />
                      <span>Stop Reading</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-amber-400" />
                      <span>Read Aloud</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Step Title */}
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
              {currentStep.title}
            </h1>

            {/* Detailed Instructions */}
            <div className="text-lg sm:text-2xl text-stone-200 leading-relaxed font-normal bg-stone-900/60 p-6 sm:p-8 rounded-2xl border border-stone-800/80 shadow-inner">
              {currentStep.text}
            </div>

            {/* Safety Temp / Visual Cue Tip */}
            {currentStep.tempTip && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-950/40 border border-amber-700/50 text-amber-200 text-sm sm:text-base">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-amber-300">Important Cue / Temperature: </span>
                  {currentStep.tempTip}
                </div>
              </div>
            )}

            {/* Step Countdown Timer Widget */}
            {currentStep.timerMinutes && currentStep.timerMinutes > 0 && (
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-200">
                      Step Timer: {currentStep.timerMinutes} Minutes
                    </h4>
                    <p className="text-xs text-stone-400">
                      {stepTimerSeconds === 0 ? 'Timer completed!' : 'Click play to start timer'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="font-mono text-3xl font-bold text-amber-400 min-w-[100px] text-center">
                    {stepTimerSeconds !== null ? formatTime(stepTimerSeconds) : '--:--'}
                  </div>

                  <button
                    onClick={() => setStepTimerRunning(!stepTimerRunning)}
                    className="p-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-colors flex items-center gap-1.5"
                  >
                    {stepTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>

                  <button
                    onClick={() => {
                      setStepTimerRunning(false);
                      setStepTimerSeconds(currentStep.timerMinutes! * 60);
                    }}
                    className="p-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                    title="Reset timer"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => onAddTimer(`${recipe.name} - Step ${currentStep.stepNumber}`, currentStep.timerMinutes!)}
                    className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs text-stone-300 border border-stone-700"
                    title="Pin to global timers"
                  >
                    Pin Timer
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Step Navigation Bar */}
          <div className="pt-8 border-t border-stone-800/80 flex items-center justify-between gap-4 mt-8">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all ${
                currentStepIndex === 0
                  ? 'opacity-30 cursor-not-allowed bg-stone-800 text-stone-500'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous Step</span>
            </button>

            {isLastStep ? (
              <button
                onClick={() => {
                  playKitchenChime();
                  onClose();
                }}
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg shadow-emerald-900/30 transition-all hover:scale-105"
              >
                <Sparkles className="w-5 h-5" />
                <span>Finish Cooking & Enjoy!</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white shadow-lg shadow-amber-900/30 transition-all hover:scale-105"
              >
                <span>Next Step</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Side Panel: Ingredients Peek */}
        {showIngredientsPeek && (
          <aside className="w-80 border-l border-stone-800 bg-stone-900/95 p-6 overflow-y-auto hidden md:block animate-slide-left">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-4">
              <h3 className="font-serif font-bold text-stone-100 flex items-center gap-2">
                <span>🛒 Ingredients</span>
                <span className="text-xs font-sans px-2 py-0.5 rounded bg-stone-800 text-amber-300">
                  {servings} servings
                </span>
              </h3>
              <button
                onClick={() => setShowIngredientsPeek(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-5 text-sm">
              {recipe.ingredientSections.map((sec, secIdx) => (
                <div key={secIdx}>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                    {sec.title}
                  </h4>
                  <ul className="space-y-2 text-xs text-stone-300">
                    {sec.items.map((item, itemIdx) => {
                      const scaled = scaleIngredient(item, recipe.servings, servings, unitSystem);
                      return (
                        <li key={itemIdx} className="leading-snug">
                          • {scaled.fullText}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};
