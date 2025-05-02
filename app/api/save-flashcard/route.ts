import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Flashcard from "@/lib/models/flashcard";

export async function POST(req: Request) {
  try {
    const { question, answer, topic, userId } = await req.json();

    if (!question || !answer || !topic || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = await connectDB();
   
    const result = await Flashcard.insertOne({
      question,
      answer,
      topic,
      userId,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Flashcard saved", id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Error saving flashcard:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown server error" },
      { status: 500 }
    );
  }
}