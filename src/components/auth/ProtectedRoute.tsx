
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  console.log('ProtectedRoute check:', { 
    token: !!token, 
    user: !!user, 
    location: location.pathname
  });
  
  // Require both token and user data for authentication
  if (!token || !user) {
    console.log('No valid authentication found, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  console.log('Authentication valid, rendering protected content');
  return <>{children}</>;
};

export default ProtectedRoute;
