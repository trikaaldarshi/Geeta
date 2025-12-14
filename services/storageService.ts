import { LocalVerseContent } from '../types';

const STORAGE_KEY = 'gita_custom_verses';

export const getStoredVerses = (): Record<string, LocalVerseContent> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Error reading from storage", error);
    return {};
  }
};

export const getStoredVerse = (chapter: number, verse: number): LocalVerseContent | null => {
  const verses = getStoredVerses();
  const key = `${chapter}-${verse}`;
  return verses[key] || null;
};

export const saveVerseToStorage = (chapter: number, verse: number, content: LocalVerseContent) => {
  const verses = getStoredVerses();
  const key = `${chapter}-${verse}`;
  verses[key] = content;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(verses));
};

export const deleteVerseFromStorage = (chapter: number, verse: number) => {
  const verses = getStoredVerses();
  const key = `${chapter}-${verse}`;
  delete verses[key];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(verses));
};

export const searchStoredVerses = (query: string, language: 'en' | 'hi'): Array<{chapter: number, verse: number, content: LocalVerseContent}> => {
  const verses = getStoredVerses();
  const results = [];
  const q = query.toLowerCase();

  for (const [key, content] of Object.entries(verses)) {
    const [chapter, verse] = key.split('-').map(Number);
    const translation = language === 'hi' ? content.translations.hi : content.translations.en;
    const meaning = language === 'hi' ? content.meanings.hi : content.meanings.en;
    
    if (
      content.sanskrit.toLowerCase().includes(q) ||
      translation.toLowerCase().includes(q) ||
      meaning.toLowerCase().includes(q)
    ) {
      results.push({ chapter, verse, content });
    }
  }
  return results;
};
