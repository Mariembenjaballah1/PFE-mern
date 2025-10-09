
import { exportToCSVFile } from './csvExportUtils';
import { exportToExcel } from './excelExportUtils';
import { exportToPDF } from './pdfExportUtils';

export const exportToCSV = async (data: any[], filename: string, format: 'csv' | 'excel' | 'pdf' = 'pdf', chartIds?: string | string[]) => {
  // Convert single chartId to array for consistency
  const chartIdArray = chartIds ? (Array.isArray(chartIds) ? chartIds : [chartIds]) : undefined;
  
  if (format === 'pdf') {
    return exportToPDF(data, filename, chartIdArray);
  } else if (format === 'excel') {
    return exportToExcel(data, filename, chartIdArray);
  } else {
    return exportToCSVFile(data, filename, chartIdArray);
  }
};
