
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileChartLine, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { generateMaintenanceHistoryReport, exportToCSV } from '@/services/reportsService';
import ExcelReportButton from './ExcelReportButton';

interface MaintenanceHistoryReportCardProps {
  maintenanceData?: any[];
}

const MaintenanceHistoryReportCard: React.FC<MaintenanceHistoryReportCardProps> = ({ maintenanceData = [] }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReport = async (format: 'csv' | 'excel' | 'pdf' = 'pdf') => {
    setIsLoading(true);
    try {
      const reportData = await generateMaintenanceHistoryReport();
      
      // Create exportable data from maintenance tasks with proper object handling
      const exportData = reportData.tasks.map((task: any) => ({
        assetName: task.asset?.name || 'Unknown Asset',
        type: task.type,
        status: task.status,
        priority: task.priority,
        scheduledDate: task.scheduledDate,
        assignedTo: task.assignedTo?.name || 'Unassigned',
        estimatedHours: task.estimatedHours
      }));
      
      // Export as specified format, default to PDF
      exportToCSV(exportData, 'maintenance_history_report', format, 'maintenance-history-chart');
      
      toast({
        title: "Report Generated",
        description: `Maintenance history report has been downloaded with ${reportData.totalTasks} tasks.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate maintenance history report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">Maintenance History</CardTitle>
        <FileChartLine className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4">Detailed maintenance logs and history</CardDescription>
        
        {/* Display maintenance data summary */}
        {maintenanceData && maintenanceData.length > 0 && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Recent Maintenance Tasks</h4>
            <div className="space-y-2">
              {maintenanceData.slice(0, 3).map((task: any, index: number) => (
                <div key={task._id || index} className="text-sm">
                  <span className="font-medium">
                    {task.asset?.name || 'Unknown Asset'}
                  </span>
                  {' - '}
                  <span className="text-muted-foreground">
                    {task.type} ({task.status})
                  </span>
                  {task.assignedTo?.name && (
                    <span className="text-muted-foreground">
                      {' - Assigned to: '}{task.assignedTo.name}
                    </span>
                  )}
                </div>
              ))}
              {maintenanceData.length > 3 && (
                <div className="text-sm text-muted-foreground">
                  +{maintenanceData.length - 3} more tasks...
                </div>
              )}
            </div>
          </div>
        )}
        
        <div id="maintenance-history-chart" className="hidden">
          {/* This hidden div will be used to capture chart data for PDF export */}
          <div className="text-center p-4 border rounded">
            <h3>Maintenance History Report</h3>
            <p>Generated on: {new Date().toLocaleDateString()}</p>
            <p>Total Tasks: {maintenanceData?.length || 0}</p>
          </div>
        </div>
        <ExcelReportButton
          onGenerateReport={handleGenerateReport}
          disabled={isLoading}
          loading={isLoading}
          chartId="maintenance-history-chart"
        />
      </CardContent>
    </Card>
  );
};

export default MaintenanceHistoryReportCard;
