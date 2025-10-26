'use client';

import { useState } from 'react';
import api from '../../lib/api';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

// Define the response type
interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🚀 Attempting login...');
      
      const loginResponse = await api.post<LoginResponse>('/login', {
        email: email,
        password: password
      });

      console.log('✅ Login response:', loginResponse);

      // Extract token - handle both Axios response formats
      let token: string;

      if (loginResponse.data && typeof loginResponse.data === 'object') {
        token = (loginResponse.data as LoginResponse).access_token;
      } else {
        token = (loginResponse as unknown as LoginResponse).access_token;
      }

      console.log('🎯 Extracted token:', token);

      if (!token) {
        throw new Error('No authentication token received');
      }

      // Get user data from protected endpoint
      console.log('🚀 Getting user data...');
      const userResponse = await api.get('/users/me');
      console.log('✅ User data:', userResponse);

      // Extract user data
      let userData;
      if (userResponse.data && typeof userResponse.data === 'object') {
        userData = userResponse.data;
      } else {
        userData = userResponse;
      }

      console.log('🎯 Final user data:', userData);

      // Login and redirect to books
      login(token, userData);
      
    } catch (err: any) {
      console.error('❌ Login error:', err);
      setError(err.response?.data?.detail || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-amber-200 w-96">
        <h1 className="text-2xl font-bold text-center mb-6 text-amber-800">Welcome Back</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-gray-800">Email</label>
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-gray-900 bg-white"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-800">Password</label>
    <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-gray-900 bg-white"
      required
    />
  </div>

  <button
    type="submit"
    disabled={loading}
    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-gray-400"
  >
    {loading ? 'Logging in...' : 'Login'}
  </button>
</form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="text-amber-600 hover:text-amber-800">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}