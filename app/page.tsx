import Link from 'next/link';

export default function Home() {
  return (
    <div className="text-center">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto py-16">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to{' '}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Empower Library
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          Discover, borrow, and manage your favorite books in our digital library. 
          Your literary journey starts here.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">📚</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Browse Collection</h3>
            <p className="text-gray-600">Explore thousands of books across all genres</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">⏰</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Easy Borrowing</h3>
            <p className="text-gray-600">Borrow books with just one click, return anytime</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Track Reading</h3>
            <p className="text-gray-600">Keep track of your borrowed books and reading history</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/books"
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-lg"
          >
            Browse Books
          </Link>
          <Link
            href="/register"
            className="border-2 border-blue-500 text-blue-600 px-8 py-4 rounded-xl hover:bg-blue-50 transition-all duration-200 font-semibold text-lg"
          >
            Join Now
          </Link>
        </div>
      </div>
    </div>
  );
}