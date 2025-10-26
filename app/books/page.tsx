'use client';

import { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../components/ProtectedRoute';
import BookSkeleton from '../components/BookSkeleton';

interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  published_year: number;
  is_available: boolean;
}

// Define the user data type
interface UserData {
  id: number;
  username: string;
  email: string;
}

// Wrap your entire component with ProtectedRoute
export default function BooksPage() {
  return (
    <ProtectedRoute>
      <BooksContent />
    </ProtectedRoute>
  );
}

function BooksContent() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [borrowing, setBorrowing] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/books');
      console.log('📚 Books response:', response);
      
      // Extract books data - PROPER way to handle Axios response
      let booksData: Book[];
      
      // Check if response has data property (Axios wrapper)
      if (response && response.data) {
        booksData = response.data;
      } else {
        // If no data property, use response directly
        booksData = response as unknown as Book[];
      }
      
      console.log('📚 Extracted books data:', booksData);
      setBooks(booksData);
    } catch (err: any) {
      setError('Failed to load books');
      console.error('Error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async (bookId: number) => {
    try {
      setBorrowing(bookId);
      
      // Get user ID from localStorage
      const userDataStr = localStorage.getItem('user');
      let userId = 1; // Default fallback
      
      if (userDataStr) {
        const userData: UserData = JSON.parse(userDataStr);
        userId = userData.id;
      }
      
      console.log('🚀 Borrowing book:', { bookId, userId });
      
      const response = await api.post('/borrow', {
        book_id: bookId,
        user_id: userId,
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      });

      console.log('✅ Borrow response:', response);
      alert('Book borrowed successfully!');
      fetchBooks(); // Refresh the books list
      
    } catch (err: any) {
      console.error('❌ Borrow error:', err);
      alert('Failed to borrow book: ' + (err.response?.data?.detail || 'Unknown error'));
    } finally {
      setBorrowing(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-amber-800">Library Books</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <BookSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-amber-800">Library Books</h1>
          <button 
            onClick={() => router.push('/borrowings')}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
          >
            My Borrowings
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book.id} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-amber-200">
              <h3 className="text-xl font-semibold mb-2 text-gray-800">{book.title}</h3>
              <p className="text-gray-600 mb-2">By: {book.author}</p>
              <p className="text-sm text-gray-500 mb-2">Published: {book.published_year}</p>
              <p className="text-sm text-gray-500 mb-4">ISBN: {book.isbn}</p>
              
              <div className="flex justify-between items-center">
                <div className={`px-3 py-1 rounded-full text-sm ${
                  book.is_available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {book.is_available ? 'Available' : 'Borrowed'}
                </div>
                
                <button
                  onClick={() => handleBorrow(book.id)}
                  disabled={!book.is_available || borrowing === book.id}
                  className={`px-4 py-2 rounded text-sm ${
                    book.is_available
                      ? 'bg-amber-600 text-white hover:bg-amber-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  } ${
                    borrowing === book.id ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {borrowing === book.id ? 'Borrowing...' : 'Borrow'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {books.length === 0 && !loading && (
          <div className="text-center text-gray-500 mt-8">
            No books found in the library.
          </div>
        )}
      </div>
    </div>
  );
}