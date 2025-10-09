
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Wifi, WifiOff, BarChart3, Activity } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';

const Dashboard: React.FC = () => {
  const { assets, stats, maintenance, isLoading, hasError, errors } = useDashboardData();

  console.log('Dashboard: Maintenance data being passed to components:', maintenance);

  // Get current user from localStorage
  const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        return {
          name: user.name || "User",
          role: user.role || "USER"
        };
      }
      return {
        name: "User",
        role: "USER"
      };
    } catch (e) {
      console.error('Error getting current user:', e);
      return {
        name: "User",
        role: "USER"
      };
    }
  };
  
  const currentUser = getCurrentUser();

  // Calculate stats - ensure assets is defined before calculations
  const totalAssets = assets?.length || 0;
  const operationalAssets = assets?.filter(asset => asset.status === 'operational').length || 0;
  const isConnected = !hasError && !!assets;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
          <div className="container mx-auto px-6 py-8 space-y-8">
            {/* Enhanced Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold mb-2">Asset Management Dashboard</h1>
                    <p className="text-blue-100 text-lg">Loading your system overview...</p>
                  </div>
                </div>
                <div className="flex gap-4 flex-wrap">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 animate-pulse">
                    <Activity className="h-4 w-4 mr-2" />
                    Loading...
                  </Badge>
                </div>
              </div>
            </div>

            {/* Loading Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-0 p-16">
              <div className="text-center space-y-4">
                <div className="h-12 w-12 bg-blue-500 rounded-full animate-spin mx-auto flex items-center justify-center">
                  <div className="h-6 w-6 bg-white rounded-full"></div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Loading Dashboard</h3>
                  <p className="text-muted-foreground">Gathering the latest system data...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (hasError) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50/30">
          <div className="container mx-auto px-6 py-8 space-y-8">
            {/* Enhanced Error Header */}
            <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 rounded-xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold mb-2">Dashboard Error</h1>
                    <p className="text-red-100 text-lg">Unable to load system data</p>
                  </div>
                </div>
                <div className="flex gap-4 flex-wrap">
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                    <WifiOff className="h-4 w-4 mr-2" />
                    Connection Error
                  </Badge>
                </div>
              </div>
            </div>

            {/* Error Alert */}
            <Alert variant="destructive" className="max-w-2xl mx-auto shadow-lg border-l-4 border-l-red-500">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription className="text-base">
                There was an error loading the dashboard data. Please check your connection and try refreshing the page.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="container mx-auto px-6 py-8 space-y-8">
          {/* Enhanced Header Section */}
          <DashboardHeader 
            userName={currentUser.name}
            userRole={currentUser.role}
            totalAssets={totalAssets}
            onlineAssets={operationalAssets}
            notifications={3}
          />

          {/* Connection Status */}
          <div className="flex justify-center">
            <Badge variant={isConnected ? "default" : "destructive"} className="px-4 py-2">
              {isConnected ? (
                <>
                  <Wifi className="h-4 w-4 mr-2" />
                  Connected to System
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 mr-2" />
                  System Offline
                </>
              )}
            </Badge>
          </div>

          {/* Enhanced Dashboard Content - Pass maintenance data */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-0 p-8 animate-fade-in">
            <DashboardContent 
              assets={assets || []}
              stats={stats}
              maintenance={maintenance || []}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
