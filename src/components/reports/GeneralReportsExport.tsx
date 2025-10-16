
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { exportToCSV } from '@/services/reportsService';
import ExcelReportButton from './ExcelReportButton';

interface GeneralReportsExportProps {
  assetData: any[];
  maintenanceData: any[];
}

const GeneralReportsExport: React.FC<GeneralReportsExportProps> = ({ 
  assetData, 
  maintenanceData 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReport = async (format: 'csv' | 'excel' | 'pdf' = 'pdf') => {
    setIsLoading(true);
    
    const loadingToast = toast({
      title: "Generating Report",
      description: `Preparing ${format.toUpperCase()} general report with chart...`,
      variant: "info"
    });

    try {
      // Create summary data
      const totalAssets = assetData?.length || 0;
      const operationalAssets = assetData?.filter(a => a.status === 'operational').length || 0;
      const maintenanceAssets = assetData?.filter(a => a.status === 'maintenance').length || 0;
      const totalMaintenance = maintenanceData?.length || 0;
      const completedMaintenance = maintenanceData?.filter(m => m.status === 'completed').length || 0;
      
      const exportData = [
        {
          'Metric': 'Total Assets',
          'Value': totalAssets,
          'Percentage': '100%'
        },
        {
          'Metric': 'Operational Assets',
          'Value': operationalAssets,
          'Percentage': totalAssets > 0 ? `${Math.round((operationalAssets / totalAssets) * 100)}%` : '0%'
        },
        {
          'Metric': 'Assets Under Maintenance',
          'Value': maintenanceAssets,
          'Percentage': totalAssets > 0 ? `${Math.round((maintenanceAssets / totalAssets) * 100)}%` : '0%'
        },
        {
          'Metric': 'Total Maintenance Tasks',
          'Value': totalMaintenance,
          'Percentage': '100%'
        },
        {
          'Metric': 'Completed Maintenance',
          'Value': completedMaintenance,
          'Percentage': totalMaintenance > 0 ? `${Math.round((completedMaintenance / totalMaintenance) * 100)}%` : '0%'
        }
      ];
      
      // Pass the chart ID to ensure chart is captured
      await exportToCSV(exportData, 'general_system_report', format, 'general-report-chart');
      
      loadingToast.dismiss();
      
      toast({
        title: "Report Generated Successfully! 📊",
        description: `General system report (${format.toUpperCase()}) with chart downloaded successfully.`,
        variant: "success",
        duration: 6000
      });
    } catch (error) {
      console.error(error);
      
      loadingToast.dismiss();
      
      toast({
        title: "Export Failed ❌",
        description: `Failed to generate ${format.toUpperCase()} report. Please try again.`,
        variant: "destructive",
        duration: 8000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div id="general-report-chart" className="w-full min-h-[400px] bg-white p-6 border rounded-lg" style={{ display: 'block', visibility: 'visible' }}>
        <div className="text-center space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">General System Report</h3>
            <p className="text-sm text-gray-600 mt-2">Generated on: {new Date().toLocaleDateString()}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 p-6 rounded-xl">
              <p className="font-semibold text-blue-800 text-sm">Total Assets</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{assetData?.length || 0}</p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl">
              <p className="font-semibold text-green-800 text-sm">Operational</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {assetData?.filter(a => a.status === 'operational').length || 0}
              </p>
            </div>
            <div className="bg-orange-50 p-6 rounded-xl">
              <p className="font-semibold text-orange-800 text-sm">Under Maintenance</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">
                {assetData?.filter(a => a.status === 'maintenance').length || 0}
              </p>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl">
              <p className="font-semibold text-purple-800 text-sm">Maintenance Tasks</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{maintenanceData?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <ExcelReportButton
          onGenerateReport={handleGenerateReport}
          disabled={isLoading}
          loading={isLoading}
          chartId="general-report-chart"
        />
      </div>
    </>
  );
};

export default GeneralReportsExport;
