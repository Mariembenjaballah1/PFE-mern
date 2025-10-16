
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/DashboardLayout';
import AssetsContent from '@/components/assets/AssetsContent';
import AssetsHeader from '@/components/assets/AssetsHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, Package, Server, TrendingUp, Activity, ArrowRight, Plus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { fetchAssets } from '@/services/assetApi';
import { Link } from 'react-router-dom';
import { Asset } from '@/types/asset';

const AssetsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'all' | 'assigned'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterProject, setFilterProject] = useState('');

  const { data: assets, isLoading, error, refetch } = useQuery({
    queryKey: ['assets'],
    queryFn: fetchAssets
  });

  // Calculate unique values for filters
  const categories = [...new Set(assets?.map(asset => asset.category).filter(Boolean) || [])];
  const statuses = [...new Set(assets?.map(asset => asset.status).filter(Boolean) || [])];
  
  // Fix the projects array to ensure it only contains strings
  const projects = [...new Set(
    assets?.map(asset => {
      const project = asset.projectName || asset.project;
      // Always return a string, never an object
      if (typeof project === 'string') return project;
      if (project && typeof project === 'object' && 'name' in project) {
        return (project as { name: string }).name;
      }
      return null;
    }).filter((project): project is string => project !== null && project !== undefined) || []
  )];

  // Filter assets based on current filters
  const filteredAssets = (assets || []).filter(asset => {
    const matchesSearch = !searchQuery || 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !filterCategory || asset.category === filterCategory;
    const matchesStatus = !filterStatus || asset.status === filterStatus;
    
    const assetProject = asset.projectName || asset.project;
    const assetProjectStr = typeof assetProject === 'string' 
      ? assetProject 
      : (assetProject && typeof assetProject === 'object' && 'name' in assetProject)
        ? (assetProject as { name: string }).name
        : '';
    const matchesProject = !filterProject || assetProjectStr === filterProject;

    return matchesSearch && matchesCategory && matchesStatus && matchesProject;
  });

  // For assigned view, filter by current user assignment
  const currentUser = { name: 'Admin', role: 'admin' };
  const displayedAssets = viewMode === 'assigned' 
    ? filteredAssets.filter(asset => asset.assignedTo === currentUser.name)
    : filteredAssets;

  const handleEdit = (asset: Asset) => {
    console.log('Edit asset:', asset);
  };

  const handleDelete = (assetId: string) => {
    console.log('Delete asset:', assetId);
  };

  const handleRefresh = () => {
    refetch();
  };

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
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Package className="h-6 w-6" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold mb-2">Asset Management</h1>
                      <p className="text-blue-100 text-lg">Loading your asset inventory...</p>
                    </div>
                  </div>
                  <Button 
                    size="lg" 
                    variant="secondary"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    disabled
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Asset
                  </Button>
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
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="flex items-center justify-center p-16">
                <div className="text-center space-y-4">
                  <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Loading Assets</h3>
                    <p className="text-muted-foreground">Gathering your asset inventory...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
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
                    <h1 className="text-3xl font-bold mb-2">Asset Management Error</h1>
                    <p className="text-red-100 text-lg">Unable to load asset data</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Alert */}
            <Alert variant="destructive" className="max-w-2xl mx-auto shadow-lg border-l-4 border-l-red-500">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription className="text-base">
                There was an error loading the assets data. Please try refreshing the page or contact support if the issue persists.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const totalAssets = assets?.length || 0;
  const operationalAssets = assets?.filter(asset => asset.status === 'operational').length || 0;
  const servers = assets?.filter(asset => asset.category?.toLowerCase().includes('server')).length || 0;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="container mx-auto px-6 py-8 space-y-8">
          {/* Enhanced Header Section with Add Asset Button */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold mb-2">Asset Management</h1>
                    <p className="text-blue-100 text-lg">Comprehensive asset tracking and management</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <AssetsHeader onSuccess={handleRefresh} />
                  </div>
                  <Link to="/reports">
                    <Button 
                      size="lg" 
                      variant="secondary"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    >
                      <TrendingUp className="h-5 w-5 mr-2" />
                      View Reports
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="flex gap-4 flex-wrap">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-3 py-1">
                  <Package className="h-4 w-4 mr-2" />
                  {totalAssets} Total Assets
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-3 py-1">
                  <Activity className="h-4 w-4 mr-2" />
                  {operationalAssets} Operational
                </Badge>
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-3 py-1">
                  <Server className="h-4 w-4 mr-2" />
                  {servers} Servers
                </Badge>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded-lg">
                    <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Total Assets</p>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{totalAssets}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 dark:bg-green-800 rounded-lg">
                    <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-green-600 dark:text-green-400">Operational Assets</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-300">{operationalAssets}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 dark:bg-purple-800 rounded-lg">
                    <Server className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-600 dark:text-purple-400">Server Assets</p>
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{servers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Assets Content */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-0 p-8 animate-fade-in" style={{animationDelay: '200ms'}}>
            <AssetsContent 
              viewMode={viewMode}
              setViewMode={setViewMode}
              showAssignedTab={true}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterProject={filterProject}
              setFilterProject={setFilterProject}
              categories={categories}
              statuses={statuses}
              projects={projects}
              displayedAssets={displayedAssets}
              isLoading={isLoading}
              onRefresh={handleRefresh}
              onEdit={handleEdit}
              onDelete={handleDelete}
              currentUser={currentUser}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AssetsPage;

