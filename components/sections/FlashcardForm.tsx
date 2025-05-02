"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import BackButton from "../atoms/BackButton";
import FormSkeleton from "../skeleton/FormSkeleton";
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const FlashcardForm = () => {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [topic, setTopic] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      Cookies.remove("token");
      await fetch('/api/logout', { method: 'POST' });
      await router.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setIsLoggingOut(false);
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`${API_URL}/flashcards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ question, answer, topic }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create flashcard');
      }

      setSuccessMessage("Flashcard created successfully!");
      setQuestion("");
      setAnswer("");
      setTopic("");
    } catch (error: any) {
      setSuccessMessage(error.message || "Failed to create flashcard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <FormSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#F2EFE7] p-2 sm:p-6">
      <div className="max-w-full sm:max-w-4xl mx-auto relative">
        <BackButton />
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="bg-[#006A71] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md shadow hover:bg-[#48A6A7] transition cursor-pointer text-[10px] sm:text-xs outline-none disabled:opacity-50"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>

        <div className="flex justify-center items-center min-h-screen p-2 sm:p-4">
          <form onSubmit={handleSubmit} className="w-full max-w-xs sm:max-w-md p-4 sm:p-6 rounded-md sm:rounded-lg shadow-lg bg-white">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-center text-[#006A71]">Create a New Flashcard</h2>

            {successMessage && (
              <div className={`mb-3 sm:mb-4 p-2 sm:p-3 rounded-md sm:rounded-lg text-[10px] sm:text-xs ${successMessage.includes("successfully") ? "text-[#006A71] bg-[#9ACBD0]" : "text-red-500 bg-red-100"}`}>
                {successMessage}
              </div>
            )}

            <div className="mb-3 sm:mb-4">
              <label className="block text-[10px] sm:text-xs font-medium mb-1 sm:mb-2 text-[#006A71]" htmlFor="question">
                Question
              </label>
              <input
                id="question"
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full p-2 sm:p-3 border border-[#9ACBD0] rounded-md sm:rounded-lg text-[10px] sm:text-xs text-[#006A71] placeholder-[#9ACBD0] focus:border-[#48A6A7] focus:ring-[#48A6A7]"
                required
              />
            </div>

            <div className="mb-3 sm:mb-4">
              <label className="block text-[10px] sm:text-xs font-medium mb-1 sm:mb-2 text-[#006A71]" htmlFor="answer">
                Answer
              </label>
              <input
                id="answer"
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full p-2 sm:p-3 border border-[#9ACBD0] rounded-md sm:rounded-lg text-[10px] sm:text-xs text-[#006A71] placeholder-[#9ACBD0] focus:border-[#48A6A7] focus:ring-[#48A6A7]"
                required
              />
            </div>

            <div className="mb-3 sm:mb-4">
              <label className="block text-[10px] sm:text-xs font-medium mb-1 sm:mb-2 text-[#006A71]" htmlFor="topic">
                Topic
              </label>
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-2 sm:p-3 border border-[#9ACBD0] rounded-md sm:rounded-lg text-[10px] sm:text-xs text-[#006A71] placeholder-[#9ACBD0] focus:border-[#48A6A7] focus:ring-[#48A6A7]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#006A71] text-white py-2 sm:py-3 px-3 rounded-md sm:rounded-lg hover:bg-[#48A6A7] transition ease-in-out duration-300 text-[10px] sm:text-xs"
            >
              Create Flashcard
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FlashcardForm;