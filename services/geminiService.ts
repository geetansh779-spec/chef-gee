
import { GoogleGenAI, Type } from "@google/genai";
import type { Recipe } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    recipeName: { type: Type.STRING, description: "The name of the recipe." },
    description: { type: Type.STRING, description: "A short, enticing description of the dish." },
    ingredientsUsed: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Ingredients from the user's provided list that are used in this recipe.",
    },
    additionalIngredients: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Common additional ingredients needed for the recipe that were not in the user's list.",
    },
    instructions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Step-by-step instructions to prepare the dish.",
    },
  },
  required: ['recipeName', 'description', 'ingredientsUsed', 'additionalIngredients', 'instructions'],
};

export const generateRecipes = async (ingredients: string[]): Promise<Recipe[]> => {
  const prompt = `
    You are a creative chef. Based on the ingredients provided, generate 3 diverse and delicious recipes. 
    The recipes should be distinct from each other (e.g., a breakfast, a dinner, a dessert if possible).
    For each recipe, clearly list which of the provided ingredients are used, and what other common ingredients are needed.
    Provide clear, step-by-step instructions.

    Ingredients available: ${ingredients.join(', ')}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: recipeSchema,
        },
      },
    });

    const responseText = response.text.trim();
    if (!responseText) {
        throw new Error("Received an empty response from the API.");
    }
    
    const recipes: Recipe[] = JSON.parse(responseText);
    return recipes;

  } catch (error) {
    console.error("Error generating recipes:", error);
    throw new Error("Failed to communicate with the recipe generation service.");
  }
};
