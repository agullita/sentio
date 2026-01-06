
import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client using the environment variable directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getExecutiveBriefing = async (dataSummary: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Eres un consultor experto en RRHH y bienestar laboral. Analiza estos datos actuales de la empresa: ${dataSummary}. Proporciona un breve resumen ejecutivo (3 puntos clave) con un tono profesional and directo para el CEO. No uses markdown complejo, solo texto plano con saltos de línea.`,
    });
    // Extract text output from response.text property
    return response.text || "No se pudieron generar insights en este momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Conectando con la IA para análisis estratégico...";
  }
};
