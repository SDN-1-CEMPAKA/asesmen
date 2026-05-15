import { GoogleGenAI, Type } from "@google/genai";
import { Subject, ExamType, Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateHOTSQuestions(params: {
  subject: Subject;
  examType: ExamType;
  grade: string;
  numPG: number;
  numIsian: number;
  numUraian: number;
  topics?: string;
}): Promise<Question[]> {
  const { subject, examType, grade, numPG, numIsian, numUraian, topics } = params;

  const prompt = `
    Generate a set of school exam questions for:
    Subject: ${subject}
    Exam Type: ${examType}
    Grade: ${grade}
    ${topics ? `Topics/Materials: ${topics}` : ""}
    
    Requirements:
    1. Standard: Kurikulum Merdeka with Deep Learning approach.
    2. Difficulty: High Order Thinking Skills (HOTS) - focusing on analysis, evaluation, and creation.
    3. Language: Indonesian (Bahasa Indonesia).
    4. Composition:
       - ${numPG} Multiple Choice (PG) with 4 options (A, B, C, D).
       - ${numIsian} Short Answer (Isian).
       - ${numUraian} Essay/Long Answer (Uraian).
    
    Return the output as a JSON array of question objects.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            type: { 
              type: Type.STRING,
              enum: ["PG", "Isian", "Uraian"]
            },
            question: { type: Type.STRING },
            options: {
              type: Type.OBJECT,
              properties: {
                A: { type: Type.STRING },
                B: { type: Type.STRING },
                C: { type: Type.STRING },
                D: { type: Type.STRING },
              },
              required: ["A", "B", "C", "D"]
            },
            answer: { type: Type.STRING }
          },
          required: ["id", "type", "question", "answer"]
        }
      }
    }
  });

  try {
    const text = response.text || "[]";
    const parsed = JSON.parse(text);
    return parsed as Question[];
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    return [];
  }
}
