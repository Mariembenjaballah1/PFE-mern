
// Re-export all chart capture functionality from modular files
export { captureChartAsCanvas, getChartImageData } from './chartCaptureCore';
export { waitForSVGLoad, convertSVGToCanvas } from './svgUtils';
export { 
  getChartElement, 
  prepareChartElement, 
  restoreChartElement, 
  styleClonedChart 
} from './chartElementUtils';
export { verifyCanvasContent, logCanvasSuccess } from './canvasUtils';
export type { OriginalStyles } from './chartElementUtils';
