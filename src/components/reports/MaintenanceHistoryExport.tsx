
import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { generateMaintenanceHistoryReport, exportToCSV } from '@/services/reportsService';
import ExcelReportButton from './ExcelReportButton';

interface MaintenanceHistoryExportProps {
  maintenanceData: any[];
}

const MaintenanceHistoryExport: React.FC<MaintenanceHistoryExportProps> = ({ maintenanceData }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReport = async (format: 'csv' | 'excel' | 'pdf' = 'pdf') => {
    setIsLoading(true);
    
    const loadingToast = toast({
      title: "Generating Report",
      description: `Preparing ${format.toUpperCase()} maintenance history report with chart...`,
      variant: "info"
    });

    try {
      const reportData = await generateMaintenanceHistoryReport();
      
      const exportData = maintenanceData.map(task => ({
        'Asset Name': task.asset?.name || 'Unknown',
        'Task Type': task.type || 'Unknown',
        'Status': task.status || 'Unknown',
        'Priority': task.priority || 'Medium',
        'Assigned To': task.assignedTo?.name || 'Unassigned',
        'Scheduled Date': task.scheduledDate ? new Date(task.scheduledDate).toLocaleDateString() : 'Not set',
        'Estimated Hours': task.estimatedHours || 0,
        'Description': task.description || 'No description'
      }));
      
      // Pass the chart ID to ensure chart is captured
      await exportToCSV(exportData, 'maintenance_history_report', format, 'maintenance-history-chart');
      
      loadingToast.dismiss();
      
      toast({
        title: "Report Generated Successfully! 📊",
        description: `Maintenance history report (${format.toUpperCase()}) with chart downloaded with ${maintenanceData.length} tasks.`,
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
      <div id="maintenance-history-chart" className="w-full min-h-[300px] bg-white p-4 border rounded-lg" style={{ display: 'block', visibility: 'visible' }}>
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Maintenance History Overview</h3>
          <p className="text-sm text-gray-600">Generated on: {new Date().toLocaleDateString()}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-800">Total Tasks</p>
              <p className="text-2xl font-bold text-blue-600">{maintenanceData?.length || 0}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-green-800">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {maintenanceData?.filter(t => t.status === 'completed').length || 0}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-orange-800">Pending</p>
              <p className="text-2xl font-bold text-orange-600">
                {maintenanceData?.filter(t => t.status === 'scheduled' || t.status === 'in-progress').length || 0}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-purple-800">High Priority</p>
              <p className="text-2xl font-bold text-purple-600">
                {maintenanceData?.filter(t => t.priority === 'high').length || 0}
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
          chartId="maintenance-history-chart"
        />
      </div>
    </>
  );
};

export default MaintenanceHistoryExport;
