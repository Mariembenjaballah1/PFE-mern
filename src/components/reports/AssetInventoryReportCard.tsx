
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import AssetInventoryExport from './AssetInventoryExport';
import AssetDistributionCharts from './AssetDistributionCharts';
import { Asset } from '@/types/asset';
import { calculateAssetsByCategory, calculateAssetsByStatus, calculateAssetsByProject } from './utils/assetCalculations';

interface AssetInventoryReportCardProps {
  assets: Asset[];
  maintenanceData?: any[]; // Add maintenance data prop
}

const AssetInventoryReportCard: React.FC<AssetInventoryReportCardProps> = ({ assets, maintenanceData = [] }) => {
  const totalAssets = assets.length;
  const assetsByCategory = calculateAssetsByCategory(assets);
  const assetsByStatus = calculateAssetsByStatus(assets);
  const assetsByProject = calculateAssetsByProject(assets);

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Asset Inventory Report</CardTitle>
        <FileText className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-6">
        <CardDescription>
          Comprehensive inventory of all assets with detailed charts and export capabilities
        </CardDescription>

        {/* Asset Inventory Export with Charts */}
        <AssetInventoryExport assets={assets} maintenanceData={maintenanceData} />

        {/* Distribution Charts */}
        <AssetDistributionCharts
          assetsByCategory={assetsByCategory}
          assetsByStatus={assetsByStatus}
          assetsByProject={assetsByProject}
          totalAssets={totalAssets}
        />
      </CardContent>
    </Card>
  );
};

export default AssetInventoryReportCard;
