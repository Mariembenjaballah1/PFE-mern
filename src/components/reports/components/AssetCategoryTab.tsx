
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import AssetUsageChart from '../AssetUsageChart';
import { Asset } from '@/types/asset';

interface AssetCategoryTabProps {
  reportData: any;
}

const AssetCategoryTab: React.FC<AssetCategoryTabProps> = ({ reportData }) => {
  // Convert category data to mock assets for the chart
  const createCategoryAssets = (): Asset[] => {
    if (!reportData?.categories) return [];
    
    const assets: Asset[] = [];
    Object.entries(reportData.categories).forEach(([category, count]: [string, any]) => {
      const assetCount = typeof count === 'number' ? count : count?.count || 0;
      for (let i = 0; i < assetCount; i++) {
        assets.push({
          id: `cat-${category}-${i}`,
          name: `${category} Asset ${i + 1}`,
          category: category,
          status: 'operational',
          assignedTo: 'System',
          location: 'Unknown',
          purchaseDate: new Date().toISOString().split('T')[0],
          lastUpdate: new Date().toISOString().split('T')[0]
        });
      }
    });
    return assets;
  };

  const categoryAssets = createCategoryAssets();

  return (
    <TabsContent value="category" className="space-y-6">
      <div className="bg-white rounded-lg p-6 border shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Asset Distribution by Category</h3>
        {categoryAssets.length > 0 ? (
          <AssetUsageChart assets={categoryAssets} />
        ) : (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading category data...</p>
          </div>
        )}
      </div>
      
      {reportData?.categories && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(reportData.categories).map(([category, data]: [string, any]) => (
            <div key={category} className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900">{category}</h4>
              <p className="text-2xl font-bold text-blue-800">{data?.count || 0}</p>
              <p className="text-sm text-blue-600">Assets</p>
            </div>
          ))}
        </div>
      )}
    </TabsContent>
  );
};

export default AssetCategoryTab;
