
import { GoogleGenAI } from "@google/genai";
import { Language } from "../types";

/**
 * Generates an AI summary of the provided tech news article content.
 */
export const generateAISummary = async (content: string, lang: Language): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("Gemini API Key is missing. AI summary will be disabled.");
    return "AI summary currently unavailable (API Key missing).";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Summarize the following tech news article in exactly 3 bullet points. 
The output MUST be written in the language corresponding to this ISO-like code: ${lang}.

Article content:
${content}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text || "AI summary currently unavailable.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate AI summary.";
  }
};

interface CricketData {
  text: string;
  links: { title: string; uri: string }[];
}

let cricketRequestInProgress: Promise<CricketData> | null = null;

/**
 * Fetches latest cricket updates with caching and rate-limit protection.
 */
export const getCricketUpdate = async (): Promise<CricketData> => {
  const CACHE_KEY = 'tb_cricket_v2';
  const ERROR_LOCK_KEY = 'tb_cricket_error_lock';
  const CACHE_TIME = 30 * 60 * 1000; // 30 minutes cache for success
  const ERROR_LOCK_TIME = 15 * 60 * 1000; // 15 minutes lock on 429 errors
  
  // 1. Check for active error lock (prevents calling API if we know quota is dead)
  const errorLock = localStorage.getItem(ERROR_LOCK_KEY);
  if (errorLock) {
    const lockTime = parseInt(errorLock, 10);
    if (Date.now() - lockTime < ERROR_LOCK_TIME) {
      throw new Error("QUOTA_EXHAUSTED");
    } else {
      localStorage.removeItem(ERROR_LOCK_KEY);
    }
  }

  // 2. Check success cache
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    try {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TIME) {
        return data;
      }
    } catch (e) {
      localStorage.removeItem(CACHE_KEY);
    }
  }

  // 3. Prevent duplicate simultaneous requests
  if (cricketRequestInProgress) {
    return cricketRequestInProgress;
  }

  cricketRequestInProgress = (async () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("Gemini API Key is missing. Cricket updates will be disabled.");
      return { text: "Cricket information currently unavailable (API Key missing).", links: [] };
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Provide the latest live cricket score for the Indian national team (Men or Women) if a match is currently ongoing. If no match is live, state 'No live match currently'. Also, provide the schedule for the next 3 upcoming Indian international cricket matches (opponent, date, and venue). Keep the response concise and factual.",
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "Cricket information currently unavailable.";
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const links = groundingChunks
        .map((chunk: any) => chunk.web)
        .filter((web: any) => web && web.uri && web.title);

      const result = { text, links };
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data: result, timestamp: Date.now() }));
      // Clear any existing error lock on success
      localStorage.removeItem(ERROR_LOCK_KEY);
      return result;
    } catch (error: any) {
      // Check for 429 specifically
      const isQuotaError = error?.message?.includes('429') || error?.status === 429 || (error?.error?.code === 429);
      
      if (isQuotaError) {
        // Set error lock in local storage to prevent retries
        localStorage.setItem(ERROR_LOCK_KEY, Date.now().toString());
        throw new Error("QUOTA_EXHAUSTED");
      }
      
      console.error("Cricket API Error:", error);
      throw error;
    } finally {
      cricketRequestInProgress = null;
    }
  })();

  return cricketRequestInProgress;
};
