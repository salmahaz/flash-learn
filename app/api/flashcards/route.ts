import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Flashcard from "@/lib/models/flashcard";
import jwt from "jsonwebtoken";
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET as string;

// Helper to extract userId from JWT in Authorization header
function getUserIdFromRequest(req: Request): string | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    return payload.userId;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const flashcards = await Flashcard.find({ userId });
    return NextResponse.json(flashcards);
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { question, answer, topic } = await req.json();
    if (!question || !answer || !topic) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const flashcard = await Flashcard.create({ question, answer, topic, userId });
    return NextResponse.json(flashcard, { status: 201 });
  } catch (error) {
    console.error('Error creating flashcard:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}