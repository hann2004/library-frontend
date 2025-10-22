'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function Home() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Try to fetch books from your backend
        const response = await api.get('/books');
        setBooks(response.data);
        setError('');
      } catch (err) {
        setError('Failed to connect to backend. Make sure your FastAPI server is running on port 8000');
        console.error('Connection error:', err);
      } finally {
        setLoading(false);
      }
    };

    testConnection();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Connecting to backend...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">
          Welcome to Empower Library
        </h1>
        <p className="text-lg text-gray-600 text-center mb-8">
          Frontend + Backend Connection Test
        </p>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <div className={`p-3 rounded-md ${error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {error ? (
              <div>
                <p className="font-medium">❌ Connection Failed</p>
                <p className="text-sm mt-1">{error}</p>
                <p className="text-sm mt-2">Make sure your backend is running: <code>uvicorn main:app --reload</code></p>
              </div>
            ) : (
              <div>
                <p className="font-medium">✅ Successfully Connected!</p>
                <p className="text-sm mt-1">Backend: {process.env.NEXT_PUBLIC_API_URL}</p>
                <p className="text-sm mt-1">Found {books.length} books in database</p>
              </div>
            )}
          </div>
        </div>

        {!error && books.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Books from Backend</h2>
            <div className="grid gap-4">
              {books.map((book: any) => (
                <div key={book.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-800">{book.title}</h3>
                  <p className="text-sm text-gray-600">by {book.author}</p>
                  <p className="text-sm text-gray-500">ISBN: {book.isbn}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}