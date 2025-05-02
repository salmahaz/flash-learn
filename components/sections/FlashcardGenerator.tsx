"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import BackButton from "../atoms/BackButton";
import FormSkeleton from "../skeleton/FormSkeleton";
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const FlashcardGenerator = () => {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [numCards, setNumCards] = useState(5);
  const [generatedCards, setGeneratedCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<{ [key: string]: string }>({});
  const [saveLoading, setSaveLoading] = useState<{ [key: string]: boolean }>({});
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

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setGeneratedCards([]);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`${API_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ topic, numCards }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate flashcards');
      }

      const data = await response.json();
      if (!data.flashcards || !Array.isArray(data.flashcards)) {
        throw new Error("Invalid response format");
      }
      setGeneratedCards(data.flashcards);
    } catch (err: any) {
      setError(err.message || "Failed to generate flashcards");
    } finally {
      setLoading(false);
    }
  }, [topic, numCards, router]);

  const handleSave = useCallback(async (flashcard: any, index: number) => {
    setSaveLoading(prev => ({ ...prev, [index]: true }));
    setSaveStatus(prev => ({ ...prev, [index]: "" }));

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`${API_URL}/save-flashcard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(flashcard),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save flashcard');
      }

      setSaveStatus(prev => ({ ...prev, [index]: "Saved successfully!" }));
    } catch (err: any) {
      setSaveStatus(prev => ({ ...prev, [index]: err.message || "Failed to save" }));
    } finally {
      setSaveLoading(prev => ({ ...prev, [index]: false }));
    }
  }, [router]);

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
          <div className="w-full max-w-xs sm:max-w-md p-4 sm:p-6 rounded-md sm:rounded-lg shadow-lg bg-white">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-center text-[#006A71]">Generate Flashcards</h2>

            {error && (
              <div className="mb-3 sm:mb-4 p-2 sm:p-3 rounded-md sm:rounded-lg text-[10px] sm:text-xs text-red-500 bg-red-100">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-[#006A71] mb-1">
                  Topic
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full p-2 sm:p-3 border border-[#9ACBD0] rounded-md sm:rounded-lg text-[10px] sm:text-xs text-[#006A71] placeholder-[#9ACBD0] focus:border-[#48A6A7] focus:ring-[#48A6A7]"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-[#006A71] mb-1">
                  Number of Cards
                </label>
                <select
                  value={numCards}
                  onChange={(e) => setNumCards(Number(e.target.value))}
                  className="w-full p-2 sm:p-3 border border-[#9ACBD0] rounded-md sm:rounded-lg text-[10px] sm:text-xs text-[#006A71] placeholder-[#9ACBD0] focus:border-[#48A6A7] focus:ring-[#48A6A7]"
                >
                  {[3, 5, 10, 15].map((num) => (
                    <option key={num} value={num}>
                      {num} cards
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#006A71] text-white py-2 sm:py-3 px-3 rounded-md sm:rounded-lg hover:bg-[#48A6A7] transition ease-in-out duration-300 text-[10px] sm:text-xs"
              >
                Generate
              </button>
            </form>

            {generatedCards.length > 0 && (
              <div className="mt-6 space-y-4">
                <h3 className="text-[10px] sm:text-xs font-medium text-[#006A71]">
                  Generated Flashcards:
                </h3>
                {generatedCards.map((card, index) => (
                  <div
                    key={index}
                    className="border border-[#9ACBD0] p-3 sm:p-4 rounded-md sm:rounded-lg bg-white shadow-sm"
                  >
                    <p className="font-medium text-[#006A71] text-[10px] sm:text-xs">
                      <strong>Question:</strong> {card.question}
                    </p>
                    <p className="text-[#48A6A7] mt-1 sm:mt-2 text-[10px] sm:text-xs">
                      <strong>Answer:</strong> {card.answer}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <button
                        onClick={() => handleSave(card, index)}
                        disabled={saveLoading[index]}
                        className="bg-[#006A71] text-white px-3 py-1 rounded-md hover:bg-[#48A6A7] transition text-[10px] sm:text-xs disabled:opacity-50"
                      >
                        {saveLoading[index] ? "Saving..." : "Save"}
                      </button>
                      {saveStatus[index] && (
                        <span className="text-[10px] sm:text-xs text-[#006A71]">
                          {saveStatus[index]}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardGenerator;