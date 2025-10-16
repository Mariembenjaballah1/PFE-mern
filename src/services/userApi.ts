
import api from './apiClient';
import { toast } from "@/components/ui/sonner";

// Real user API calls with proper error handling
export const login = async (email: string, password: string) => {
  console.log('Login attempt:', { email, password: '***' });
  
  try {
    const response = await api.post('/users/login', { email, password });
    
    console.log('Backend login successful:', response.data);
    
    // Save token and user data to localStorage
    localStorage.setItem('token', response.data.user.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    // Show success toast
    toast.success("Logged in successfully", {
      description: `Welcome back, ${response.data.user.name}!`
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Backend login error:', error);
    
    // Show proper error message
    const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials and ensure the backend server is running.';
    toast.error("Login failed", {
      description: errorMessage
    });
    
    throw new Error(errorMessage);
  }
};

export const logout = async () => {
  try {
    // Call backend logout endpoint
    await api.post('/users/logout');
  } catch (error) {
    console.error('Error during logout:', error);
    // Don't throw error for logout failures
  } finally {
    // Show logout toast
    toast.info("Logged out successfully");
    // Always clear local storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refreshToken');
  }
};

export const fetchUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const createUser = async (userData: any) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (id: string, userData: any) => {
  try {
    const response = await api.patch(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    await api.delete(`/users/${id}`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const fetchUserById = async (id: string) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
};
