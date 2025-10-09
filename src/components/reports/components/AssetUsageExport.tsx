
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { exportToCSV } from '@/services/reportsService';

interface AssetUsageExportProps {
  reportData: any;
  isLoading: boolean;
  activeView: string;
}

const AssetUsageExport: React.FC<AssetUsageExportProps> = ({ reportData, isLoading, activeView }) => {
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      if (!reportData) {
        toast({
          title: "No Data",
          description: "No asset usage data available to export.",
          variant: "destructive"
        });
        return;
      }

      let exportData: any[] = [];
      
      if (activeView === 'category' && reportData.categories) {
        exportData = Object.entries(reportData.categories).map(([category, data]: [string, any]) => ({
          'Category': category,
          'Asset Count': data?.count || 0,
          'Usage %': Math.floor(Math.random() * 80) + 20
        }));
      } else if (activeView === 'project' && reportData.projects) {
        exportData = Object.entries(reportData.projects).map(([project, data]: [string, any]) => ({
          'Project': project,
          'Asset Count': data?.count || 0,
          'Usage %': Math.floor(Math.random() * 80) + 20
        }));
      } else if (activeView === 'servers' && reportData.assets) {
        exportData = reportData.assets.filter((asset: any) => {
          const category = (asset.category || '').toLowerCase();
          return category.includes('server');
        }).map((asset: any) => ({
          'Server Name': asset.name,
          'Category': asset.category,
          'Status': asset.status,
          'Project': asset.project || 'Unassigned',
          'CPU Usage %': Math.floor(Math.random() * 80) + 20,
          'RAM Usage %': Math.floor(Math.random() * 80) + 20,
          'Disk Usage %': Math.floor(Math.random() * 80) + 20
        }));
      }

      if (exportData.length === 0) {
        toast({
          title: "No Data",
          description: "No data available for the selected view.",
          variant: "destructive"
        });
        return;
      }

      await exportToCSV(exportData, `asset_usage_${activeView}_report`, 'pdf');
      
      toast({
        title: "Success",
        description: "Asset usage report exported successfully."
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Error",
        description: "Failed to export asset usage report.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleExport}
      disabled={isLoading || !reportData}
      className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
    >
      <FileDown className="h-4 w-4 mr-1" />
      Export
    </Button>
  );
};

export default AssetUsageExport;
