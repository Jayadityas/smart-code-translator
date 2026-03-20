
/*First, we check if the response starts with ``` . If so, we strip the opening ```json and closing ```  using regex. 
Then we parse the cleaned text as JSON. This is used for analyze, optimize, and explain responses. */
export const parseGeminiJSON = (text) => {
  try {
    let cleanText = text.trim();

    if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/^```(?:json)?\s*\n?/, "");
      cleanText = cleanText.replace(/\n?```\s*$/, "");
    }

    return JSON.parse(cleanText.trim());
  } catch (error) {
    console.error("Failed to parse Gemini JSON response:", error.message);
    throw new Error(
      "Failed to parse AI response. The AI returned an unexpected format.",
    );
  }
};

//This is used for the translate response, which is plain code.
export const cleanCodeResponse = (text) => {
  let cleanText = text.trim();

  if (cleanText.startsWith("```")) {
    cleanText = cleanText.replace(/^```\w*\s*\n?/, "");
    cleanText = cleanText.replace(/\n?```\s*$/, "");
  }

  return cleanText.trim();
};

