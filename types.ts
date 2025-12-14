export type Language = 'en' | 'hi';
export type Theme = 'light' | 'dark';

export interface Chapter {
  id: number;
  name: string;
  nameTranslation: string;
  nameHindi: string;
  description: string;
  descriptionHindi: string;
  verses: number;
}

export interface VerseData {
  sanskrit: string;
  transliteration: string;
  translation: string;
  meaning: string;
}

export interface LocalVerseContent {
  sanskrit: string;
  transliteration: string;
  translations: {
    en: string;
    hi: string;
  };
  meanings: {
    en: string;
    hi: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface SearchResult {
  chapter: number;
  verse: number;
  sanskrit: string;
  translation: string;
}

export type ViewState = 'home' | 'read' | 'ask' | 'search' | 'login' | 'admin' | 'about' | 'aiterms' | 'author';