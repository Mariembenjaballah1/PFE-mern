
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { fetchAssets } from '@/services/assetApi';
import { Loader2, RefreshCw, Server, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchServerResourceData, 
  resetServerUsageStats
} from '@/services/assets/assetResourceOperations';

// Import the enhanced components
import ServerSelector from './server-usage/ServerSelector';
import ServerInfo from './server-usage/ServerInfo';
import ResourceMetrics from './server-usage/ResourceMetrics';
import ServerControls from './server-usage/ServerControls';
import LoadingStates from './server-usage/LoadingStates';

interface ServerResourceData {
  cpu: number;
  ram: number;
  disk: number;
  network: number;
  connections: number;
  uptime: string;
}

const ServerResourceUsageCard: React.FC = () => {
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const { toast } = useToast();
  
  // Fetch all assets and filter for servers on the frontend
  const { 
    data: allAssets = [], 
    isLoading: isLoadingAssets, 
    error: assetsError,
    refetch: refetchAssets
  } = useQuery({
    queryKey: ['assets', 'all'],
    queryFn: fetchAssets,
  });
  
  // Enhanced server filtering - same logic as AssetServersTab
  const serversData = allAssets.filter(asset => {
    if (!asset) return false;
    
    const category = (asset.category || '').toLowerCase().trim();
    const name = (asset.name || '').toLowerCase().trim();
    
    // Check category for server-related terms
    const isServerCategory = category.includes('server') || 
                           category === 'servers' || 
                           category === 'server' ||
                           category.includes('compute');
    
    // Check name for server indicators (as backup)
    const isServerName = name.includes('server') || name.includes('srv');
    
    return isServerCategory || isServerName;
  });
  
  console.log('=== ServerResourceUsageCard Enhanced Debug ===');
  console.log('All assets count:', allAssets.length);
  console.log('Sample assets:', allAssets.slice(0, 3).map(asset => ({ 
    id: asset.id, 
    name: asset.name, 
    category: asset.category
  })));
  console.log('All unique categories:', [...new Set(allAssets.map(asset => asset.category))]);
  console.log('Server assets found:', serversData.length);
  console.log('Server assets details:', serversData.map(s => ({ 
    id: s.id, 
    name: s.name, 
    category: s.category
  })));
  
  // Fetch resource usage data for the selected server with more frequent updates
  const { 
    data: resourceData, 
    isLoading: isLoadingResources, 
    error: resourcesError,
    refetch: refetchResources 
  } = useQuery({
    queryKey: ['serverResources', selectedServerId],
    queryFn: async () => {
      if (!selectedServerId) return null;
      return fetchServerResourceData(selectedServerId);
    },
    enabled: !!selectedServerId,
    staleTime: 10000,
    refetchInterval: 20000,
    refetchOnWindowFocus: true,
    retry: 1,
    meta: {
      onError: (error: any) => {
        console.error('Error in resources query:', error);
        toast({
          title: "Resource Data Error",
          description: `Unable to fetch resource data for server. Using simulated data.`,
          variant: "destructive"
        });
      }
    }
  });
  
  // For debugging
  useEffect(() => {
    console.log('Servers from DB:', serversData);
    console.log('Selected server resources:', resourceData);
  }, [serversData, resourceData]);
  
  // Select first server by default when data loads
  useEffect(() => {
    if (serversData.length > 0 && !selectedServerId) {
      setSelectedServerId(serversData[0].id);
      console.log('Auto-selecting first server:', serversData[0].name);
      toast({
        title: "Server Selected",
        description: `Now showing resource data for ${serversData[0].name}`,
      });
    }
  }, [serversData, selectedServerId, toast]);
  
  // Find the currently selected server
  const selectedServer = serversData.find(server => server.id === selectedServerId);
  
  // Handle server selection change
  const handleServerChange = (value: string) => {
    setSelectedServerId(value);
    const selectedServerName = serversData.find(s => s.id === value)?.name || value;
    console.log('Server selection changed to:', selectedServerName);
    toast({
      title: "Server Selected",
      description: `Now showing resource data for ${selectedServerName}`,
    });
  };
  
  // Handle resetting server stats
  const handleResetStats = async () => {
    if (!selectedServerId) return;
    
    setIsResetting(true);
    try {
      await resetServerUsageStats(selectedServerId);
      await refetchResources();
      toast({
        title: "Stats Reset",
        description: "Server resource statistics have been reset.",
      });
    } catch (error: any) {
      toast({
        title: "Reset Failed",
        description: error.message || "Failed to reset server statistics",
        variant: "destructive"
      });
    } finally {
      setIsResetting(false);
    }
  };
  
  // Refresh all data
  const handleRefreshData = () => {
    refetchAssets();
    if (selectedServerId) {
      refetchResources();
      toast({
        title: "Data Refreshed",
        description: "Server resource data has been updated.",
      });
    }
  };
  
  // Render loading state
  if (isLoadingAssets) {
    return <LoadingStates type="loading" onRefresh={handleRefreshData} />;
  }
  
  // Render error state if server list could not be fetched
  if (assetsError) {
    return <LoadingStates type="error" onRefresh={handleRefreshData} />;
  }
  
  // Render empty state if no servers available
  if (serversData.length === 0) {
    return (
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
          <CardTitle className="text-xl font-bold flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Server className="h-6 w-6 text-blue-600" />
            </div>
            <span>Server Resource Monitor</span>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleRefreshData}
              title="Refresh Data"
              className="ml-auto"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Server className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Server Assets Found</h3>
            <p className="text-muted-foreground mb-4">Add server assets to your inventory to monitor their resource usage</p>
            <div className="text-sm text-muted-foreground space-y-1 mb-6">
              <p>Total assets: <span className="font-medium">{allAssets.length}</span></p>
              <p>Categories: <span className="font-medium">{[...new Set(allAssets.map(asset => asset.category))].join(', ') || 'None'}</span></p>
              <p className="text-xs italic">Looking for assets with category containing 'server'</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleRefreshData}
              className="bg-blue-50 hover:bg-blue-100 border-blue-200"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <span>Server Resource Monitor</span>
              <p className="text-sm font-normal text-muted-foreground">Real-time performance metrics</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefreshData}
            title="Refresh Data"
            className="hover:bg-white"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <ServerSelector
            servers={serversData}
            selectedServerId={selectedServerId}
            onServerChange={handleServerChange}
            isLoading={isLoadingAssets}
          />
          {selectedServer && (
            <div className="flex-1">
              <ServerInfo server={selectedServer} />
            </div>
          )}
        </div>
        
        {isLoadingResources && selectedServerId ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <div>
                <h3 className="font-medium text-gray-900">Loading Resource Data</h3>
                <p className="text-sm text-muted-foreground">Fetching live performance metrics...</p>
              </div>
            </div>
          </div>
        ) : resourcesError ? (
          <LoadingStates type="error" errorMessage="Failed to load resource data. Using simulated dynamic data." onRefresh={handleRefreshData} />
        ) : selectedServer ? (
          <ResourceMetrics resourceData={resourceData} selectedServer={selectedServer} />
        ) : (
          <div className="text-center py-16">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Server className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-muted-foreground">Select a server to view resource usage metrics</p>
          </div>
        )}
        
        {selectedServer && resourceData && (
          <ServerControls
            resourceData={resourceData}
            onResetStats={handleResetStats}
            isResetting={isResetting}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ServerResourceUsageCard;
