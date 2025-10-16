
import axios from 'axios';
import { refreshAccessToken, isTokenExpired } from './auth/authService';

// Create axios instance with backend URL
const api = axios.create({
   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add token and handle token refresh
api.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('token');
    
    if (token) {
      // Check if token is expired (but allow mock tokens)
      if (!token.startsWith('mock-jwt-token') && isTokenExpired(token)) {
        console.log('Token expired, attempting refresh...');
        
        // Try to refresh the token
        const newToken = await refreshAccessToken();
        if (newToken) {
          token = newToken;
        }
      }
      
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors gracefully
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    console.error('API Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message
    });
    
    // Handle network errors (when backend is not running)
    if (error.code === 'ECONNABORTED' || error.message === 'Network Error' || !error.response) {
      console.error('Backend server is not running. Please start the backend server.');
      return Promise.reject(new Error('Backend server is not available. Please ensure the server is running on http://localhost:5000'));
    }
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      console.log('401 error, attempting token refresh');
      
      // Try to refresh token only if we have a refresh token
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        const newToken = await refreshAccessToken();
        
        if (newToken) {
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          console.log('Retrying request with new token');
          return api(originalRequest);
        }
      }
      
      // If no refresh token or refresh fails, redirect to login
      console.log('Token refresh failed or no refresh token, redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
      
      // Only redirect if we're not already on the login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
