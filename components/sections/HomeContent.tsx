"use client";

import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import Link from "next/link";
import { CardSkeleton } from "../skeleton/CardSkeleton";
import BackButton from "../atoms/BackButton";
import Cookies from 'js-cookie';

const HomeContent = () => {
  const router = useRouter();
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

  return (
    <div className="min-h-screen bg-[#F2EFE7] p-2 sm:p-6">
      <div className="max-w-full sm:max-w-4xl mx-auto relative">
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="bg-[#006A71] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md shadow hover:bg-[#48A6A7] transition cursor-pointer text-[10px] sm:text-xs outline-none disabled:opacity-50"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>

        <div className="flex flex-col items-center justify-center min-h-screen p-2 sm:p-4">
          <div className="w-full max-w-xs sm:max-w-md p-4 sm:p-6 rounded-md sm:rounded-lg shadow-lg bg-white">
            <h1 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-center text-[#006A71]">
              Welcome to Flashcard App
            </h1>
            <p className="text-[10px] sm:text-xs text-[#006A71] mb-4 text-center">
              Create and manage your flashcards easily
            </p>
            <p className="text-[10px] sm:text-xs text-[#006A71] mb-6 text-center">
              Flash Learn helps you create, generate, and organize your study materials. 
              Create custom flashcards manually, use AI to generate them based on topics, 
              or browse through your existing collection. Perfect for students, professionals, 
              and lifelong learners looking to enhance their study experience.
            </p>
            <div className="flex flex-col space-y-3">
              <Link
                href="/createFlashCards"
                className="w-full bg-[#006A71] text-white py-2 sm:py-3 px-3 rounded-md sm:rounded-lg hover:bg-[#48A6A7] transition ease-in-out duration-300 text-[10px] sm:text-xs text-center"
              >
                Create Flashcard
              </Link>
              <Link
                href="/generateFlashCards"
                className="w-full bg-[#006A71] text-white py-2 sm:py-3 px-3 rounded-md sm:rounded-lg hover:bg-[#48A6A7] transition ease-in-out duration-300 text-[10px] sm:text-xs text-center"
              >
                Generate Flashcards
              </Link>
              <Link
                href="/allFlashCards"
                className="w-full bg-[#006A71] text-white py-2 sm:py-3 px-3 rounded-md sm:rounded-lg hover:bg-[#48A6A7] transition ease-in-out duration-300 text-[10px] sm:text-xs text-center"
              >
                View Flashcards
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeContent; 