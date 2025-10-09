import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/DashboardLayout';
import MaintenanceTabs from '@/components/maintenance/MaintenanceTabs';
import PlanMaintenanceForm from '@/components/maintenance/PlanMaintenanceForm';
import { fetchMaintenanceTasks, MaintenanceTask } from '@/services/maintenanceApi';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, Wrench, Calendar, CheckCircle, Clock, Plus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const MaintenancePage: React.FC = () => {
  const [showPlanForm, setShowPlanForm] = useState(false);
  
  const { 
    data: maintenanceTasks = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['maintenance-tasks'],
    queryFn: fetchMaintenanceTasks,
  });

  const handlePlanMaintenance = () => {
    setShowPlanForm(true);
  };

  const handleMaintenancePlanned = () => {
    refetch();
    setShowPlanForm(false);
  };

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
          <div className="container mx-auto px-6 py-8 space-y-8">
            {/* Enhanced Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                <Wrench className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Maintenance Management
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive maintenance scheduling and tracking system
              </p>
            </div>

            {/* Loading Card */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="flex items-center justify-center p-16">
                <div className="text-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Loading Maintenance Data</h3>
                    <p className="text-muted-foreground">Gathering maintenance information...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show error state if any data fails to load
  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
          <div className="container mx-auto px-6 py-8 space-y-8">
            {/* Enhanced Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Maintenance Management
              </h1>
            </div>

            {/* Error Alert */}
            <Alert variant="destructive" className="max-w-2xl mx-auto shadow-lg">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription className="text-base">
                There was an error loading the maintenance data. Please try refreshing the page or contact support if the issue persists.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const pendingTasks = (maintenanceTasks as MaintenanceTask[]).filter(task => task.status === 'pending').length;
  const completedTasks = (maintenanceTasks as MaintenanceTask[]).filter(task => task.status === 'completed').length;
  const inProgressTasks = (maintenanceTasks as MaintenanceTask[]).filter(task => task.status === 'in-progress').length;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="container mx-auto px-6 py-8 space-y-8">
          {/* Enhanced Header Section */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg mb-4">
              <Wrench className="h-8 w-8 text-white" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent animate-fade-in">
                Maintenance Management
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: '100ms'}}>
                Comprehensive maintenance scheduling and tracking system. 
                Plan, schedule, and monitor maintenance activities to ensure optimal asset performance.
              </p>
            </div>

            {/* Add Maintenance Task Button */}
            <div className="animate-fade-in" style={{animationDelay: '150ms'}}>
              <Button 
                onClick={handlePlanMaintenance}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Plus className="h-5 w-5 mr-2" />
                Plan Maintenance Task
              </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-4xl mx-auto animate-fade-in" style={{animationDelay: '200ms'}}>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border-0">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{pendingTasks}</p>
                    <p className="text-sm text-muted-foreground">Pending Tasks</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border-0">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{inProgressTasks}</p>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border-0">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{completedTasks}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Maintenance Content */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-0 p-8 animate-fade-in" style={{animationDelay: '300ms'}}>
            {showPlanForm ? (
              <PlanMaintenanceForm 
                onSuccess={handleMaintenancePlanned}
                onCancel={() => setShowPlanForm(false)}
              />
            ) : (
              <MaintenanceTabs 
                tasks={maintenanceTasks as MaintenanceTask[]}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MaintenancePage;
