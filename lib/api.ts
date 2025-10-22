import axios from 'axios';

// Create axios instance with your backend URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // Your FastAPI default port
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;