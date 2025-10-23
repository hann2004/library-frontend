'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Empower Library</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-blue-600 hover:text-blue-800">
                Login
              </Link>
              <Link href="/register" className="text-green-600 hover:text-green-800">
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Empower Library
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Manage your library collection with ease
          </p>
          <div className="space-x-4">
            <Link
              href="/register"
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Create Account
            </Link>
            <Link
              href="/login"
              className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50"
            >
              Login
            </Link>
            <Link
              href="/books"
              className="border border-gray-600 text-gray-600 px-6 py-3 rounded-lg hover:bg-gray-50"
            >
              Browse Books
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}