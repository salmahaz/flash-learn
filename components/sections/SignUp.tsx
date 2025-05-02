'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock } from 'lucide-react';

const Signup = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
      } else {
        // Store token and userId in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);

        // Show success message and redirect after delay
        setSuccess(true);
        setTimeout(() => {
          router.push('/');
        }, 1500);
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F2EFE7] px-2 sm:px-4">
        <div className="w-full max-w-xs sm:max-w-md space-y-6 sm:space-y-8 bg-white p-4 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-[#006A71]">create your account</h2>
            <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-[#48A6A7]">sign up to start using flashlearn</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="fullName" className="sr-only">full name</label>
              <div className="relative">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  className="w-full rounded-md sm:rounded-lg border border-[#9ACBD0] px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs text-[#006A71] placeholder-[#9ACBD0] focus:border-[#48A6A7] focus:ring-[#48A6A7]"
                  placeholder="full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                />
              </div>
              <p className="text-[8px] sm:text-[10px] text-[#48A6A7] mt-1">enter your full name</p>
            </div>

            <div>
              <label htmlFor="email" className="sr-only">email address</label>
              <div className="relative">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-[#9ACBD0] absolute top-2.5 sm:top-3 left-3" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="pl-9 sm:pl-10 w-full rounded-md sm:rounded-lg border border-[#9ACBD0] px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs text-[#006A71] placeholder-[#9ACBD0] focus:border-[#48A6A7] focus:ring-[#48A6A7]"
                  placeholder="email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <p className="text-[8px] sm:text-[10px] text-[#48A6A7] mt-1">enter a valid email address</p>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">password</label>
              <div className="relative">
                <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-[#9ACBD0] absolute top-2.5 sm:top-3 left-3" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="pl-9 sm:pl-10 w-full rounded-md sm:rounded-lg border border-[#9ACBD0] px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs text-[#006A71] placeholder-[#9ACBD0] focus:border-[#48A6A7] focus:ring-[#48A6A7]"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <p className="text-[8px] sm:text-[10px] text-[#48A6A7] mt-1">choose a strong password</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="sr-only">confirm password</label>
              <div className="relative">
                <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-[#9ACBD0] absolute top-2.5 sm:top-3 left-3" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="pl-9 sm:pl-10 w-full rounded-md sm:rounded-lg border border-[#9ACBD0] px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs text-[#006A71] placeholder-[#9ACBD0] focus:border-[#48A6A7] focus:ring-[#48A6A7]"
                  placeholder="confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <p className="text-[8px] sm:text-[10px] text-[#48A6A7] mt-1">re-enter your password</p>
            </div>

            {error && (
              <div className="text-red-500 text-[10px] sm:text-xs text-center">{error}</div>
            )}

            {success && (
              <div className="text-[#006A71] text-[10px] sm:text-xs text-center bg-[#9ACBD0] p-2 rounded-md">
                Account created successfully! Redirecting...
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 sm:py-3 px-4 text-[10px] sm:text-xs font-medium rounded-md sm:rounded-lg text-white bg-[#006A71] hover:bg-[#48A6A7] transition duration-200"
                disabled={loading}
              >
                {loading ? 'Signing up...' : 'sign up'}
              </button>
              <p className="text-[8px] sm:text-[10px] text-center text-[#48A6A7] mt-2">
                already have an account?{' '}
                <Link href="/login" className="text-[#006A71] underline">
                  log in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;