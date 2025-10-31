
import { GoogleGenAI, Modality } from "@google/genai";
import type { Outfit } from '../types';

const OUTFIT_CATEGORIES = ['Casual', 'Business', 'Night Out'];

export const generateOutfits = async (base64ImageData: string, mimeType: string): Promise<Outfit[]> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const imagePart = {
    inlineData: {
      data: base64ImageData,
      mimeType: mimeType,
    },
  };

  const generationPromises = OUTFIT_CATEGORIES.map(async (category) => {
    const textPart = {
      text: `Based on this single clothing item, generate a complete, stylish ${category} outfit. Display it as a clean 'flat-lay' on a neutral light gray background to keep the focus on the clothes. The generated image should only contain the clothing items.`,
    };

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [imagePart, textPart] },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });

      const generatedImagePart = response.candidates?.[0]?.content?.parts?.[0];
      if (generatedImagePart?.inlineData?.data) {
        const base64ImageBytes: string = generatedImagePart.inlineData.data;
        const imageUrl = `data:image/png;base64,${base64ImageBytes}`;
        return { title: `${category} Look`, imageUrl };
      } else {
         throw new Error(`No image data returned for ${category} category.`);
      }
    } catch (error) {
       console.error(`Error generating outfit for ${category}:`, error);
       // Re-throw to be caught by Promise.all rejection handler
       throw new Error(`Failed to generate a valid image for the ${category} outfit. The model might be unable to process this request.`);
    }
  });

  return Promise.all(generationPromises);
};
