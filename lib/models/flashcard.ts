import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFlashcard extends Document {
  question: string;
  answer: string;
  topic: string;
  userId: Types.ObjectId; // Reference to the User
}

const flashcardSchema = new Schema<IFlashcard>({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  topic: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // User reference
});

const Flashcard = mongoose.models.Flashcard || mongoose.model<IFlashcard>("Flashcard", flashcardSchema);

export default Flashcard;