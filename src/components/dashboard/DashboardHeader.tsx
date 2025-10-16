
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Settings, TrendingUp, Activity, Users, Server } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  userName?: string;
  userRole?: string;
  totalAssets?: number;
  onlineAssets?: number;
  notifications?: number;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  userName = "User", 
  userRole = "USER",
  totalAssets = 0,
  onlineAssets = 0,
  notifications = 0 
}) => {
  const navigate = useNavigate();

  // Format role display name
  const getRoleDisplayName = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return 'Administrator';
      case 'TECHNICIAN':
        return 'Technician';
      case 'USER':
        return 'User';
      default:
        return 'User';
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {userName}! 👋</h1>
              <p className="text-blue-100 text-lg">Role: {getRoleDisplayName(userRole)} | Here's what's happening with your assets today</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                onClick={() => navigate('/technician-notifications')}
              >
                <Bell className="h-4 w-4 mr-1" />
                {notifications}
              </Button>
              <Button 
                variant="secondary" 
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                onClick={() => navigate('/settings')}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex gap-6 flex-wrap">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-3 py-1">
              <Server className="h-4 w-4 mr-2" />
              {totalAssets} Total Assets
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-3 py-1">
              <Activity className="h-4 w-4 mr-2" />
              {onlineAssets} Online
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-3 py-1">
              <TrendingUp className="h-4 w-4 mr-2" />
              System Healthy
            </Badge>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
                <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">Active Assets</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{onlineAssets}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                <Server className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400">Total Assets</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{totalAssets}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-800 rounded-lg">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400">Active Users</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">24</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 hover:shadow-lg transition-all duration-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-800 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-orange-600 dark:text-orange-400">Efficiency</p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">94%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHeader;
