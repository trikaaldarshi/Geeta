import React, { useState, useEffect } from 'react';
import { Save, Trash2, Plus, LogOut, Edit3, CheckCircle, Folder, FolderOpen, FileText, ChevronRight, ChevronDown } from 'lucide-react';
import { CHAPTERS } from '../constants';
import { getStoredVerses, saveVerseToStorage, deleteVerseFromStorage } from '../services/storageService';
import { LocalVerseContent } from '../types';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [storedVerses, setStoredVerses] = useState<Record<string, LocalVerseContent>>({});
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set([1])); // Default expand ch 1
  
  // Form State
  const [chapter, setChapter] = useState(1);
  const [verse, setVerse] = useState(1);
  const [sanskrit, setSanskrit] = useState('');
  const [transliteration, setTransliteration] = useState('');
  const [translationEn, setTranslationEn] = useState('');
  const [translationHi, setTranslationHi] = useState('');
  const [meaningEn, setMeaningEn] = useState('');
  const [meaningHi, setMeaningHi] = useState('');
  
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    refreshList();
  }, []);

  const refreshList = () => {
    setStoredVerses(getStoredVerses());
  };

  const handleEdit = (key: string) => {
    const [c, v] = key.split('-').map(Number);
    const content = storedVerses[key];
    setChapter(c);
    setVerse(v);
    setSanskrit(content.sanskrit);
    setTransliteration(content.transliteration);
    setTranslationEn(content.translations.en);
    setTranslationHi(content.translations.hi);
    setMeaningEn(content.meanings.en);
    setMeaningHi(content.meanings.hi);
    setSelectedKey(key);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const content: LocalVerseContent = {
      sanskrit,
      transliteration,
      translations: { en: translationEn, hi: translationHi },
      meanings: { en: meaningEn, hi: meaningHi }
    };

    saveVerseToStorage(chapter, verse, content);
    refreshList();
    setSuccessMsg(`Successfully published Chapter ${chapter}, Verse ${verse}`);
    
    // Auto-expand the chapter we just saved to
    setExpandedChapters(prev => new Set(prev).add(chapter));
    
    setTimeout(() => setSuccessMsg(''), 3000);
    
    // Clear form if it was a new entry, keep if editing (but reset key to allow adding next)
    if (!selectedKey) {
        setVerse(v => v + 1);
        setSanskrit('');
        setTransliteration('');
        setTranslationEn('');
        setTranslationHi('');
        setMeaningEn('');
        setMeaningHi('');
    } else {
        // If we were editing, stay in edit mode for that verse
    }
  };

  const handleDelete = (key: string) => {
    if (confirm('Are you sure you want to delete this verse? It will revert to the AI version.')) {
      const [c, v] = key.split('-').map(Number);
      deleteVerseFromStorage(c, v);
      refreshList();
      if (selectedKey === key) {
        resetForm();
      }
    }
  };

  const resetForm = () => {
    setSelectedKey(null);
    setSanskrit('');
    setTransliteration('');
    setTranslationEn('');
    setTranslationHi('');
    setMeaningEn('');
    setMeaningHi('');
  };

  const toggleChapter = (id: number) => {
    const newSet = new Set(expandedChapters);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedChapters(newSet);
  };

  const prepareNewVerseInChapter = (chapterId: number) => {
    // Find next available verse in this chapter based on stored ones
    const existingInChapter = Object.keys(storedVerses)
      .filter(k => k.startsWith(`${chapterId}-`))
      .map(k => parseInt(k.split('-')[1]));
    
    const nextVerse = existingInChapter.length > 0 ? Math.max(...existingInChapter) + 1 : 1;
    
    resetForm();
    setChapter(chapterId);
    setVerse(nextVerse);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Group verses by chapter
  const versesByChapter = React.useMemo(() => {
    const grouped: Record<number, Array<{ v: number, key: string, content: LocalVerseContent }>> = {};
    
    Object.entries(storedVerses).forEach(([key, value]) => {
      const content = value as LocalVerseContent;
      const [c, v] = key.split('-').map(Number);
      if (!grouped[c]) grouped[c] = [];
      grouped[c].push({ v, key, content });
    });

    // Sort verses within chapters
    Object.keys(grouped).forEach(k => {
      grouped[Number(k)].sort((a, b) => a.v - b.v);
    });

    return grouped;
  }, [storedVerses]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8 border-b border-stone-200 pb-6">
        <div>
          <h2 className="text-3xl font-serif font-bold text-stone-800">HR Dashboard</h2>
          <p className="text-stone-500 mt-1">Manage and publish custom shloka translations.</p>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 text-stone-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100">
          <LogOut size={20} /> Logout
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Sidebar / List Column */}
        <div className="lg:col-span-4 order-2 lg:order-1">
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden h-fit sticky top-24">
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex justify-between items-center">
              <h3 className="font-bold text-stone-800 flex items-center gap-2">
                <FolderOpen size={18} className="text-amber-600" />
                Verse Library
              </h3>
              <span className="text-xs bg-stone-200 text-stone-600 px-2 py-1 rounded-full">
                {Object.keys(storedVerses).length} verses
              </span>
            </div>
            
            <div className="overflow-y-auto max-h-[70vh] p-2">
              {CHAPTERS.map((chap) => {
                const hasVerses = !!versesByChapter[chap.id];
                const isExpanded = expandedChapters.has(chap.id);
                const count = versesByChapter[chap.id]?.length || 0;

                return (
                  <div key={chap.id} className="mb-1">
                    <div 
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                        isExpanded ? 'bg-stone-100' : 'hover:bg-stone-50'
                      }`}
                      onClick={() => toggleChapter(chap.id)}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        {isExpanded ? <ChevronDown size={16} className="text-stone-400" /> : <ChevronRight size={16} className="text-stone-400" />}
                        {isExpanded ? <FolderOpen size={16} className="text-amber-500" /> : <Folder size={16} className="text-stone-400" />}
                        <span className={`text-sm font-medium truncate ${hasVerses ? 'text-stone-800' : 'text-stone-400'}`}>
                          Ch {chap.id}: {chap.nameTranslation}
                        </span>
                      </div>
                      {count > 0 && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded ml-2">
                          {count}
                        </span>
                      )}
                    </div>

                    {isExpanded && (
                      <div className="ml-6 mt-1 space-y-1 border-l-2 border-stone-100 pl-2">
                        {/* Quick Add Button */}
                        <button 
                          onClick={(e) => { e.stopPropagation(); prepareNewVerseInChapter(chap.id); }}
                          className="w-full text-left p-2 rounded-md text-xs font-medium text-amber-600 hover:bg-amber-50 flex items-center gap-1 transition-colors dashed-border"
                        >
                          <Plus size={14} /> Add Verse to Ch {chap.id}
                        </button>

                        {hasVerses ? (
                          versesByChapter[chap.id].map(({ v, key, content }) => (
                            <div 
                              key={key}
                              onClick={() => handleEdit(key)}
                              className={`group flex items-start justify-between p-2 rounded-md cursor-pointer border text-sm transition-all ${
                                selectedKey === key 
                                  ? 'bg-amber-50 border-amber-300 shadow-sm' 
                                  : 'bg-white border-transparent hover:border-stone-200 hover:bg-stone-50'
                              }`}
                            >
                              <div className="flex items-center gap-2 overflow-hidden">
                                <FileText size={14} className={selectedKey === key ? 'text-amber-500' : 'text-stone-400'} />
                                <div className="truncate">
                                  <span className="font-semibold text-stone-700">Verse {v}</span>
                                  <p className="text-xs text-stone-500 truncate w-32">{content.translations.en.substring(0, 30)}...</p>
                                </div>
                              </div>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleDelete(key); }}
                                className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-red-500 p-1 transition-opacity"
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-stone-400 italic p-2">No custom verses yet</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Editor Column */}
        <div className="lg:col-span-8 order-1 lg:order-2">
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 md:p-8">
            <div className="flex justify-between items-center mb-6 border-b border-stone-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-stone-800 flex items-center gap-2">
                  {selectedKey ? <Edit3 size={20} className="text-amber-600" /> : <Plus size={20} className="text-green-600" />}
                  {selectedKey ? 'Edit Verse' : 'Add New Verse'}
                </h3>
                <p className="text-sm text-stone-500 mt-1">
                  {selectedKey ? `Editing Chapter ${chapter}, Verse ${verse}` : 'Create a new translation entry'}
                </p>
              </div>
              
              {selectedKey && (
                <button onClick={resetForm} className="px-3 py-1.5 text-sm bg-stone-100 text-stone-600 rounded-md hover:bg-stone-200 transition-colors">
                  Cancel & Create New
                </button>
              )}
            </div>

            {successMsg && (
              <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 border border-green-100 animate-fade-in">
                <CheckCircle size={20} /> {successMsg}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              {/* Selection Row */}
              <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1.5">Chapter</label>
                  <select 
                    value={chapter} 
                    onChange={e => setChapter(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-md shadow-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                  >
                    {CHAPTERS.map(c => (
                      <option key={c.id} value={c.id}>{c.id}. {c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1.5">Verse Number</label>
                  <input 
                    type="number" 
                    min="1" 
                    value={verse} 
                    onChange={e => setVerse(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-stone-300 rounded-md shadow-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              {/* Sanskrit & Transliteration */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1.5 flex justify-between">
                    Sanskrit Shloka <span className="text-stone-400 font-normal normal-case">Devanagari</span>
                  </label>
                  <textarea 
                    value={sanskrit} 
                    onChange={e => setSanskrit(e.target.value)}
                    rows={3}
                    className="w-full p-3 bg-white border border-stone-300 rounded-lg font-serif text-lg leading-relaxed focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-shadow"
                    placeholder="धर्मक्षेत्रे कुरुक्षेत्रे..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1.5 flex justify-between">
                    English Transliteration <span className="text-stone-400 font-normal normal-case">IAST</span>
                  </label>
                  <textarea 
                    value={transliteration} 
                    onChange={e => setTransliteration(e.target.value)}
                    rows={2}
                    className="w-full p-3 bg-white border border-stone-300 rounded-lg font-serif italic text-stone-600 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-shadow"
                    placeholder="dharma-kṣetre kuru-kṣetre..."
                    required
                  />
                </div>
              </div>

              <div className="h-px bg-stone-200 my-2"></div>

              {/* Translations */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1.5">Translation (English)</label>
                  <textarea 
                    value={translationEn} 
                    onChange={e => setTranslationEn(e.target.value)}
                    rows={4}
                    className="w-full p-3 bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-shadow"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1.5">Translation (Hindi)</label>
                  <textarea 
                    value={translationHi} 
                    onChange={e => setTranslationHi(e.target.value)}
                    rows={4}
                    className="w-full p-3 bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-shadow"
                    required
                  />
                </div>
              </div>

              {/* Meanings */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1.5">Meaning / Insight (English)</label>
                  <textarea 
                    value={meaningEn} 
                    onChange={e => setMeaningEn(e.target.value)}
                    rows={4}
                    className="w-full p-3 bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-shadow"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1.5">Meaning / Insight (Hindi)</label>
                  <textarea 
                    value={meaningHi} 
                    onChange={e => setMeaningHi(e.target.value)}
                    rows={4}
                    className="w-full p-3 bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-shadow"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-stone-900 text-white py-4 rounded-xl font-bold hover:bg-stone-800 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <Save size={20} /> 
                {selectedKey ? 'Update Verse' : 'Publish New Verse'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};