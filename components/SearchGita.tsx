import React, { useState } from 'react';
import { Search, Loader2, BookOpen, ArrowRight } from 'lucide-react';
import { searchVerses } from '../services/geminiService';
import { SearchResult, Language } from '../types';

interface SearchGitaProps {
  onNavigateToVerse: (chapter: number, verse: number) => void;
  language: Language;
}

export const SearchGita: React.FC<SearchGitaProps> = ({ onNavigateToVerse, language }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    setResults([]);

    try {
      const data = await searchVerses(query, language);
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const labels = {
    title: language === 'hi' ? 'गीता में खोजें' : 'Search the Gita',
    subtitle: language === 'hi' 
      ? 'कीवर्ड, विषय या अर्थ द्वारा श्लोक खोजें। अपनी स्थिति के लिए प्रासंगिक ज्ञान खोजें।'
      : 'Find shlokas by keyword, topic, or meaning. Discover the wisdom relevant to your situation.',
    placeholder: language === 'hi' 
      ? 'उदाहरण: शांति, कर्तव्य, ध्यान, कर्म...' 
      : 'e.g., peace, duty, meditation, karma...',
    chapter: language === 'hi' ? 'अध्याय' : 'Chapter',
    verse: language === 'hi' ? 'श्लोक' : 'Verse',
    noResults: language === 'hi' ? 'आपकी खोज से मेल खाते कोई श्लोक नहीं मिले।' : 'No verses found matching your query.',
    tryAgain: language === 'hi' ? 'कृपया अलग कीवर्ड या सरल शब्दों का प्रयोग करें।' : 'Try using different keywords or simpler terms.'
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif text-stone-800 font-bold mb-4">{labels.title}</h2>
        <p className="text-stone-600 max-w-lg mx-auto">
          {labels.subtitle}
        </p>
      </div>

      <form onSubmit={handleSearch} className="mb-12">
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={labels.placeholder}
            className="w-full pl-6 pr-14 py-4 bg-white border border-stone-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-lg transition-all"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 top-2 p-2 bg-stone-900 text-white rounded-full hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? <Loader2 size={24} className="animate-spin" /> : <Search size={24} />}
          </button>
        </div>
      </form>

      {/* Results */}
      <div className="space-y-6">
        {results.map((result, index) => (
          <div
            key={`${result.chapter}-${result.verse}-${index}`}
            onClick={() => onNavigateToVerse(result.chapter, result.verse)}
            className="bg-white p-6 rounded-xl border border-stone-200 hover:border-amber-400 hover:shadow-md cursor-pointer transition-all group animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex justify-between items-start mb-3">
              <span className="px-3 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full uppercase tracking-wider border border-amber-100">
                {labels.chapter} {result.chapter}, {labels.verse} {result.verse}
              </span>
              <ArrowRight size={18} className="text-stone-300 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="font-serif text-stone-800 text-lg mb-2 leading-relaxed">
              "{result.translation}"
            </p>
            <p className="text-stone-500 font-serif italic text-sm">
              {result.sanskrit}
            </p>
          </div>
        ))}

        {hasSearched && !isLoading && results.length === 0 && (
          <div className="text-center text-stone-500 py-12">
            <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg">{labels.noResults}</p>
            <p className="text-sm">{labels.tryAgain}</p>
          </div>
        )}
      </div>
    </div>
  );
};
