
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Boxes, 
  CreditCard, 
  Settings, 
  FileBarChart, 
  Mail,
  Users,
  Bell,
  BrainCircuit,
  Folder,
  LayoutList
} from 'lucide-react';
import Logo from './Logo';
import { Sidebar } from './ui/sidebar/sidebar';
import { useSidebar } from './ui/sidebar/sidebar-context';

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  onLinkClick?: () => void;
  isDivider?: boolean;
}

// Define props for the AppSidebar component
interface AppSidebarProps {
  isMobile?: boolean;
  onNavClick?: () => void;
  userRole?: 'ADMIN' | 'TECHNICIAN' | 'USER';
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon: Icon, label, onLinkClick, isDivider = false }) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);
  const { isOpen } = useSidebar();

  return (
    <>
      {isDivider && <div className="border-t border-white/10 my-2"></div>}
      <NavLink 
        to={to} 
        onClick={onLinkClick}
        className={({ isActive }) => 
          `flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors ${
            isActive ? 'bg-white/20 font-medium text-white' : 'text-white/80'
          }`
        }
      >
        <Icon className="h-4 w-4" />
        {isOpen && <span>{label}</span>}
      </NavLink>
    </>
  );
};

const AppSidebar: React.FC<AppSidebarProps> = ({ 
  isMobile = false, 
  onNavClick,
  userRole = 'USER'
}) => {
  const isAdmin = userRole === 'ADMIN';
  const isTechnician = userRole === 'TECHNICIAN';
  const isUser = userRole === 'USER';
  const { isOpen } = useSidebar();

  return (
    <Sidebar className={isOpen ? 'w-64' : 'w-16'}>
      <div className="p-4 border-b border-white/10">
        <Logo />
      </div>
      
      <div className="flex-1 py-3 px-2 space-y-1">
        {/* Dashboard - Available to all users */}
        <SidebarLink 
          to="/dashboard" 
          icon={LayoutDashboard} 
          label="Dashboard"
          onLinkClick={onNavClick}
        />
        
        {/* Projects - Available to all users */}
        <SidebarLink 
          to="/projects" 
          icon={Folder} 
          label="Projects"
          onLinkClick={onNavClick}
        />
        
        {/* Assets - Only for TECHNICIAN and ADMIN */}
        {(isTechnician || isAdmin) && (
          <SidebarLink 
            to="/assets" 
            icon={Boxes} 
            label="Assets"
            onLinkClick={onNavClick}
          />
        )}
        
        {/* Maintenance - Only for TECHNICIAN and ADMIN */}
        {(isTechnician || isAdmin) && (
          <SidebarLink 
            to="/maintenance" 
            icon={LayoutList} 
            label="Maintenance"
            onLinkClick={onNavClick}
          />
        )}
        
        {/* Reports - Only for TECHNICIAN and ADMIN */}
        {(isTechnician || isAdmin) && (
          <SidebarLink 
            to="/reports" 
            icon={FileBarChart} 
            label="Reports"
            onLinkClick={onNavClick}
          />
        )}
        
        {/* AI Insights - Only for TECHNICIAN and ADMIN */}
        {(isTechnician || isAdmin) && (
          <SidebarLink 
            to="/ai-insights" 
            icon={BrainCircuit} 
            label="AI Insights"
            onLinkClick={onNavClick}
            isDivider={true}
          />
        )}
        
        {/* User Management - Only for ADMIN */}
        {isAdmin && (
          <SidebarLink 
            to="/users" 
            icon={Users} 
            label="User Management"
            onLinkClick={onNavClick}
          />
        )}
        
        {/* Technician Notifications - Only for TECHNICIAN and ADMIN */}
        {isTechnician && (
          <SidebarLink 
            to="/technician-notifications" 
            icon={Bell} 
            label="Notifications"
            onLinkClick={onNavClick}
          />
        )}
        
        {/* Email Reports - Only for TECHNICIAN and ADMIN */}
        {(isTechnician || isAdmin) && (
          <SidebarLink 
            to="/email" 
            icon={Mail} 
            label="Email Reports"
            onLinkClick={onNavClick}
            isDivider={!isAdmin && !isTechnician}
          />
        )}
        
        {/* Settings - Only for TECHNICIAN and ADMIN */}
        {(isTechnician || isAdmin) && (
          <SidebarLink 
            to="/settings" 
            icon={Settings} 
            label="Settings"
            onLinkClick={onNavClick}
            isDivider={true}
          />
        )}
      </div>
    </Sidebar>
  );
};

export default AppSidebar;
