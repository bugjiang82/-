import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function generateImage(prompt: string, aspectRatio: "1:1" | "4:3" | "16:9" = "1:1") {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio,
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned from model");
  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    throw error;
  }
}

export async function editImage(base64Image: string, prompt: string, maskBase64?: string) {
  try {
    const parts: any[] = [
      {
        inlineData: {
          data: base64Image.split(',')[1],
          mimeType: "image/png",
        },
      },
      { text: prompt },
    ];

    if (maskBase64) {
      parts.push({
        inlineData: {
          data: maskBase64.split(',')[1],
          mimeType: "image/png",
        },
      });
      parts.push({ text: "Use the provided mask to edit only the selected area." });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned from model");
  } catch (error) {
    console.error("Gemini Image Editing Error:", error);
    throw error;
  }
}
