
import React, { useState } from 'react';
import { FileDown } from 'lucide-react';
import { Project, Asset } from '@/types/asset';
import { useToast } from '@/hooks/use-toast';
import { exportToCSV } from '@/services/reportsService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ProjectAssetsSummaryProps {
  project: Project;
  assets: Asset[];
  isLoading: boolean;
}

export const ProjectAssetsSummary: React.FC<ProjectAssetsSummaryProps> = ({
  project,
  assets,
  isLoading
}) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExportAssets = async (format: 'csv' | 'excel' | 'pdf') => {
    setIsExporting(true);
    try {
      const exportData = assets.map((asset) => ({
        'ID': asset.id,
        'Name': asset.name,
        'Category': asset.category,
        'Status': asset.status,
        'Location': asset.location,
        'Assigned To': asset.assignedTo,
        'Purchase Date': asset.purchaseDate,
        'Last Update': asset.lastUpdate,
        'CPU': asset.resources?.cpu || 0,
        'RAM (GB)': asset.resources?.ram || 0,
        'Disk (GB)': asset.resources?.disk || 0
      }));
      
      await exportToCSV(
        exportData, 
        `${project.name}_assets_report`, 
        format,
        format === 'pdf' ? `project-assets-chart-${project.id}` : undefined
      );
      
      toast({
        title: "Success",
        description: `Project assets exported successfully as ${format.toUpperCase()}.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export project assets.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-medium">Project Assets</h3>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="flex items-center gap-1"
            disabled={isLoading || assets.length === 0 || isExporting}
          >
            {isExporting ? (
              <span className="animate-spin mr-1">⏳</span>
            ) : (
              <FileDown className="h-4 w-4" />
            )}
            Export Assets
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800">
          <DropdownMenuItem onClick={() => handleExportAssets('csv')} className="cursor-pointer">
            Export as CSV
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExportAssets('excel')} className="cursor-pointer">
            Export as Excel
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleExportAssets('pdf')} className="cursor-pointer">
            Export as PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
