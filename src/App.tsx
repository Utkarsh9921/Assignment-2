import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { RecipeCardView } from './components/RecipeCardView';
import { CookModeModal } from './components/CookModeModal';
import { AssistantChat } from './components/AssistantChat';
import { PantryMatcher } from './components/PantryMatcher';
import { SubstitutionExplorer } from './components/SubstitutionExplorer';
import { ShoppingList } from './components/ShoppingList';
import { KitchenTimersAndGuides } from './components/KitchenTimersAndGuides';
import { SavedRecipes } from './components/SavedRecipes';
import { SAMPLE_RECIPES } from './data/sampleRecipes';
import {
  Recipe,
  ShoppingItem,
  ActiveTimer,
  KitchenPreferences,
  ChatMessage,
} from './types/recipe';
import { playKitchenChime } from './utils/audio';
import { Clock, Play, Pause, AlertCircle, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');

  // Preferences
  const [preferences, setPreferences] = useState<KitchenPreferences>(() => {
    const saved = localStorage.getItem('gourmet_preferences');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return {
      servings: 4,
      dietary: '',
      equipment: 'Standard kitchen',
      pantry: '',
      spiceLevel: 'Medium',
      units: 'metric',
    };
  });

  useEffect(() => {
    localStorage.setItem('gourmet_preferences', JSON.stringify(preferences));
  }, [preferences]);

  // Current active recipe for the Recipe Card view
  const [currentRecipe, setCurrentRecipe] = useState<Recipe>(SAMPLE_RECIPES[0]);

  // Saved / Bookmarked recipes
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem('gourmet_saved_recipes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [SAMPLE_RECIPES[0], SAMPLE_RECIPES[1], SAMPLE_RECIPES[2]];
  });

  useEffect(() => {
    localStorage.setItem('gourmet_saved_recipes', JSON.stringify(savedRecipes));
  }, [savedRecipes]);

  // Grocery Shopping List
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>(() => {
    const saved = localStorage.getItem('gourmet_shopping_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        id: 'shop_demo_1',
        name: 'Boneless skinless chicken thighs',
        amount: '600g',
        category: 'Fresh & Main Ingredients',
        checked: false,
      },
      {
        id: 'shop_demo_2',
        name: 'San Marzano tomatoes',
        amount: '1 can (400g)',
        category: 'Pantry & Grocery',
        checked: false,
      },
      {
        id: 'shop_demo_3',
        name: 'Fresh basil leaves',
        amount: '1 bunch',
        category: 'Fresh & Main Ingredients',
        checked: true,
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('gourmet_shopping_list', JSON.stringify(shoppingItems));
  }, [shoppingItems]);

  // Global Active Kitchen Timers
  const [timers, setTimers] = useState<ActiveTimer[]>([
    {
      id: 'timer_default',
      label: 'Gentle Simmer',
      totalSeconds: 600,
      remainingSeconds: 600,
      isRunning: false,
    },
  ]);

  // Cook Mode Fullscreen Modal
  const [isCookModeOpen, setIsCookModeOpen] = useState(false);
  const [cookModeServings, setCookModeServings] = useState(4);

  // Chat message history
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `🍽️ **Welcome to GourmetAI — Your Expert Culinary Assistant**

I am ready to help you discover, master, and customize recipes with exact measurements, beginner-friendly instructions, and food-safety guidelines!

**Try asking me:**
- *"Give me a recipe for butter chicken"*
- *"How do I make pizza at home?"*
- *"I have potatoes and eggs. What can I make?"*
- *"Give me a healthy chicken recipe"*
- *"Make this recipe vegetarian"* or *"I don't have an oven"*
- *"Scale this recipe for 10 people"*

What would you like to cook today?`,
      timestamp: Date.now(),
    },
  ]);

  // Timer Tick Engine
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers((prevTimers) => {
        let anyJustFinished = false;
        const nextTimers = prevTimers.map((t) => {
          if (t.isRunning && t.remainingSeconds > 0) {
            const nextSec = t.remainingSeconds - 1;
            if (nextSec === 0) {
              anyJustFinished = true;
            }
            return {
              ...t,
              remainingSeconds: nextSec,
              isRunning: nextSec > 0,
            };
          }
          return t;
        });

        if (anyJustFinished) {
          playKitchenChime();
        }

        return nextTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleAddTimer = (label: string, minutes: number) => {
    const newTimer: ActiveTimer = {
      id: `timer_${Date.now()}`,
      label,
      totalSeconds: minutes * 60,
      remainingSeconds: minutes * 60,
      isRunning: true,
    };
    setTimers((prev) => [newTimer, ...prev]);
  };

  const handleToggleUnitSystem = () => {
    setPreferences((prev) => ({
      ...prev,
      units: prev.units === 'metric' ? 'us' : 'metric',
    }));
  };

  const handleEnterCookMode = (servings: number) => {
    setCookModeServings(servings);
    setIsCookModeOpen(true);
  };

  const handleAddToShoppingList = (
    newItems: { name: string; amount: string; category: string }[]
  ) => {
    const formatted: ShoppingItem[] = newItems.map((item, idx) => ({
      id: `shop_${Date.now()}_${idx}`,
      name: item.name,
      amount: item.amount,
      category: item.category || 'Pantry & Grocery',
      checked: false,
      recipeName: currentRecipe.name,
    }));
    setShoppingItems((prev) => [...formatted, ...prev]);
  };

  const handleSaveRecipe = (recipeToSave: Recipe) => {
    const isAlreadySaved = savedRecipes.some((r) => r.id === recipeToSave.id);
    if (isAlreadySaved) {
      setSavedRecipes((prev) => prev.filter((r) => r.id !== recipeToSave.id));
    } else {
      setSavedRecipes((prev) => [recipeToSave, ...prev]);
    }
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    setCurrentRecipe(recipe);
    setActiveTab('recipe');
  };

  const handleSendPromptToChat = (prompt: string) => {
    setActiveTab('chat');
    // Send message to assistant
    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}_u`,
      role: 'user',
      content: prompt,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);

    // Trigger API call via chat form simulation
    (async () => {
      const assistantMsgId = `msg_${Date.now()}_a`;
      const initialAssistantMsg: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, initialAssistantMsg]);

      try {
        const response = await fetch('/api/recipe/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...messages, userMsg].map((m) => ({
              role: m.role,
              content: m.content,
            })),
            userPreferences: preferences,
          }),
        });

        if (!response.body) return;
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let text = '';
        let done = false;

        while (!done) {
          const { value, done: streamDone } = await reader.read();
          done = streamDone;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.slice(6).trim();
                if (dataStr === '[DONE]') {
                  done = true;
                  break;
                }
                try {
                  const p = JSON.parse(dataStr);
                  if (p.text) {
                    text += p.text;
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === assistantMsgId ? { ...m, content: text } : m
                      )
                    );
                  }
                } catch {}
              }
            }
          }
        }
      } catch (err: any) {
        console.error(err);
      }
    })();
  };

  // Convert markdown recipe or title into a structured recipe object
  const handleParseAndLoadRecipe = async (markdownText: string): Promise<Recipe | null> => {
    try {
      const response = await fetch('/api/recipe/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: markdownText,
          servings: preferences.servings,
          dietary: preferences.dietary,
          units: preferences.units,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate structured recipe');
      }

      const data = await response.json();
      if (data.recipe) {
        setCurrentRecipe(data.recipe);
        setActiveTab('recipe');
        return data.recipe;
      }
    } catch (err) {
      console.warn('API parsing fallback to client parser:', err);
      // Fallback: search if matches one of the sample recipes
      const match = SAMPLE_RECIPES.find((s) =>
        markdownText.toLowerCase().includes(s.name.toLowerCase().slice(0, 10))
      );
      if (match) {
        setCurrentRecipe(match);
        setActiveTab('recipe');
        return match;
      }
    }
    return null;
  };

  // Check active running timer for floating indicator
  const runningTimer = timers.find((t) => t.isRunning);
  const finishedTimer = timers.find((t) => t.remainingSeconds === 0);

  const isCurrentSaved = savedRecipes.some((r) => r.id === currentRecipe.id);

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/25 font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        shoppingCount={shoppingItems.filter((i) => !i.checked).length}
        activeTimersCount={timers.filter((t) => t.isRunning || t.remainingSeconds === 0).length}
        savedCount={savedRecipes.length}
        preferences={preferences}
        setPreferences={setPreferences}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'chat' && (
          <AssistantChat
            messages={messages}
            setMessages={setMessages}
            preferences={preferences}
            onOpenRecipe={handleSelectRecipe}
            onLoadParsedRecipe={handleParseAndLoadRecipe}
          />
        )}

        {activeTab === 'recipe' && (
          <RecipeCardView
            recipe={currentRecipe}
            unitSystem={preferences.units}
            onToggleUnitSystem={handleToggleUnitSystem}
            onEnterCookMode={handleEnterCookMode}
            onAddToShoppingList={handleAddToShoppingList}
            onSaveRecipe={handleSaveRecipe}
            isSaved={isCurrentSaved}
            onAddTimer={handleAddTimer}
            onAskModification={handleSendPromptToChat}
          />
        )}

        {activeTab === 'pantry' && (
          <PantryMatcher
            onSelectRecipe={handleSelectRecipe}
            onSendToChat={handleSendPromptToChat}
          />
        )}

        {activeTab === 'substitutions' && (
          <SubstitutionExplorer onAskChat={handleSendPromptToChat} />
        )}

        {activeTab === 'shopping' && (
          <ShoppingList
            items={shoppingItems}
            setItems={setShoppingItems}
            onGoToRecipes={() => setActiveTab('saved')}
          />
        )}

        {activeTab === 'timers' && (
          <KitchenTimersAndGuides
            timers={timers}
            setTimers={setTimers}
            onAddTimer={handleAddTimer}
          />
        )}

        {activeTab === 'saved' && (
          <SavedRecipes
            savedRecipes={savedRecipes}
            curatedRecipes={SAMPLE_RECIPES}
            onSelectRecipe={handleSelectRecipe}
            onRemoveSaved={(id) => setSavedRecipes((prev) => prev.filter((r) => r.id !== id))}
          />
        )}
      </main>

      {/* Floating Active Timer / Finished Notification Bar */}
      {(runningTimer || finishedTimer) && activeTab !== 'timers' && (
        <div
          onClick={() => setActiveTab('timers')}
          className={`fixed bottom-5 right-5 z-40 p-4 rounded-2xl shadow-2xl border flex items-center gap-3 cursor-pointer transition-all hover:scale-105 ${
            finishedTimer
              ? 'bg-rose-600 text-white border-rose-400 animate-bounce'
              : 'bg-stone-900 text-white border-stone-700'
          }`}
        >
          <Clock className={`w-5 h-5 ${finishedTimer ? 'animate-spin' : 'text-amber-400'}`} />
          <div>
            <div className="text-xs font-bold leading-tight">
              {finishedTimer ? 'Timer Done!' : runningTimer?.label}
            </div>
            <div className="font-mono text-xs text-amber-300">
              {finishedTimer
                ? 'Check your food!'
                : `${Math.floor(runningTimer!.remainingSeconds / 60)}m ${
                    runningTimer!.remainingSeconds % 60
                  }s left`}
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Distraction-Free Cook Mode Modal */}
      {isCookModeOpen && (
        <CookModeModal
          recipe={currentRecipe}
          servings={cookModeServings}
          unitSystem={preferences.units}
          isOpen={isCookModeOpen}
          onClose={() => setIsCookModeOpen(false)}
          onAddTimer={handleAddTimer}
        />
      )}
    </div>
  );
}
