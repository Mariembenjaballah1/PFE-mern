
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Activity, Wrench, BarChart3 } from 'lucide-react';
import AssetInventoryExport from './AssetInventoryExport';
import MaintenanceHistoryExport from './MaintenanceHistoryExport';
import GeneralReportsExport from './GeneralReportsExport';

interface GeneralReportsTabProps {
  assetData: any[];
  maintenanceData: any[];
}

const GeneralReportsTab: React.FC<GeneralReportsTabProps> = ({ assetData, maintenanceData }) => {
  const totalAssets = assetData?.length || 0;
  const operationalAssets = assetData?.filter(asset => asset.status === 'operational')?.length || 0;
  const maintenanceAssets = assetData?.filter(asset => asset.status === 'maintenance')?.length || 0;
  const totalMaintenance = maintenanceData?.length || 0;
  const completedMaintenance = maintenanceData?.filter(task => task.status === 'completed')?.length || 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssets}</div>
            <Badge variant="secondary" className="mt-1">All Categories</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operational</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{operationalAssets}</div>
            <Badge variant="secondary" className="mt-1 bg-green-100 text-green-800">
              {totalAssets > 0 ? Math.round((operationalAssets / totalAssets) * 100) : 0}%
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{maintenanceAssets}</div>
            <Badge variant="secondary" className="mt-1 bg-orange-100 text-orange-800">
              {totalAssets > 0 ? Math.round((maintenanceAssets / totalAssets) * 100) : 0}%
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance Tasks</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalMaintenance}</div>
            <Badge variant="secondary" className="mt-1 bg-blue-100 text-blue-800">
              {completedMaintenance} Completed
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Export Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Asset Inventory Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Asset Inventory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Complete list of all assets with their current status, location, and assignment details.
            </p>
            <AssetInventoryExport assets={assetData} />
          </CardContent>
        </Card>

        {/* Maintenance History Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Maintenance History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Detailed history of all maintenance tasks including status, assignments, and timelines.
            </p>
            <MaintenanceHistoryExport maintenanceData={maintenanceData} />
          </CardContent>
        </Card>

        {/* General System Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              System Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              High-level system metrics and statistics including asset utilization and maintenance efficiency.
            </p>
            <GeneralReportsExport assetData={assetData} maintenanceData={maintenanceData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GeneralReportsTab;
