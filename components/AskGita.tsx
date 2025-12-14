import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Sparkles, Loader2 } from 'lucide-react';
import { fetchChatResponse } from '../services/geminiService';
import { ChatMessage, Language } from '../types';
import { FormattedText } from './FormattedText';

interface AskGitaProps {
  language: Language;
}

export const AskGita: React.FC<AskGitaProps> = ({ language }) => {
  const initialMessageEn = "Namaste. I am here to help you navigate life's questions through the eternal wisdom of the Bhagavad Gita. What is on your mind today?";
  const initialMessageHi = "नमस्ते। मैं यहाँ भगवद गीता के शाश्वत ज्ञान के माध्यम से जीवन के प्रश्नों को हल करने में आपकी सहायता करने के लिए हूँ। आज आपके मन में क्या है?";

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: language === 'hi' ? initialMessageHi : initialMessageEn
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Reset conversation if language changes
  useEffect(() => {
    setMessages([{
      id: Date.now().toString(),
      role: 'model',
      text: language === 'hi' ? initialMessageHi : initialMessageEn
    }]);
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Format history for Gemini
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await fetchChatResponse(history, userMsg.text, language);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || (language === 'hi' ? "क्षमा करें, मैं अभी इस पर विचार करने में असमर्थ हूँ।" : "I apologize, but I am unable to contemplate that right now.")
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: language === 'hi' 
          ? "मुझे ब्रह्मांडीय चेतना (नेटवर्क त्रुटि) से जुड़ने में समस्या हो रही है। कृपया पुनः प्रयास करें।"
          : "I am having trouble connecting to the cosmic consciousness (network error). Please try again.",
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const labels = {
    title: language === 'hi' ? 'कृष्ण से पूछें' : 'Ask Krishna',
    subtitle: language === 'hi' ? 'अपने धर्म और जीवन की चुनौतियों पर मार्गदर्शन लें।' : 'Seek guidance on your dharma and life\'s challenges.',
    placeholder: language === 'hi' ? 'जीवन, कर्तव्य या आध्यात्मिकता के बारे में प्रश्न पूछें...' : 'Ask a question about life, duty, or spirituality...',
    disclaimer: language === 'hi' ? 'एआई मार्गदर्शन ज्ञानवर्धक हो सकता है, लेकिन विवेक के साथ व्याख्या करें।' : 'AI guidance can be insightful, but interpret with wisdom.'
  };

  return (
    <div className="max-w-3xl mx-auto p-4 h-[calc(100vh-6rem)] flex flex-col">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-serif text-stone-800 dark:text-stone-100 font-bold mb-2">{labels.title}</h2>
        <p className="text-stone-500 dark:text-stone-400">{labels.subtitle}</p>
      </div>

      <div className="flex-1 bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col transition-colors duration-300">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-stone-50 dark:bg-stone-950/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-stone-800 dark:bg-stone-700 text-white' : 'bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400'
                }`}>
                  {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                </div>
                
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-stone-800 dark:bg-stone-700 text-stone-50 dark:text-stone-100 rounded-tr-none' 
                    : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 rounded-tl-none shadow-sm'
                } ${msg.isError ? 'border-red-300 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300' : ''}`}>
                  <FormattedText text={msg.text} />
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="flex flex-row gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Sparkles size={16} />
                </div>
                <div className="bg-white dark:bg-stone-800 p-4 rounded-2xl rounded-tl-none border border-stone-200 dark:border-stone-700 shadow-sm">
                  <Loader2 size={20} className="animate-spin text-amber-600 dark:text-amber-500" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={labels.placeholder}
              className="w-full pl-6 pr-14 py-4 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 dark:focus:border-amber-500 text-stone-900 dark:text-stone-100 transition-all placeholder:text-stone-400"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-2 bg-amber-600 text-white rounded-full hover:bg-amber-700 disabled:opacity-50 disabled:hover:bg-amber-600 transition-colors"
            >
              <Send size={20} />
            </button>
          </div>
          <p className="text-center text-xs text-stone-400 mt-2">{labels.disclaimer}</p>
        </div>
      </div>
    </div>
  );
};