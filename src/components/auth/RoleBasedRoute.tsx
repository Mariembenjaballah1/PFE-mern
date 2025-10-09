
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ 
  children, 
  allowedRoles, 
  redirectTo = '/dashboard' 
}) => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  // First check if user is authenticated
  if (!token || !userStr) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  try {
    const user = JSON.parse(userStr);
    const userRole = user.role;
    
    console.log('RoleBasedRoute check:', {
      userRole,
      allowedRoles,
      hasAccess: allowedRoles.includes(userRole),
      currentPath: location.pathname
    });
    
    // Check if user's role is in the allowed roles
    if (!allowedRoles.includes(userRole)) {
      console.log(`Access denied for role ${userRole} to ${location.pathname}, redirecting to ${redirectTo}`);
      return <Navigate to={redirectTo} replace />;
    }
    
    return <>{children}</>;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
};

export default RoleBasedRoute;
