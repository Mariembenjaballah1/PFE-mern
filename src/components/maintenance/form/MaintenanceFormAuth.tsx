
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/components/ui/sonner";

interface MaintenanceFormAuthProps {
  children: React.ReactNode;
}

const MaintenanceFormAuth: React.FC<MaintenanceFormAuthProps> = ({ children }) => {
  const navigate = useNavigate();
  
  // Check authentication when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    console.log('MAINTENANCE FORM AUTH - Checking authentication:', {
      hasToken: !!token,
      hasUser: !!userStr,
      tokenPreview: token ? token.substring(0, 20) + '...' : 'none'
    });
    
    if (!token) {
      console.log('MAINTENANCE FORM AUTH - No token found, redirecting to login');
      toast.error("Authentication required", {
        description: "Please log in to manage maintenance tasks"
      });
      navigate('/login');
      return;
    }
    
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log('MAINTENANCE FORM AUTH - User data found:', {
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          roleType: typeof user.role
        });
        
        // Check if user has permission to create maintenance tasks
        if (user.role !== 'ADMIN' && user.role !== 'TECHNICIAN') {
          console.log('MAINTENANCE FORM AUTH - Insufficient permissions:', {
            userRole: user.role,
            requiredRoles: ['ADMIN', 'TECHNICIAN']
          });
          toast.error("Insufficient permissions", {
            description: "Only administrators and technicians can manage maintenance tasks"
          });
          navigate('/dashboard');
          return;
        }
        
        console.log('MAINTENANCE FORM AUTH - User has valid permissions');
      } catch (error) {
        console.error('MAINTENANCE FORM AUTH - Error parsing user data:', error);
        toast.error("Invalid user data", {
          description: "Please log in again"
        });
        navigate('/login');
      }
    }
  }, [navigate]);
  
  return <>{children}</>;
};

export default MaintenanceFormAuth;
