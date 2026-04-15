import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData } from "../types";

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function enhanceSummary(summary: string): Promise<string> {
  if (!summary.trim()) return "";
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: `Enhance the following resume summary to make it more professional, impactful, and concise. Keep it to 3-4 sentences maximum. Do not include any introductory or concluding remarks, just return the enhanced summary text.\n\nOriginal Summary:\n${summary}`,
    });
    
    return response.text?.trim() || summary;
  } catch (error) {
    console.error("Error enhancing summary:", error);
    throw new Error("Failed to enhance summary. Please try again.");
  }
}

export async function enhanceExperience(description: string): Promise<string> {
  if (!description.trim()) return "";
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents: `Enhance the following resume experience bullet points. Make them more action-oriented, quantifiable (if possible), and professional. Keep them as bullet points (starting with '-'). Do not include any introductory or concluding remarks, just return the enhanced bullet points.\n\nOriginal Description:\n${description}`,
    });
    
    return response.text?.trim() || description;
  } catch (error) {
    console.error("Error enhancing experience:", error);
    throw new Error("Failed to enhance experience. Please try again.");
  }
}

export async function parseResumeText(text: string): Promise<Partial<ResumeData>> {
  if (!text.trim()) return {};
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Extract the following raw text into a structured resume format. Do your best to parse names, contact info, summary, experience, education, and skills.\n\nRaw Text:\n${text}`,
      config: {
        systemInstruction: "You are an expert resume parser. Extract the information accurately into the provided JSON schema. If a field is missing, leave it empty or omit it.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            personalInfo: {
              type: Type.OBJECT,
              properties: {
                fullName: { type: Type.STRING },
                email: { type: Type.STRING },
                phone: { type: Type.STRING },
                location: { type: Type.STRING },
                website: { type: Type.STRING },
                linkedin: { type: Type.STRING },
              }
            },
            summary: { type: Type.STRING },
            experience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  company: { type: Type.STRING },
                  position: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  description: { type: Type.STRING, description: "Bullet points of achievements, separated by newlines and starting with dashes" },
                }
              }
            },
            education: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  institution: { type: Type.STRING },
                  degree: { type: Type.STRING },
                  startDate: { type: Type.STRING },
                  endDate: { type: Type.STRING },
                  gpa: { type: Type.STRING },
                }
              }
            },
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });
    
    const jsonStr = response.text?.trim();
    if (!jsonStr) throw new Error("Empty response from Gemini");
    
    const parsed = JSON.parse(jsonStr);
    
    // Add IDs to arrays
    if (parsed.experience) {
      parsed.experience = parsed.experience.map((exp: any) => ({
        ...exp,
        id: crypto.randomUUID()
      }));
    }
    
    if (parsed.education) {
      parsed.education = parsed.education.map((edu: any) => ({
        ...edu,
        id: crypto.randomUUID()
      }));
    }
    
    return parsed;
  } catch (error) {
    console.error("Error parsing resume text:", error);
    throw new Error("Failed to parse resume text. Please try again.");
  }
}
