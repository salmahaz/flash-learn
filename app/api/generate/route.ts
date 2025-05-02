import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is missing");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
  try {
    const { topic, numCards } = await req.json();
    console.log("Received request body:", { topic, numCards });

    if (!topic || typeof topic !== "string") {
      return NextResponse.json({ error: "Invalid or missing topic" }, { status: 400 });
    }

    let n = parseInt(numCards, 10);
    if (isNaN(n) || n < 1 || n > 20) n = 3;

    const prompt = `Generate ${n} flashcards about "${topic}". 
Reply ONLY with valid JSON, NO extra text, NO explanations.
Format: [{"question": "...", "answer": "..."}]`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    const jsonMatch = responseText.match(/```json([\s\S]*?)```/) || responseText.match(/```([\s\S]*?)```/);
    const jsonString = jsonMatch ? jsonMatch[1].trim() : responseText;

    const flashcards = JSON.parse(jsonString);

    if (!Array.isArray(flashcards) || flashcards.some(fc => !fc.question || !fc.answer)) {
      throw new Error("Invalid JSON structure from Gemini");
    }

    return NextResponse.json(
      { message: "Flashcards generated successfully", flashcards },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error generating flashcards:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown server error" },
      { status: 500 }
    );
  }
}