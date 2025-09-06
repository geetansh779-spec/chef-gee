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

const generateImageForRecipe = async (recipe: Omit<Recipe, 'imageUrl'>): Promise<string> => {
  const prompt = `A high-quality, delicious-looking photograph of "${recipe.recipeName}". Professional food photography, clean background, vibrant colors, and appetizing presentation. ${recipe.description}`;
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    throw new Error("Image generation returned no images.");
  } catch (error) {
    console.error(`Error generating image for recipe "${recipe.recipeName}":`, error);
    throw new Error(`Failed to generate image for ${recipe.recipeName}.`);
  }
};


export const generateRecipes = async (ingredients: string[], dietaryPreference: string): Promise<Recipe[]> => {
  const dietaryInstruction =
    dietaryPreference && dietaryPreference !== 'None'
      ? `\nIMPORTANT: All recipes must be strictly ${dietaryPreference.toLowerCase()}. Pay close attention to this constraint.`
      : '';

  const prompt = `
    You are a creative chef. Based on the ingredients provided, generate 3 diverse and delicious recipes. 
    The recipes should be distinct from each other (e.g., a breakfast, a dinner, a dessert if possible).
    For each recipe, clearly list which of the provided ingredients are used, and what other common ingredients are needed.
    Provide clear, step-by-step instructions.
    ${dietaryInstruction}

    Ingredients available: ${ingredients.join(', ')}.
  `;

  try {
    // 1. Generate recipe text data
    const textResponse = await ai.models.generateContent({
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

    const responseText = textResponse.text.trim();
    if (!responseText) {
        throw new Error("Received an empty response from the API for recipe text.");
    }
    
    const textRecipes: Omit<Recipe, 'imageUrl'>[] = JSON.parse(responseText);

    // 2. Generate an image for each recipe in parallel
    const recipesWithImages = await Promise.all(
      textRecipes.map(async (textRecipe) => {
        const imageUrl = await generateImageForRecipe(textRecipe);
        return {
          ...textRecipe,
          imageUrl,
        };
      })
    );
    
    return recipesWithImages;

  } catch (error) {
    console.error("Error generating recipes:", error);
    throw new Error("Failed to communicate with the recipe generation service.");
  }
};