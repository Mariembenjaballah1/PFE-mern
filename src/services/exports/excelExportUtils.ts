
import * as XLSX from 'xlsx';
import { formatFilename } from './fileDownloadUtils';

export const exportToExcel = async (data: any[], filename: string, chartIds?: string | string[]) => {
  // Convert single chartId to array for consistency (for future chart integration)
  const chartIdArray = chartIds ? (Array.isArray(chartIds) ? chartIds : [chartIds]) : [];
  
  // Create a new workbook
  const workbook = XLSX.utils.book_new();
  
  // Add the main data sheet
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report Data');
  
  // Add a summary sheet with chart information if chart IDs are provided
  if (chartIdArray.length > 0) {
    const chartInfo = chartIdArray.map(chartId => ({
      'Chart ID': chartId,
      'Chart Type': getChartTypeFromId(chartId),
      'Status': 'Chart data exported separately'
    }));
    
    const chartSheet = XLSX.utils.json_to_sheet(chartInfo);
    XLSX.utils.book_append_sheet(workbook, chartSheet, 'Chart Information');
  }
  
  // Save the Excel file
  const excelFilename = formatFilename(filename, 'xlsx');
  XLSX.writeFile(workbook, excelFilename);
};

const getChartTypeFromId = (chartId: string): string => {
  if (chartId.includes('category')) return 'Assets by Category';
  if (chartId.includes('status')) return 'Assets by Status';
  if (chartId.includes('project')) return 'Assets by Project';
  if (chartId.includes('inventory')) return 'Asset Inventory Summary';
  return 'Chart';
};
