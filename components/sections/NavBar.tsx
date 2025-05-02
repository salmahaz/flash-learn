'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function NavBar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav style={{ backgroundColor: '#80CBC4' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-10 md:h-12">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-white font-bold text-sm md:text-base"
            >
              Gossip&apos;s
            </Link>
          </div>
          {/* Desktop menu */}
          <div className="hidden md:flex space-x-1 md:space-x-2">
            <Link
              href="/"
              className="text-white hover:bg-teal-400 px-1 py-0.5 md:px-2 md:py-1 rounded text-xs md:text-sm"
            >
              Home
            </Link>
            <Link
              href="/admin"
              className="text-white hover:bg-teal-400 px-1 py-0.5 md:px-2 md:py-1 rounded text-xs md:text-sm"
            >
              Publisher?
            </Link>
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-white hover:bg-teal-400 p-1 rounded"
            >
              {dropdownOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        {/* Mobile menu */}
        {dropdownOpen && (
          <div className="md:hidden py-2 space-y-1">
            <Link
              href="/"
              className="block text-white hover:bg-teal-400 px-2 py-1 rounded text-sm"
              onClick={() => setDropdownOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/admin"
              className="block text-white hover:bg-teal-400 px-2 py-1 rounded text-sm"
              onClick={() => setDropdownOpen(false)}
            >
              Publisher?
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
} 