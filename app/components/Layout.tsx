'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Navigation */}
      <nav className="bg-amber-800 shadow-lg border-b border-amber-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">📚</span>
                </div>
                <span className="text-xl font-bold text-white">
                  Empower Library
                </span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-8">
              {user ? (
                <>
                  <Link 
                    href="/books" 
                    className={`font-medium transition-colors duration-200 ${
                      pathname === '/books' 
                        ? 'text-amber-200 border-b-2 border-amber-200' 
                        : 'text-white hover:text-amber-200'
                    }`}
                  >
                    Browse Books
                  </Link>
                  <Link 
                    href="/borrowings" 
                    className={`font-medium transition-colors duration-200 ${
                      pathname === '/borrowings' 
                        ? 'text-amber-200 border-b-2 border-amber-200' 
                        : 'text-white hover:text-amber-200'
                    }`}
                  >
                    My Books
                  </Link>
                  <button 
                    onClick={logout}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/login" 
                    className={`font-medium transition-colors duration-200 ${
                      pathname === '/login' 
                        ? 'text-amber-200 border-b-2 border-amber-200' 
                        : 'text-white hover:text-amber-200'
                    }`}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register"
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}