
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Package, Activity } from 'lucide-react';
import { Asset } from '@/types/asset';
import AssetUsageChart from './AssetUsageChart';

interface AssetUsageReportCardProps {
  assets: Asset[];
}

const AssetUsageReportCard: React.FC<AssetUsageReportCardProps> = ({ assets }) => {
  // Calculate report data
  const totalAssets = assets.length;
  
  // Group by categories
  const categories = assets.reduce((acc, asset) => {
    const category = asset.category || 'Unknown';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Group by projects
  const projects = assets.reduce((acc, asset) => {
    const project = asset.projectName || asset.project;
    const projectKey = typeof project === 'string' ? project : String(project);
    acc[projectKey] = (acc[projectKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Status distribution
  const statusDistribution = assets.reduce((acc, asset) => {
    const status = asset.status || 'operational';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl text-gray-900">Asset Usage Report</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Comprehensive asset utilization analysis</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {totalAssets} Assets
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Total Assets */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-600">Total Assets</p>
                <p className="text-2xl font-bold text-blue-700">{totalAssets}</p>
              </div>
            </div>
          </div>
          
          {/* Active Assets */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded">
                <Activity className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-600">Operational</p>
                <p className="text-2xl font-bold text-green-700">
                  {statusDistribution.operational || 0}
                </p>
              </div>
            </div>
          </div>
          
          {/* Utilization Rate */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded">
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-purple-600">Utilization</p>
                <p className="text-2xl font-bold text-purple-700">
                  {totalAssets > 0 ? Math.round(((statusDistribution.operational || 0) / totalAssets) * 100) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chart */}
        <AssetUsageChart assets={assets} />
      </CardContent>
    </Card>
  );
};

export default AssetUsageReportCard;
