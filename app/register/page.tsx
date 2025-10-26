'use client';

import { useState } from 'react';
import api from '../../lib/api';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

// Define the response types
interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

interface RegisterResponse {
  id?: number;
  username?: string;
  email?: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🚀 Starting registration...');
      
      // Step 1: Register the user
      const registerResponse = await api.post<RegisterResponse>('/register', formData);
      console.log('✅ Registration successful:', registerResponse);
      
      // Step 2: Wait a moment to ensure user is saved in database
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Step 3: Auto-login after successful registration
      console.log('🚀 Attempting auto-login...');
      const loginResponse = await api.post<LoginResponse>('/login', {
        email: formData.email,
        password: formData.password
      });
      console.log('✅ Auto-login response:', loginResponse);

      // Step 4: Debug - check the actual response structure
      console.log('🔍 Full login response:', loginResponse);
      console.log('🔍 Response keys:', Object.keys(loginResponse));

      // Step 5: Extract the token - handle both Axios response formats
      let token: string;

      // Check if it's an Axios response (has data property)
      if (loginResponse.data && typeof loginResponse.data === 'object') {
        const responseData = loginResponse.data as LoginResponse;
        token = responseData.access_token;
        console.log('🎯 Token from response.data:', token);
      } else {
        // Direct response (if Axios interceptor strips the data wrapper)
        const responseData = loginResponse as unknown as LoginResponse;
        token = responseData.access_token;
        console.log('🎯 Token from direct response:', token);
      }

      if (!token) {
        console.error('❌ Token not found in login response');
        throw new Error('Authentication token not received');
      }

      // Step 6: Create user data
      const userData = {
        id: registerResponse.data?.id || 1,
        username: formData.username,
        email: formData.email
      };

      console.log('🎯 Calling login with:', { token, userData });
      
      // Step 7: Login and redirect to books
      login(token, userData);
      
    } catch (err: any) {
      console.error('❌ Error:', err);
      
      if (err.response) {
        console.error('Error response data:', err.response.data);
        console.error('Error status:', err.response.status);
      }
      
      setError(err.response?.data?.detail || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-amber-200 w-96">
        <h1 className="text-2xl font-bold text-center mb-6 text-amber-800">Join Our Library</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-gray-800">Full Name</label>
    <input
      type="text"
      name="full_name"
      value={formData.full_name}
      onChange={handleChange}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-gray-900 bg-white"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-800">Username</label>
    <input
      type="text"
      name="username"
      value={formData.username}
      onChange={handleChange}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-gray-900 bg-white"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-800">Email</label>
    <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-gray-900 bg-white"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-gray-800">Password</label>
    <input
      type="password"
      name="password"
      value={formData.password}
      onChange={handleChange}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-gray-900 bg-white"
      required
    />
  </div>

  <button
    type="submit"
    disabled={loading}
    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-gray-400"
  >
    {loading ? 'Creating Account...' : 'Create Account'}
  </button>
</form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-amber-600 hover:text-amber-800">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}