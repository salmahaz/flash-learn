'use client';

import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import BackButton from "../atoms/BackButton";
import ListSkeleton from "../skeleton/ListSkeleton";
import Cookies from 'js-cookie';

const ITEMS_PER_PAGE = 10;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const FlashcardList = () => {
  const router = useRouter();
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [flashcardToDelete, setFlashcardToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [visibleAnswers, setVisibleAnswers] = useState<{ [key: string]: boolean }>({});
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  const fetchFlashcards = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`${API_URL}/flashcards`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch flashcards');
      }

      const data = await response.json();
      setFlashcards(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch flashcards. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchFlashcards();
  }, [fetchFlashcards]);

  const deleteFlashcard = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const res = await fetch(`${API_URL}/flashcards/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete flashcard");
      setFlashcards((prev) => prev.filter((flashcard) => flashcard._id !== id));
      setDeleteModalOpen(false);
      setSuccessMessage("Flashcard deleted successfully!");
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (err) {
      setError("Failed to delete flashcard. Please try again.");
    }
  };

  const toggleAnswer = (id: string) => {
    setVisibleAnswers(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const totalPages = Math.ceil(flashcards.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentFlashcards = flashcards.slice(startIndex, endIndex);

  if (loading) {
    return <ListSkeleton />;
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
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-center text-[#006A71]">
              Your Flashcards
            </h2>

            {error && (
              <div className="mb-3 sm:mb-4 p-2 sm:p-3 rounded-md sm:rounded-lg text-[10px] sm:text-xs text-red-500 bg-red-100">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="mb-3 sm:mb-4 p-2 sm:p-3 rounded-md sm:rounded-lg text-[10px] sm:text-xs text-[#006A71] bg-[#9ACBD0]">
                {successMessage}
              </div>
            )}

            {flashcards.length === 0 ? (
              <div className="text-center text-[#006A71] text-[10px] sm:text-xs">
                No flashcards found. Create some flashcards to get started!
              </div>
            ) : (
              <>
                <ul className="space-y-4">
                  {currentFlashcards.map((flashcard) => (
                    <li
                      key={flashcard._id}
                      className="border border-[#9ACBD0] p-3 sm:p-4 rounded-md sm:rounded-lg bg-white shadow-sm"
                    >
                      <p className="font-medium text-[#006A71] text-[10px] sm:text-xs">
                        <strong>Question:</strong> {flashcard.question}
                      </p>
                      {visibleAnswers[flashcard._id] && (
                        <p className="text-[#48A6A7] mt-1 sm:mt-2 text-[10px] sm:text-xs">
                          <strong>Answer:</strong> {flashcard.answer}
                        </p>
                      )}
                      <p className="text-[#9ACBD0] mt-1 sm:mt-2 text-[10px] sm:text-xs">
                        <strong>Topic:</strong> {flashcard.topic}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <button
                          onClick={() => toggleAnswer(flashcard._id)}
                          className="text-[#006A71] hover:text-[#48A6A7] text-[10px] sm:text-xs"
                        >
                          {visibleAnswers[flashcard._id] ? "Hide Answer" : "Show Answer"}
                        </button>
                        <button
                          onClick={() => {
                            setFlashcardToDelete(flashcard._id);
                            setDeleteModalOpen(true);
                          }}
                          className="text-red-500 hover:text-red-700 text-[10px] sm:text-xs ml-2"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Modal for delete confirmation */}
                {deleteModalOpen && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs w-full">
                      <h3 className="text-[#006A71] text-center mb-4 text-[10px] sm:text-xs font-semibold">
                        Are you sure you want to delete this flashcard?
                      </h3>
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={() => {
                            if (flashcardToDelete) deleteFlashcard(flashcardToDelete);
                          }}
                          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-700 text-[10px] sm:text-xs"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setDeleteModalOpen(false)}
                          className="bg-gray-300 text-[#006A71] px-4 py-1 rounded hover:bg-gray-400 text-[10px] sm:text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="flex justify-center mt-4 space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 bg-[#006A71] text-white rounded-md disabled:opacity-50 text-[10px] sm:text-xs"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-[#006A71] text-[10px] sm:text-xs">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 bg-[#006A71] text-white rounded-md disabled:opacity-50 text-[10px] sm:text-xs"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardList;