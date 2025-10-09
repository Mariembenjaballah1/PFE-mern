
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, FileDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExcelReportButtonProps {
  onGenerateReport: (format: 'csv' | 'excel' | 'pdf') => void;
  disabled?: boolean;
  loading?: boolean;
  chartId?: string;
}

const ExcelReportButton: React.FC<ExcelReportButtonProps> = ({ 
  onGenerateReport, 
  disabled = false,
  loading = false,
  chartId
}) => {
  // All exports will include charts when available
  const handleGenerateReport = (format: 'csv' | 'excel' | 'pdf') => {
    onGenerateReport(format);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full"
          disabled={disabled || loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileDown className="mr-2 h-4 w-4" />
              Export Report
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem onClick={() => handleGenerateReport('pdf')}>
          Export as PDF with Chart
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleGenerateReport('excel')}>
          Export as Excel with Chart Data
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleGenerateReport('csv')}>
          Export as CSV with Chart Info
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExcelReportButton;
