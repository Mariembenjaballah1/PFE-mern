
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface UserDisplayProps {
  username: string;
  role: string;
  avatarUrl?: string;
}

const UserDisplay: React.FC<UserDisplayProps> = ({ username, role, avatarUrl }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get current user from localStorage if available
  const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.name || username;
      }
      return username;
    } catch (e) {
      console.error('Error getting current user:', e);
      return username;
    }
  };
  
  const currentUsername = getCurrentUser();
  const currentRole = role;
  
  const handleLogout = () => {
    logout();
    toast.success('Logged Out', {
      description: 'You have been successfully logged out'
    });
    navigate('/login');
  };

  const handleSettings = () => {
    navigate('/settings');
    toast.info('Settings', {
      description: 'Navigating to settings page'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar>
            <AvatarImage src={avatarUrl} alt={currentUsername} />
            <AvatarFallback className="bg-green-700 text-white">
              {getInitials(currentUsername)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{currentUsername}</p>
            <p className="text-xs leading-none text-muted-foreground">{currentRole}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSettings}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDisplay;
