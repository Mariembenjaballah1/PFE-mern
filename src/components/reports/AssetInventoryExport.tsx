
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { generateAssetInventoryReport, exportToCSV } from '@/services/reportsService';
import ExcelReportButton from './ExcelReportButton';
import { Asset } from '@/types/asset';
import { getProjectName } from './utils/assetCalculations';

interface AssetInventoryExportProps {
  assets: Asset[];
  maintenanceData?: any[]; // Add maintenance data prop
}

const AssetInventoryExport: React.FC<AssetInventoryExportProps> = ({ assets, maintenanceData = [] }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReport = async (format: 'csv' | 'excel' | 'pdf' = 'pdf') => {
    setIsLoading(true);
    
    // Show loading toast
    const loadingToast = toast({
      title: "Generating Report",
      description: `Preparing ${format.toUpperCase()} report with ${assets.length} assets and charts...`,
      variant: "info"
    });

    try {
      const reportData = await generateAssetInventoryReport();
      
      // Create exportable data from assets with proper object handling
      const exportData = assets.map(asset => {
        const projectName = getProjectName(asset);
        
        return {
          name: asset.name || 'Unknown',
          category: asset.category || 'Uncategorized',
          status: asset.status || 'unknown',
          location: asset.location || 'Unknown',
          assignedTo: asset.assignedTo || 'Unassigned',
          project: projectName || 'Unassigned',
          purchaseDate: asset.purchaseDate || 'Unknown'
        };
      });
      
      // Try to capture multiple charts - pass array of chart IDs
      const chartIds = ['asset-inventory-chart', 'assets-by-category-chart', 'assets-by-status-chart', 'assets-by-project-chart'];
      await exportToCSV(exportData, 'asset_inventory_report', format, chartIds);
      
      // Dismiss loading toast and show success
      loadingToast.dismiss();
      
      toast({
        title: "Report Generated Successfully! 📊",
        description: `Asset inventory report (${format.toUpperCase()}) with charts downloaded successfully. Check your downloads folder.`,
        variant: "success",
        duration: 6000
      });
    } catch (error) {
      console.error('Export error:', error);
      
      // Dismiss loading toast and show error
      loadingToast.dismiss();
      
      toast({
        title: "Export Failed ❌",
        description: `Failed to generate ${format.toUpperCase()} report. Please check your connection and try again.`,
        variant: "destructive",
        duration: 8000
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate pending maintenance tasks (scheduled + in-progress)
  const pendingMaintenanceCount = maintenanceData.filter(task => 
    task.status === 'scheduled' || task.status === 'in-progress'
  ).length;

  return (
    <>
      <div id="asset-inventory-chart" className="w-full min-h-[300px] bg-white p-4 border rounded-lg" style={{ display: 'block', visibility: 'visible' }}>
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Asset Inventory Summary</h3>
          <p className="text-sm text-gray-600">Generated on: {new Date().toLocaleDateString()}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-800">Total Assets</p>
              <p className="text-2xl font-bold text-blue-600">{assets?.length || 0}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-green-800">Operational</p>
              <p className="text-2xl font-bold text-green-600">
                {assets?.filter(a => a.status === 'operational').length || 0}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-orange-800">Maintenance</p>
              <p className="text-2xl font-bold text-orange-600">
                {pendingMaintenanceCount}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-purple-800">Categories</p>
              <p className="text-2xl font-bold text-purple-600">
                {new Set(assets?.map(a => a.category).filter(c => c && c !== 'Unknown' && c !== 'Uncategorized')).size || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <ExcelReportButton
          onGenerateReport={handleGenerateReport}
          disabled={isLoading}
          loading={isLoading}
          chartId="asset-inventory-chart"
        />
      </div>
    </>
  );
};

export default AssetInventoryExport;
