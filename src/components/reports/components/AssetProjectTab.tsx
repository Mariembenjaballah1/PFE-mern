
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import AssetUsageChart from '../AssetUsageChart';
import { Asset } from '@/types/asset';

interface AssetProjectTabProps {
  reportData: any;
}

const AssetProjectTab: React.FC<AssetProjectTabProps> = ({ reportData }) => {
  // Convert project data to mock assets for the chart
  const createProjectAssets = (): Asset[] => {
    if (!reportData?.projects) return [];
    
    const assets: Asset[] = [];
    Object.entries(reportData.projects).forEach(([project, count]: [string, any]) => {
      const assetCount = typeof count === 'number' ? count : count?.count || 0;
      for (let i = 0; i < assetCount; i++) {
        assets.push({
          id: `proj-${project}-${i}`,
          name: `${project} Asset ${i + 1}`,
          category: 'Unknown',
          status: 'operational',
          projectName: project,
          assignedTo: 'System',
          location: 'Unknown',
          purchaseDate: new Date().toISOString().split('T')[0],
          lastUpdate: new Date().toISOString().split('T')[0]
        });
      }
    });
    return assets;
  };

  const projectAssets = createProjectAssets();

  return (
    <TabsContent value="project" className="space-y-6">
      <div className="bg-white rounded-lg p-6 border shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Asset Distribution by Project</h3>
        {projectAssets.length > 0 ? (
          <AssetUsageChart assets={projectAssets} />
        ) : (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading project data...</p>
          </div>
        )}
      </div>
      
      {reportData?.projects && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(reportData.projects).map(([project, data]: [string, any]) => (
            <div key={project} className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900">{project}</h4>
              <p className="text-2xl font-bold text-green-800">{data?.count || 0}</p>
              <p className="text-sm text-green-600">Assets</p>
            </div>
          ))}
        </div>
      )}
    </TabsContent>
  );
};

export default AssetProjectTab;
