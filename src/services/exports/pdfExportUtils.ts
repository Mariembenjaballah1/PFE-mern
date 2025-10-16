
import autoTable from 'jspdf-autotable';
import { captureChartAsCanvas } from './chartCaptureUtils';
import { formatFilename } from './fileDownloadUtils';

export const exportToPDF = async (data: any[], filename: string, chartIds?: string | string[]) => {
  const jsPDF = (await import('jspdf')).default;
  
  // Import the autoTable plugin
  const autoTable = (await import('jspdf-autotable')).default;
  
  const doc = new jsPDF();
  let yPosition = 20;
  
  // Add title
  doc.setFontSize(18);
  doc.text('Report Export', 20, yPosition);
  yPosition += 20;
  
  // Add generation date
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, yPosition);
  yPosition += 15;
  
  // Convert single chartId to array for consistency
  const chartIdArray = chartIds ? (Array.isArray(chartIds) ? chartIds : [chartIds]) : [];
  
  // Try to capture and add multiple charts if chartIds are provided
  if (chartIdArray.length > 0) {
    for (const chartId of chartIdArray) {
      try {
        console.log(`Attempting to capture chart: ${chartId}`);
        const chartElement = document.getElementById(chartId);
        
        if (chartElement) {
          const { getChartImageData } = await import('./chartCaptureUtils');
          const imageData = await getChartImageData(chartId);
          
          if (imageData) {
            console.log(`Successfully captured chart: ${chartId}`);
            
            // Add chart title based on ID
            let chartTitle = 'Chart';
            if (chartId.includes('category')) chartTitle = 'Assets by Category';
            else if (chartId.includes('status')) chartTitle = 'Assets by Status';
            else if (chartId.includes('project')) chartTitle = 'Assets by Project';
            else if (chartId.includes('inventory')) chartTitle = 'Asset Inventory Summary';
            
            doc.setFontSize(14);
            doc.text(chartTitle, 20, yPosition);
            yPosition += 10;
            
            // Add the chart image
            const imgWidth = 170;
            const imgHeight = 100;
            
            // Check if we need a new page
            if (yPosition + imgHeight > 280) {
              doc.addPage();
              yPosition = 20;
            }
            
            doc.addImage(imageData, 'PNG', 20, yPosition, imgWidth, imgHeight);
            yPosition += imgHeight + 15;
          } else {
            console.warn(`Failed to capture image data for chart: ${chartId}`);
          }
        } else {
          console.warn(`Chart element not found: ${chartId}`);
        }
      } catch (error) {
        console.error(`Error capturing chart ${chartId}:`, error);
      }
    }
  }
  
  // Add table data if we have space or on a new page
  if (data && data.length > 0) {
    // Check if we need a new page for the table
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFontSize(14);
    doc.text('Data Table', 20, yPosition);
    yPosition += 10;
    
    // Create table
    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(header => row[header] || ''));
    
    autoTable(doc, {
      startY: yPosition,
      head: [headers],
      body: rows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [51, 122, 183] },
    });
  }
  
  // Save the PDF
  const pdfFilename = formatFilename(filename, 'pdf');
  doc.save(pdfFilename);
};
