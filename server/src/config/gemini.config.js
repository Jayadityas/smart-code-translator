import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODEL_NAME = "gemini-2.5-flash-lite"; 

const generateContent = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message);
  }
};

export { genAI, MODEL_NAME, generateContent };