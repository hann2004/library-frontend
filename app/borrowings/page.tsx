'use client';

import { useState, useEffect } from 'react';
import api from '../../lib/api';

interface Borrowing {
  id: number;
  borrow_date: string;
  due_date: string;
  return_date: string | null;
  book: {
    id: number;
    title: string;
    author: string;
  };
}

interface ReturnResponse {
  id: number;
  return_date: string;
}

export default function BorrowingsPage() {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [returning, setReturning] = useState<number | null>(null);

  useEffect(() => {
    fetchBorrowings();
  }, []);

  const fetchBorrowings = async () => {
    try {
      // For now, we'll use user_id 1
      // Later we'll get the actual logged-in user
      const response = await api.get('/users/1/borrowings');
      setBorrowings(response.data); // ✅ Fixed: use response.data
    } catch (err: any) {
      setError('Failed to load borrowings');
      console.error('Error fetching borrowings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (borrowingId: number) => {
    try {
      setReturning(borrowingId);
      
      const response = await api.post('/return', {
        borrowing_id: borrowingId
      });

      alert('Book returned successfully!');
      fetchBorrowings(); // Refresh the list
      
    } catch (err: any) {
      console.error('Return error:', err);
      alert('Failed to return book: ' + (err.response?.data?.detail || 'Unknown error'));
    } finally {
      setReturning(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">Loading your borrowings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Borrowed Books</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {borrowings.map((borrowing) => (
            <div key={borrowing.id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{borrowing.book.title}</h3>
                  <p className="text-gray-600">By: {borrowing.book.author}</p>
                  <p className="text-sm text-gray-500">
                    Borrowed: {new Date(borrowing.borrow_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Due: {new Date(borrowing.due_date).toLocaleDateString()}
                  </p>
                  <p className={`text-sm ${
                    borrowing.return_date ? 'text-green-600' : 'text-red-600'
                  }`}>
                    Status: {borrowing.return_date ? 'Returned' : 'Currently Borrowed'}
                  </p>
                </div>
                
                {!borrowing.return_date && (
                  <button
                    onClick={() => handleReturn(borrowing.id)}
                    disabled={returning === borrowing.id}
                    className={`px-4 py-2 rounded ${
                      returning === borrowing.id
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {returning === borrowing.id ? 'Returning...' : 'Return Book'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {borrowings.length === 0 && !loading && (
          <div className="text-center text-gray-500 mt-8">
            You haven't borrowed any books yet.
          </div>
        )}
      </div>
    </div>
  );
}