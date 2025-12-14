import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Share2, Copy, Loader2, Book, Check } from 'lucide-react';
import { CHAPTERS } from '../constants';
import { fetchVerse } from '../services/geminiService';
import { VerseData, Language } from '../types';
import { FormattedText } from './FormattedText';

interface VerseReaderProps {
  initialChapterId?: number;
  initialVerseNum?: number;
  language: Language;
}

export const VerseReader: React.FC<VerseReaderProps> = ({ initialChapterId = 1, initialVerseNum = 1, language }) => {
  const [selectedChapterId, setSelectedChapterId] = useState<number>(initialChapterId);
  const [selectedVerseNum, setSelectedVerseNum] = useState<number>(initialVerseNum);
  const [verseData, setVerseData] = useState<VerseData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showCopied, setShowCopied] = useState(false);

  // Update internal state if props change (useful when navigating from search to read view)
  useEffect(() => {
    setSelectedChapterId(initialChapterId);
    setSelectedVerseNum(initialVerseNum);
  }, [initialChapterId, initialVerseNum]);

  // Reload verse if language changes
  useEffect(() => {
    loadVerse(selectedChapterId, selectedVerseNum);
  }, [language]);

  const currentChapter = CHAPTERS.find(c => c.id === selectedChapterId) || CHAPTERS[0];

  const loadVerse = async (chapter: number, verse: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchVerse(chapter, verse, language);
      setVerseData(data);
    } catch (err) {
      setError(language === 'hi' 
        ? "श्लोक लोड करने में विफल। कृपया अपना कनेक्शन जांचें और पुनः प्रयास करें।" 
        : "Failed to load verse. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVerse(selectedChapterId, selectedVerseNum);
  }, [selectedChapterId, selectedVerseNum]);

  const handleNext = () => {
    if (selectedVerseNum < currentChapter.verses) {
      setSelectedVerseNum(prev => prev + 1);
    } else if (selectedChapterId < 18) {
      setSelectedChapterId(prev => prev + 1);
      setSelectedVerseNum(1);
    }
  };

  const handlePrev = () => {
    if (selectedVerseNum > 1) {
      setSelectedVerseNum(prev => prev - 1);
    } else if (selectedChapterId > 1) {
      const prevChapter = CHAPTERS.find(c => c.id === selectedChapterId - 1);
      if (prevChapter) {
        setSelectedChapterId(prev => prev - 1);
        setSelectedVerseNum(prevChapter.verses);
      }
    }
  };

  const handleShare = () => {
    // Generate URL: Base Origin + Path + Query Params
    const url = `${window.location.origin}${window.location.pathname}?chapter=${selectedChapterId}&verse=${selectedVerseNum}`;
    
    navigator.clipboard.writeText(url).then(() => {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy link', err);
    });
  };

  const labels = {
    chapter: language === 'hi' ? 'अध्याय' : 'Chapter',
    verse: language === 'hi' ? 'श्लोक' : 'Verse',
    translation: language === 'hi' ? 'अनुवाद' : 'Translation',
    insight: language === 'hi' ? 'भावार्थ' : 'Insight',
    retry: language === 'hi' ? 'पुनः प्रयास करें' : 'Retry',
    loading: language === 'hi' ? 'ज्ञान का चिंतन कर रहे हैं...' : 'Contemplating the wisdom...',
    share: language === 'hi' ? 'श्लोक साझा करें' : 'Share Verse',
    copied: language === 'hi' ? 'लिंक कॉपी किया गया!' : 'Link copied!'
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 mb-8 sticky top-20 z-10">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wide">{labels.chapter}</label>
              <select
                value={selectedChapterId}
                onChange={(e) => {
                  setSelectedChapterId(Number(e.target.value));
                  setSelectedVerseNum(1);
                }}
                className="w-full md:w-64 appearance-none bg-stone-50 border border-stone-200 text-stone-900 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-amber-500"
              >
                {CHAPTERS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id}. {language === 'hi' ? c.nameHindi : c.name} ({c.verses} {language === 'hi' ? 'श्लोक' : 'verses'})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 pt-5 text-stone-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>

            <div className="relative w-24">
              <label className="block text-xs font-medium text-stone-500 mb-1 uppercase tracking-wide">{labels.verse}</label>
              <select
                value={selectedVerseNum}
                onChange={(e) => setSelectedVerseNum(Number(e.target.value))}
                className="w-full appearance-none bg-stone-50 border border-stone-200 text-stone-900 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-amber-500"
              >
                {Array.from({ length: currentChapter.verses }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 pt-5 text-stone-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-full hover:bg-stone-100 transition-colors text-stone-600 relative group mr-1"
              title={labels.share}
            >
              {showCopied ? <Check size={24} className="text-green-600" /> : <Share2 size={24} />}
              {showCopied && (
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-stone-800 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap z-20">
                  {labels.copied}
                </span>
              )}
            </button>
            <button
              onClick={handlePrev}
              disabled={selectedChapterId === 1 && selectedVerseNum === 1}
              className="p-2 rounded-full hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              disabled={selectedChapterId === 18 && selectedVerseNum === 78}
              className="p-2 rounded-full hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 text-amber-600 animate-pulse">
            <Loader2 size={48} className="animate-spin mb-4" />
            <p className="font-serif text-lg">{labels.loading}</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500">
            <p>{error}</p>
            <button 
              onClick={() => loadVerse(selectedChapterId, selectedVerseNum)}
              className="mt-4 px-4 py-2 bg-stone-100 rounded-lg hover:bg-stone-200"
            >
              {labels.retry}
            </button>
          </div>
        ) : verseData ? (
          <div className="space-y-8 animate-fade-in">
            {/* Sanskrit Card */}
            <div className="bg-amber-50 rounded-2xl p-8 md:p-12 text-center shadow-inner border border-amber-100">
              <div className="text-3xl md:text-4xl font-serif text-stone-800 leading-relaxed mb-6 font-medium">
                <FormattedText text={verseData.sanskrit} />
              </div>
              <div className="text-stone-600 font-serif italic text-lg">
                <FormattedText text={verseData.transliteration} />
              </div>
            </div>

            {/* Translation & Meaning */}
            <div className="grid md:grid-cols-1 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200">
                <h3 className="text-sm font-bold text-amber-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Book size={16} /> {labels.translation}
                </h3>
                <div className="text-xl md:text-2xl text-stone-800 font-serif leading-relaxed">
                  <FormattedText text={verseData.translation} />
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-stone-50 p-8 rounded-2xl shadow-sm border border-stone-200">
                 <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                   {labels.insight}
                 </h3>
                 <div className="text-stone-700 leading-loose text-lg">
                   <FormattedText text={verseData.meaning} />
                 </div>
              </div>
            </div>
            
            <div className="flex justify-center gap-4 text-stone-400 text-sm">
               <span>{labels.chapter} {selectedChapterId}</span>
               <span>•</span>
               <span>{labels.verse} {selectedVerseNum}</span>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
