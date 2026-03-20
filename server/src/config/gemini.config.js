import { GoogleGenAI } from "@google/genai";
//We are treating the Gemini as a client and using the API key to authenticate our requests
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const MODEL_NAME = "gemini-2.5-flash";

//This function sends text prompt to gemini and return's the response
const generateContent = async (prompt) => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    throw new Error(`Gemini API failed: ${error.message}`);
  }
};

export { ai, MODEL_NAME, generateContent };