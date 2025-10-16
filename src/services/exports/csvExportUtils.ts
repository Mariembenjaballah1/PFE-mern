
import { formatFilename } from './fileDownloadUtils';

export const exportToCSVFile = async (data: any[], filename: string, chartIds?: string | string[]) => {
  // Convert single chartId to array for consistency (for future reference)
  const chartIdArray = chartIds ? (Array.isArray(chartIds) ? chartIds : [chartIds]) : [];
  
  if (!data || data.length === 0) {
    console.warn('No data provided for CSV export');
    return;
  }
  
  // Get headers from the first row
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  let csvContent = headers.join(',') + '\n';
  
  // Add data rows
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      // Handle values that might contain commas or quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value || '';
    });
    csvContent += values.join(',') + '\n';
  });
  
  // Add chart information as a comment if chart IDs are provided
  if (chartIdArray.length > 0) {
    csvContent += '\n# Chart Information:\n';
    chartIdArray.forEach(chartId => {
      csvContent += `# Chart: ${chartId}\n`;
    });
  }
  
  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', formatFilename(filename, 'csv'));
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
