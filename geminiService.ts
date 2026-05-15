import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { Subject, ExamType, Question } from "./types";

// In Vite, variables defined via 'define' are replaced as literal strings.
// If using standard Vite env variables, you'd use import.meta.env.VITE_GEMINI_API_KEY
const API_KEY = (process.env.GEMINI_API_KEY as string) || "";
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

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
    Generate a set of school exam questions for SDN 1 Cempaka:
    Subject: ${subject}
    Exam Type: ${examType}
    Grade: ${grade}
    ${topics ? `Topics/Materials: ${topics}` : ""}
    
    Requirements:
    1. Standard: Kurikulum Merdeka with Deep Learning/HOTS approach.
    2. Difficulty: High Order Thinking Skills (HOTS) - focusing on analysis, evaluation, and creation.
    3. Language: Indonesian (Bahasa Indonesia).
    4. Composition:
       - ${numPG} Multiple Choice (PG) questions. Each MUST have 4 options (A, B, C, D).
       - ${numIsian} Short Answer (Isian) questions.
       - ${numUraian} Essay/Long Answer (Uraian).
    
    Return the output as a JSON array of question objects.
  `;

  if (!genAI || !API_KEY) {
    throw new Error("Gemini API Key is missing. Please check your .env.local file.");
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            id: { type: SchemaType.STRING },
            type: { 
              type: SchemaType.STRING,
              enum: ["PG", "Isian", "Uraian"]
            },
            question: { type: SchemaType.STRING },
            options: {
              type: SchemaType.OBJECT,
              description: "Only required for type 'PG'",
              properties: {
                A: { type: SchemaType.STRING },
                B: { type: SchemaType.STRING },
                C: { type: SchemaType.STRING },
                D: { type: SchemaType.STRING },
              },
              required: ["A", "B", "C", "D"]
            },
            answer: { type: SchemaType.STRING }
          },
          required: ["id", "type", "question", "answer"]
        }
      }
    }
  });

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text() || "[]";
    const parsed = JSON.parse(text);
    return parsed as Question[];
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    return [];
  }
}
