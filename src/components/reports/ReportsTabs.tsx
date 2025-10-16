
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Asset } from '@/types/asset';
import AssetInventoryReportCard from './AssetInventoryReportCard';
import MaintenanceHistoryReportCard from './MaintenanceHistoryReportCard';
import ProjectResourceReportCard from './ProjectResourceReportCard';
import { BarChart3, Wrench, FolderOpen, TrendingUp } from 'lucide-react';

export interface ReportsTabsProps {
  assetData: Asset[];
  maintenanceData: any[];
  settings?: any;
}

const ReportsTabs: React.FC<ReportsTabsProps> = ({ 
  assetData, 
  maintenanceData, 
  settings 
}) => {
  const [activeTab, setActiveTab] = useState('inventory');

  return (
    <div className="w-full space-y-6">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-lg">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Reports Dashboard</h1>
            <p className="text-indigo-100">Comprehensive analytics and reporting suite</p>
          </div>
        </div>
        <div className="flex gap-4 flex-wrap">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            <TrendingUp className="h-3 w-3 mr-1" />
            {assetData?.length || 0} Assets
          </Badge>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            <Wrench className="h-3 w-3 mr-1" />
            {maintenanceData?.length || 0} Maintenance Records
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 p-1 rounded-lg">
          <TabsTrigger 
            value="inventory"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-200 rounded-md"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Asset Inventory
          </TabsTrigger>
          <TabsTrigger 
            value="maintenance"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-500 data-[state=active]:text-white transition-all duration-200 rounded-md"
          >
            <Wrench className="h-4 w-4 mr-2" />
            Maintenance History
          </TabsTrigger>
          <TabsTrigger 
            value="projects"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white transition-all duration-200 rounded-md"
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            Project Resources
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory" className="space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-1">
            <div className="bg-white dark:bg-gray-950 rounded-lg">
              <AssetInventoryReportCard assets={assetData} maintenanceData={maintenanceData} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="maintenance" className="space-y-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-1">
            <div className="bg-white dark:bg-gray-950 rounded-lg">
              <MaintenanceHistoryReportCard maintenanceData={maintenanceData} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="projects" className="space-y-6">
          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg p-1">
            <div className="bg-white dark:bg-gray-950 rounded-lg">
              <ProjectResourceReportCard />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsTabs;
