import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Flashcard from "@/lib/models/flashcard";

export async function DELETE(request: Request) {
  await connectDB();

  // Get the id from the URL
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json({ error: "No ID provided" }, { status: 400 });
  }

  await Flashcard.findByIdAndDelete(id);
  return NextResponse.json({ message: "Flashcard deleted" });
}