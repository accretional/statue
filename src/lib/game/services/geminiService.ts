
import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini
// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
// We support both process.env.API_KEY (via Vite define) and VITE_GEMINI_API_KEY.
const apiKey = (typeof process !== 'undefined' && process.env?.API_KEY) || import.meta.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey });

export const generateFlavorText = async (action: string, outcome: string): Promise<string> => {
  try {
    const prompt = `
      Context: A satirical strategy game called "Get in to YCombinator". 
      The player just performed the action: "${action}".
      The outcome was: "${outcome}".
      
      Write a very short, cynical, funny, silicon-valley style status update or notification (max 1 sentence).
      Tone: Dark humor, frantic founder energy.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    
    return response.text || "The simulation glitches.";
  } catch (error) {
    console.error("Gemini generation failed", error);
    return "Your internet cut out while trying to be witty.";
  }
};

export const generateWeeklyEvent = async (week: number, currentSanity: number): Promise<{title: string, description: string, effectType: 'good' | 'bad'}> => {
    try {
        const prompt = `
            Generate a random weekly event for a startup founder game.
            Week: ${week}/24.
            Current Sanity: ${currentSanity}/100.
            
            The effectType should be either "good" or "bad".
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING },
                        effectType: { type: Type.STRING }
                    },
                    required: ["title", "description", "effectType"]
                }
            }
        });

        const text = response.text;
        if (!text) throw new Error("No text");
        return JSON.parse(text);
    } catch (e) {
         return {
            title: "Cofounder Argument",
            description: "They want to pivot to crypto again.",
            effectType: "bad"
        };
    }
}
