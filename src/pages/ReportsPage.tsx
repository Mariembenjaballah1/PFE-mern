import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import ReportsTabs, { ReportsTabsProps } from '@/components/reports/ReportsTabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, BarChart3, FileText, TrendingUp, Activity, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { fetchAssets } from '@/services/assetApi';
import { fetchMaintenanceTasks, MaintenanceTask } from '@/services/maintenanceApi';
import { fetchSystemSettings } from '@/services/settingsApi';

const ReportsPage: React.FC = () => {
  // Fetch all necessary data for reports
  const { data: assets, isLoading: assetsLoading, error: assetsError } = useQuery({
    queryKey: ['assets', 'reports'],
    queryFn: fetchAssets
  });

  const { data: maintenance, isLoading: maintenanceLoading, error: maintenanceError } = useQuery({
    queryKey: ['maintenance', 'reports'],
    queryFn: fetchMaintenanceTasks
  });

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['settings', 'system'],
    queryFn: fetchSystemSettings
  });

  const isLoading = assetsLoading || maintenanceLoading || settingsLoading;
  const hasError = assetsError || maintenanceError;

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
          <div className="container mx-auto px-6 py-8 space-y-8">
            {/* Enhanced Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Reports & Analytics
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive insights into your inventory, assets, and maintenance operations
              </p>
            </div>

            {/* Loading Card */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="flex items-center justify-center p-16">
                <div className="text-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Loading Report Data</h3>
                    <p className="text-muted-foreground">Gathering the latest insights...</p>
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
  if (hasError) {
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
                Reports & Analytics
              </h1>
            </div>

            {/* Error Alert */}
            <Alert variant="destructive" className="max-w-2xl mx-auto shadow-lg">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription className="text-base">
                There was an error loading the reports data. Please try refreshing the page or contact support if the issue persists.
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
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg mb-4">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent animate-fade-in">
                Reports & Analytics
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: '100ms'}}>
                Comprehensive insights into your inventory, assets, and maintenance operations. 
                Generate detailed reports and track performance metrics across your organization.
              </p>
            </div>

            {/* Quick Access to Asset Usage Analytics */}
            <div className="mt-8 animate-fade-in" style={{animationDelay: '200ms'}}>
              <Link to="/reports/asset-usage">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                  <Activity className="h-6 w-6 mr-3" />
                  View Asset Usage Analytics
                  <ArrowRight className="h-5 w-5 ml-3" />
                </Button>
              </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-4xl mx-auto animate-fade-in" style={{animationDelay: '300ms'}}>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border-0">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{assets?.length || 0}</p>
                    <p className="text-sm text-muted-foreground">Total Assets</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border-0">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{(maintenance as MaintenanceTask[])?.length || 0}</p>
                    <p className="text-sm text-muted-foreground">Maintenance Tasks</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border-0">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">4</p>
                    <p className="text-sm text-muted-foreground">Report Categories</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Reports Tabs */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-0 p-8 animate-fade-in" style={{animationDelay: '400ms'}}>
            <ReportsTabs 
              assetData={assets || []} 
              maintenanceData={(maintenance as MaintenanceTask[]) || []} 
              settings={settings}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
