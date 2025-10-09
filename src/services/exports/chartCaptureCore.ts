
import html2canvas from 'html2canvas';
import { waitForSVGLoad } from './svgUtils';
import { 
  getChartElement, 
  prepareChartElement, 
  restoreChartElement, 
  styleClonedChart 
} from './chartElementUtils';
import { verifyCanvasContent, logCanvasSuccess } from './canvasUtils';

export const captureChartAsCanvas = async (chartId: string): Promise<HTMLCanvasElement | null> => {
  try {
    console.log(`Starting chart capture for: ${chartId}`);
    
    const chartElement = getChartElement(chartId);
    if (!chartElement) {
      console.error(`Chart element not found: ${chartId}`);
      return null;
    }

    console.log('Chart element found, preparing for capture');
    const originalStyles = prepareChartElement(chartElement);
    
    // Wait longer for chart animations and SVG rendering
    console.log('Waiting for chart to render...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    await waitForSVGLoad(chartElement);
    
    // Force a reflow to ensure all elements are rendered
    chartElement.offsetHeight;
    
    console.log('Attempting to capture chart with html2canvas');
    
    const canvas = await html2canvas(chartElement, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: true,
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: false,
      removeContainer: false,
      width: Math.max(chartElement.offsetWidth, 800),
      height: Math.max(chartElement.offsetHeight, 400),
      onclone: (clonedDoc, element) => {
        console.log('Cloning chart element for capture');
        const clonedChart = element.querySelector(`#${chartId}`);
        if (clonedChart) {
          styleClonedChart(clonedChart as HTMLElement, chartElement);
          
          // Ensure all SVG elements are visible
          const svgs = clonedChart.querySelectorAll('svg');
          svgs.forEach(svg => {
            svg.style.display = 'block';
            svg.style.visibility = 'visible';
            svg.setAttribute('width', '100%');
            svg.setAttribute('height', '100%');
          });
        }
        return clonedDoc;
      }
    });
    
    // Restore original styles
    restoreChartElement(chartElement, originalStyles);
    
    // Verify canvas has actual content
    if (!verifyCanvasContent(canvas)) {
      console.error('Canvas content verification failed');
      return null;
    }
    
    logCanvasSuccess(canvas, chartId);
    return canvas;
  } catch (err) {
    console.error('Error capturing chart:', err);
    return null;
  }
};

export const getChartImageData = async (chartId: string): Promise<string | null> => {
  console.log(`Getting chart image data for: ${chartId}`);
  const canvas = await captureChartAsCanvas(chartId);
  if (!canvas) {
    console.error('Failed to capture chart canvas');
    return null;
  }
  
  const imageData = canvas.toDataURL('image/png', 1.0);
  console.log('Chart image data generated successfully');
  return imageData;
};
