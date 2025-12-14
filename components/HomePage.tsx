import React from 'react';
import { BookOpen, ArrowRight, MessageCircle } from 'lucide-react';
import { CHAPTERS } from '../constants';
import { ViewState, Language } from '../types';
import { FormattedText } from './FormattedText';

interface HomePageProps {
  setView: (view: ViewState) => void;
  setChapter: (id: number) => void;
  language: Language;
}

export const HomePage: React.FC<HomePageProps> = ({ setView, setChapter, language }) => {
  const content = {
    titlePrefix: language === 'hi' ? 'शाश्वत ज्ञान में' : 'Find Peace in',
    titleSuffix: language === 'hi' ? 'शांति पाएं' : 'Eternal Wisdom',
    description: language === 'hi' 
      ? 'आधुनिक अनुवाद और **एआई-संचालित अंतर्दृष्टि** के साथ भगवद गीता के परिवर्तनकारी श्लोकों का अन्वेषण करें। अपनी आंतरिक शांति का मार्ग खोजें।'
      : "Explore the Bhagavad Gita's transformative verses with modern translations and **AI-powered insights**. Discover your path to inner peace.",
    readBtn: language === 'hi' ? 'पढ़ना शुरू करें' : 'Start Reading',
    askBtn: language === 'hi' ? 'कृष्ण से पूछें' : 'Ask Krishna',
    chaptersTitle: language === 'hi' ? 'अध्याय' : 'Chapters',
    chapterCount: language === 'hi' ? 'अध्याय' : 'Adhyayas'
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-b from-amber-50 via-white to-white dark:from-stone-900 dark:via-stone-900 dark:to-stone-950 py-20 px-4 text-center overflow-hidden transition-colors duration-300">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-amber-200/20 dark:bg-amber-900/10 rounded-full blur-3xl -z-10" />
        
        <h1 className="text-5xl md:text-7xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-6 tracking-tight">
          <FormattedText text={content.titlePrefix} /> <br/> <span className="text-amber-600 dark:text-amber-500"><FormattedText text={content.titleSuffix} /></span>
        </h1>
        <div className="max-w-2xl mx-auto text-xl text-stone-600 dark:text-stone-400 mb-10 leading-relaxed font-light">
          <FormattedText text={content.description} />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={() => setView('read')}
            className="group px-8 py-4 bg-stone-900 dark:bg-amber-600 text-white rounded-full font-medium hover:bg-stone-800 dark:hover:bg-amber-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {content.readBtn}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button 
             onClick={() => setView('ask')}
             className="px-8 py-4 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-200 border border-stone-200 dark:border-stone-700 rounded-full font-medium hover:bg-amber-50 dark:hover:bg-stone-700 hover:border-amber-200 transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle size={18} className="text-amber-600 dark:text-amber-500" />
            {content.askBtn}
          </button>
        </div>
      </div>

      {/* Chapters Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100">{content.chaptersTitle}</h2>
          <span className="text-stone-500 dark:text-stone-500">{CHAPTERS.length} {content.chapterCount}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CHAPTERS.map((chapter) => (
            <div 
              key={chapter.id}
              onClick={() => {
                setView('read');
                setChapter(chapter.id);
              }}
              className="group cursor-pointer bg-white dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800 hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-md transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 text-xs font-bold rounded-full uppercase tracking-wider">
                  {language === 'hi' ? `अध्याय ${chapter.id}` : `Chapter ${chapter.id}`}
                </span>
                <span className="text-stone-400 dark:text-stone-500 text-sm flex items-center gap-1">
                  <BookOpen size={14} /> {chapter.verses}
                </span>
              </div>
              <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-1 group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-colors">
                {language === 'hi' ? chapter.nameHindi : chapter.name}
              </h3>
              <p className="text-sm font-serif italic text-stone-500 dark:text-stone-400 mb-3">
                {language === 'hi' ? chapter.name : chapter.nameTranslation}
              </p>
              <p className="text-stone-600 dark:text-stone-400 text-sm line-clamp-2 leading-relaxed">
                {language === 'hi' ? chapter.descriptionHindi : chapter.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};