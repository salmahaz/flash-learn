'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock } from 'lucide-react';

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const msg = searchParams.get('message');
    if (msg) {
      setMessage(msg);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
  
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        setError(data.error || 'Invalid email or password.');
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
      
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F2EFE7] px-3 sm:px-4 py-6">
        <div className="w-full max-w-[320px] sm:max-w-md space-y-4 sm:space-y-8 bg-white p-4 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-[#006A71]">welcome back</h2>
            <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-[#48A6A7]">log in to continue using flashlearn</p>
          </div>

          {message && (
            <div className="text-[#006A71] text-[10px] sm:text-xs text-center bg-[#9ACBD0] p-2 rounded-md">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">email address</label>
              <div className="relative">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-[#9ACBD0] absolute top-2.5 sm:top-3 left-3" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="pl-9 sm:pl-10 w-full rounded-lg border border-[#9ACBD0] px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs text-[#006A71] placeholder-[#9ACBD0] focus:border-[#48A6A7] focus:ring-[#48A6A7]"
                  placeholder="email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <p className="text-[8px] sm:text-[10px] text-[#48A6A7] mt-1">use the email you signed up with</p>
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
                  className="pl-9 sm:pl-10 w-full rounded-lg border border-[#9ACBD0] px-3 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs text-[#006A71] placeholder-[#9ACBD0] focus:border-[#48A6A7] focus:ring-[#48A6A7]"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <p className="text-[8px] sm:text-[10px] text-[#48A6A7] mt-1">your password is case-sensitive</p>
            </div>

            {error && (
              <div className="text-red-500 text-[10px] sm:text-xs text-center">{error}</div>
            )}

            {success && (
              <div className="text-[#006A71] text-[10px] sm:text-xs text-center bg-[#9ACBD0] p-2 rounded-md">
                Login successful! Redirecting...
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 sm:py-3 px-4 text-[10px] sm:text-xs font-medium rounded-lg text-white bg-[#006A71] hover:bg-[#48A6A7] transition duration-200"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'sign in'}
              </button>
              <p className="text-[8px] sm:text-[10px] text-center text-[#48A6A7] mt-2">
                new to flashlearn?{' '}
                <Link href="/signup" className="text-[#006A71] underline">
                  create an account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;