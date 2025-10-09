
import React, { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { fetchAssets } from '@/services/assetApi';
import AssetUsageChart from '../AssetUsageChart';
import { Server, Cpu, MemoryStick, HardDrive } from 'lucide-react';
import { Asset } from '@/types/asset';

const AssetServersTab: React.FC = () => {
  const [selectedServer, setSelectedServer] = useState<string | null>(null);
  
  const { data: allAssets = [], isLoading } = useQuery({
    queryKey: ['assets', 'servers'],
    queryFn: fetchAssets,
    staleTime: 30000,
    refetchInterval: 60000,
  });

  // Filter for server assets using the same logic as ServerResourceUsageCard
  const serverAssets = allAssets.filter(asset => {
    if (!asset) return false;
    
    const category = (asset.category || '').toLowerCase().trim();
    const name = (asset.name || '').toLowerCase().trim();
    
    const isServerCategory = category.includes('server') || 
                           category === 'servers' || 
                           category === 'server' ||
                           category.includes('compute');
    
    const isServerName = name.includes('server') || name.includes('srv');
    
    return isServerCategory || isServerName;
  });

  // Create mock resource assets for the chart
  const createResourceAssets = (): Asset[] => {
    const resourceTypes = ['CPU Usage', 'Memory Usage', 'Disk Usage', 'Network Usage'];
    const mockAssets: Asset[] = [];
    
    resourceTypes.forEach((resourceType, index) => {
      // Create multiple assets for each resource type to represent usage
      for (let i = 0; i < serverAssets.length; i++) {
        mockAssets.push({
          id: `resource-${resourceType}-${i}`,
          name: `${resourceType} Resource ${i + 1}`,
          category: resourceType,
          status: 'operational',
          assignedTo: 'System',
          location: 'Unknown',
          purchaseDate: new Date().toISOString().split('T')[0],
          lastUpdate: new Date().toISOString().split('T')[0]
        });
      }
    });
    
    return mockAssets;
  };

  return (
    <TabsContent value="servers" className="space-y-6">
      <div className="bg-white rounded-lg p-6 border shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Server className="h-5 w-5" />
          Server Resource Usage
        </h3>
        
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading server data...</p>
          </div>
        ) : serverAssets.length > 0 ? (
          <AssetUsageChart assets={createResourceAssets()} />
        ) : (
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center">
              <Server className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-muted-foreground">No server assets found</p>
              <p className="text-sm text-muted-foreground mt-2">Add server assets to see resource usage</p>
            </div>
          </div>
        )}
      </div>

      {serverAssets.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Server Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {serverAssets.slice(0, 6).map((server, index) => (
              <div key={server.id} className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Server className="h-4 w-4 text-purple-600" />
                  <h5 className="font-semibold text-purple-900">{server.name}</h5>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-1">
                    <Cpu className="h-3 w-3 text-purple-600" />
                    <span className="text-purple-700">CPU: {45 + (index * 7)}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MemoryStick className="h-3 w-3 text-purple-600" />
                    <span className="text-purple-700">RAM: {32 + (index * 8)}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <HardDrive className="h-3 w-3 text-purple-600" />
                    <span className="text-purple-700">Disk: {28 + (index * 6)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </TabsContent>
  );
};

export default AssetServersTab;
