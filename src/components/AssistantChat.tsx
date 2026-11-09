import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  ChefHat,
  ArrowRight,
  BookOpen,
  Loader2,
  Trash2,
  Flame,
  HelpCircle,
} from 'lucide-react';
import { ChatMessage, KitchenPreferences, Recipe } from '../types/recipe';

interface AssistantChatProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  preferences: KitchenPreferences;
  onOpenRecipe: (recipe: Recipe) => void;
  onLoadParsedRecipe: (markdown: string) => Promise<Recipe | null>;
}

const STARTER_PROMPTS = [
  { label: 'Butter Chicken', prompt: 'Give me a recipe for butter chicken' },
  { label: 'Pizza at Home', prompt: 'How do I make pizza at home?' },
  { label: 'Potatoes & Eggs', prompt: 'I have potatoes and eggs. What can I make?' },
  { label: 'Healthy Chicken', prompt: 'Give me a healthy chicken recipe' },
  { label: '10 People Scaling', prompt: 'Give me a recipe for 10 people for a dinner party' },
  { label: 'No-Oven Baking', prompt: "I don't have an oven. How can I make dessert or bread on a stovetop?" },
];

export const AssistantChat: React.FC<AssistantChatProps> = ({
  messages,
  setMessages,
  preferences,
  onOpenRecipe,
  onLoadParsedRecipe,
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [parsingId, setParsingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    setInput('');

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}_u`,
      role: 'user',
      content: query,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    const assistantMsgId = `msg_${Date.now()}_a`;
    const initialAssistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    };

    setMessages([...newMessages, initialAssistantMsg]);

    try {
      const response = await fetch('/api/recipe/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          userPreferences: preferences,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Server responded with ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body returned from server');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';
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
                const parsed = JSON.parse(dataStr);
                if (parsed.text) {
                  accumulatedText += parsed.text;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMsgId ? { ...m, content: accumulatedText } : m
                    )
                  );
                } else if (parsed.error) {
                  accumulatedText += `\n\n*Error: ${parsed.error}*`;
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantMsgId ? { ...m, content: accumulatedText } : m
                    )
                  );
                }
              } catch {
                // partial JSON or raw string
              }
            }
          }
        }
      }

      // Check if text has follow-up options
      const followUps: string[] = [];
      if (accumulatedText.toLowerCase().includes('want a vegetarian version')) {
        followUps.push('Make this recipe vegetarian');
      }
      if (accumulatedText.toLowerCase().includes('scaled for') || accumulatedText.toLowerCase().includes('people')) {
        followUps.push('Scale this recipe for 10 people');
      }
      if (accumulatedText.toLowerCase().includes('air-fryer') || accumulatedText.toLowerCase().includes('air fryer')) {
        followUps.push('Adapt this recipe for an air-fryer');
      }
      if (accumulatedText.toLowerCase().includes('shopping list')) {
        followUps.push('Generate a shopping list for this recipe');
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? { ...m, followUpOptions: followUps.length > 0 ? followUps : undefined }
            : m
        )
      );
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? {
                ...m,
                content:
                  m.content ||
                  `Sorry, I encountered an issue connecting to the culinary assistant: ${
                    err.message || 'Please check your connection and secrets.'
                  }`,
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInteractiveCardClick = async (messageId: string, text: string) => {
    setParsingId(messageId);
    try {
      const parsed = await onLoadParsedRecipe(text);
      if (parsed) {
        onOpenRecipe(parsed);
      }
    } finally {
      setParsingId(null);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear conversation history?')) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: `👋 Hello! I am your **Recipe Assistant**. 

I can help you:
- Discover full recipes for dishes like **Butter Chicken** or **Homemade Pizza**
- Cook with what's in your fridge (*"I have potatoes and eggs. What can I make?"*)
- Modify recipes for diets (**Vegetarian**, **Gluten-Free**, **Low-Carb**)
- Adapt for kitchen equipment (**No oven**, **Stovetop**, **Air-Fryer**)
- Scale portions accurately for **2, 4, or 10 people**

What are you craving or cooking today?`,
          timestamp: Date.now(),
        },
      ]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8.5rem)] bg-white rounded-3xl shadow-xl border border-stone-200/80 overflow-hidden">
      {/* Chat Sub-Header */}
      <div className="bg-stone-50 px-6 py-3 border-b border-stone-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Chef AI Assistant
            </h2>
            <p className="text-[11px] text-stone-500">
              Grounded strictly in culinary accuracy, exact measurements & safe temperatures
            </p>
          </div>
        </div>

        <button
          onClick={handleClearHistory}
          className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-200 transition-colors"
          title="Clear chat"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isRecipe =
            !isUser &&
            (msg.content.includes('🍽️') ||
              msg.content.includes('🛒 Ingredients') ||
              msg.content.includes('👨🍳 Instructions'));

          return (
            <div
              key={msg.id}
              className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-xs">
                  <ChefHat className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 ${
                  isUser
                    ? 'bg-stone-900 text-stone-100 rounded-br-xs'
                    : 'bg-stone-50 text-stone-800 border border-stone-200/90 rounded-bl-xs shadow-xs'
                }`}
              >
                {/* Content Render */}
                <div className="prose prose-sm max-w-none text-sm leading-relaxed whitespace-pre-line font-sans">
                  {msg.content}
                </div>

                {/* If Assistant Outputted a Recipe, show interactive Card link */}
                {isRecipe && (
                  <div className="mt-4 pt-4 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-2">
                    <button
                      onClick={() => handleInteractiveCardClick(msg.id, msg.content)}
                      disabled={parsingId === msg.id}
                      className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-all hover:scale-105"
                    >
                      {parsingId === msg.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Preparing Interactive Card...</span>
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Open in Interactive Recipe Card & Scaler</span>
                        </>
                      )}
                    </button>

                    <span className="text-[11px] text-stone-500">
                      Enables live servings math, step timers & cook mode
                    </span>
                  </div>
                )}

                {/* Follow-up suggestions */}
                {msg.followUpOptions && msg.followUpOptions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-stone-200 flex flex-wrap gap-1.5">
                    {msg.followUpOptions.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => handleSend(opt)}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition-colors"
                      >
                        👉 {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-full bg-stone-800 text-white flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 items-center text-stone-500 text-xs pl-2">
            <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <ChefHat className="w-4 h-4 animate-bounce" />
            </div>
            <div className="flex items-center gap-1.5 bg-stone-100 px-3 py-2 rounded-xl border border-stone-200">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
              <span>Chef is preparing the recipe instructions...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Starter Prompts Bar (when only initial message or low message count) */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 bg-stone-50/80 border-t border-stone-200 overflow-x-auto scrollbar-none flex items-center gap-2">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1 whitespace-nowrap">
            <Sparkles className="w-3 h-3 text-amber-500" /> Quick Ideas:
          </span>
          {STARTER_PROMPTS.map((sp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(sp.prompt)}
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-white hover:bg-amber-50 text-stone-700 hover:text-amber-800 border border-stone-200 shadow-2xs whitespace-nowrap transition-colors"
            >
              {sp.label}
            </button>
          ))}
        </div>
      )}

      {/* Input Form Bar */}
      <div className="p-4 bg-white border-t border-stone-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for any recipe, modifications, substitutions, or cooking advice..."
            className="flex-1 bg-stone-50 border border-stone-300 focus:border-amber-600 focus:bg-white focus:ring-1 focus:ring-amber-500 rounded-2xl px-4 py-3 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white rounded-2xl transition-colors shadow-xs"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-stone-400 text-center mt-2">
          GourmetAI provides realistic recipes with precise timings, food safety temperatures, and beginner-friendly instructions.
        </p>
      </div>
    </div>
  );
};
