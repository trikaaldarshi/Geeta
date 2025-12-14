import { GoogleGenAI, Type, Schema, HarmCategory, HarmBlockThreshold, GenerateContentResponse } from "@google/genai";
import { VerseData, SearchResult, Language } from "../types";
import { getLocalVerse } from "../localVerses";
import { getStoredVerse, searchStoredVerses } from "./storageService";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Configure safety settings to allow religious/historical war context (Kurukshetra)
// This prevents the model from blocking verses describing battle, weapons, or death.
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

const verseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    sanskrit: { type: Type.STRING, description: "The Sanskrit shloka text in Devanagari script." },
    transliteration: { type: Type.STRING, description: "The English transliteration of the shloka." },
    translation: { type: Type.STRING, description: "The translation of the verse in the requested language." },
    meaning: { type: Type.STRING, description: "A concise explanation of the verse's meaning and context in the requested language." },
  },
  required: ["sanskrit", "transliteration", "translation", "meaning"],
};

const searchSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      chapter: { type: Type.NUMBER, description: "The chapter number of the verse." },
      verse: { type: Type.NUMBER, description: "The verse number." },
      sanskrit: { type: Type.STRING, description: "The Sanskrit text of the verse." },
      translation: { type: Type.STRING, description: "The translation of the verse in the requested language." },
    },
    required: ["chapter", "verse", "sanskrit", "translation"],
  },
};

// Retry helper for API calls
async function withRetry<T>(operation: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    // Check for rate limit (429) or temporary server errors (503)
    const isTransient = error?.status === 429 || error?.status === 503 || 
                        (error?.message && (error.message.includes('429') || error.message.includes('503')));
    
    if (retries > 0 && isTransient) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return withRetry(operation, retries - 1, delay * 2);
    }
    throw error;
  }
}

export const fetchVerse = async (chapter: number, verse: number, language: Language): Promise<VerseData> => {
  // 1. Check Admin/Storage verses first (User overrides)
  const storedData = getStoredVerse(chapter, verse);
  if (storedData) {
     return {
      sanskrit: storedData.sanskrit,
      transliteration: storedData.transliteration,
      translation: language === 'hi' ? storedData.translations.hi : storedData.translations.en,
      meaning: language === 'hi' ? storedData.meanings.hi : storedData.meanings.en
    };
  }

  // 2. Check Static Local Data
  const localData = getLocalVerse(chapter, verse);
  if (localData) {
    return {
      sanskrit: localData.sanskrit,
      transliteration: localData.transliteration,
      translation: language === 'hi' ? localData.translations.hi : localData.translations.en,
      meaning: language === 'hi' ? localData.meanings.hi : localData.meanings.en
    };
  }

  // 3. Fallback to API
  try {
    const model = "gemini-2.5-flash";
    const langRequest = language === 'hi' ? "Hindi" : "English";
    const prompt = `Provide the Sanskrit text, English transliteration, ${langRequest} translation, and a brief ${langRequest} meaning for Bhagavad Gita Chapter ${chapter}, Verse ${verse}. Ensure accuracy to the traditional text.`;

    return await withRetry(async () => {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: verseSchema,
          temperature: 0.3, 
          safetySettings: safetySettings,
        },
      });

      if (response.text) {
        return JSON.parse(response.text) as VerseData;
      }
      throw new Error("Empty response from AI");
    });

  } catch (error) {
    console.error("Error fetching verse:", error);
    throw error;
  }
};

export const searchVerses = async (query: string, language: Language): Promise<SearchResult[]> => {
  try {
    // 1. Search Stored Verses locally first
    const storedMatches = searchStoredVerses(query, language).map(m => ({
      chapter: m.chapter,
      verse: m.verse,
      sanskrit: m.content.sanskrit,
      translation: language === 'hi' ? m.content.translations.hi : m.content.translations.en
    }));

    // 2. Search API
    const model = "gemini-2.5-flash";
    const langRequest = language === 'hi' ? "Hindi" : "English";
    const prompt = `Find up to 10 most relevant verses from the Bhagavad Gita for the query: "${query}". Return the chapter number, verse number, original sanskrit text, and ${langRequest} translation for each result.`;

    const response = await withRetry(async () => {
      return await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: searchSchema,
          temperature: 0.3,
          safetySettings: safetySettings, 
        },
      });
    });

    let apiResults: SearchResult[] = [];
    if (response.text) {
      apiResults = JSON.parse(response.text) as SearchResult[];
    }

    // Combine results, prioritizing stored matches and removing duplicates
    const finalResults = [...storedMatches];
    const storedKeys = new Set(storedMatches.map(s => `${s.chapter}-${s.verse}`));

    apiResults.forEach(res => {
      if (!storedKeys.has(`${res.chapter}-${res.verse}`)) {
        // If this result is in storage (but maybe didn't match keyword there?), force use storage content
        const stored = getStoredVerse(res.chapter, res.verse);
        const local = getLocalVerse(res.chapter, res.verse);
        
        if (stored) {
           finalResults.push({
             ...res,
             sanskrit: stored.sanskrit,
             translation: language === 'hi' ? stored.translations.hi : stored.translations.en
           });
        } else if (local) {
           finalResults.push({
             ...res,
             sanskrit: local.sanskrit,
             translation: language === 'hi' ? local.translations.hi : local.translations.en
           });
        } else {
           finalResults.push(res);
        }
      }
    });

    return finalResults;

  } catch (error) {
    console.error("Error searching verses:", error);
    throw error;
  }
};

export const fetchChatResponse = async (history: { role: string; parts: { text: string }[] }[], newMessage: string, language: Language) => {
  try {
    const langContext = language === 'hi' 
      ? "You are a wise spiritual guide. Answer questions in Hindi using the wisdom of the Bhagavad Gita. Keep answers concise."
      : "You are a wise spiritual guide. Answer questions in English using the wisdom of the Bhagavad Gita. Keep answers concise.";

    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: langContext,
        safetySettings: safetySettings,
      },
      history: history,
    });

    const result = await withRetry<GenerateContentResponse>(() => chat.sendMessage({ message: newMessage }));
    return result.text;
  } catch (error) {
    console.error("Error in chat:", error);
    throw error;
  }
};