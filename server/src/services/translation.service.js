import { askGemini } from "./gemini.service.js";
import { TRANSLATE_PROMPT } from "../constants/prompts.js";
import { cleanCodeResponse } from "../utils/prompts.utils.js";
import { getLanguageName } from "../constants/languages.js";

export const translateCode = async (code, sourceLanguage, targetLanguage) => {
  const sourceName = getLanguageName(sourceLanguage);
  const targetName = getLanguageName(targetLanguage);

  const prompt = TRANSLATE_PROMPT(code, sourceName, targetName);
  const rawResponse = await askGemini(prompt);

  const translatedCode = cleanCodeResponse(rawResponse);

  return {
    translatedCode,
    sourceLanguage,
    targetLanguage,
  };
};


/*We get the display names for the languages (e.g., 'cpp' → 'C++'), 
build the prompt using the templates (translate, optimize, explain), send it to Gemini using askGemini,
 clean the response using cleanCodeResponse , and return the translated code. 
The response uses cleanCodeResponse because translation returns plain code, not JSON. */

