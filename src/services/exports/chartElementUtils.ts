
export interface OriginalStyles {
  display: string;
  visibility: string;
  position: string;
  zIndex: string;
}

export const getChartElement = (chartId: string): HTMLElement | null => {
  console.log(`Attempting to capture chart with ID: ${chartId}`);
  const chartElement = document.getElementById(chartId);
  
  if (!chartElement) {
    console.error(`Chart element with ID "${chartId}" not found in the DOM`);
    return null;
  }

  return chartElement as HTMLElement;
};

export const prepareChartElement = (element: HTMLElement): OriginalStyles => {
  // Store original styles
  const originalStyles: OriginalStyles = {
    display: element.style.display,
    visibility: element.style.visibility,
    position: element.style.position,
    zIndex: element.style.zIndex
  };
  
  // Ensure visibility
  element.style.display = 'block';
  element.style.visibility = 'visible';
  element.style.position = 'relative';
  element.style.zIndex = '9999';
  
  // Force reflow
  element.offsetHeight;
  
  return originalStyles;
};

export const restoreChartElement = (element: HTMLElement, originalStyles: OriginalStyles): void => {
  Object.entries(originalStyles).forEach(([key, value]) => {
    if (value) {
      (element.style as any)[key] = value;
    }
  });
};

export const styleClonedChart = (clone: HTMLElement, originalElement: HTMLElement): void => {
  clone.style.width = `${Math.max(originalElement.offsetWidth, 400)}px`;
  clone.style.height = `${Math.max(originalElement.offsetHeight, 300)}px`;
  clone.style.display = 'block';
  clone.style.visibility = 'visible';
  clone.style.position = 'relative';
  clone.style.transform = 'none';
  clone.style.backgroundColor = '#ffffff';
  
  // Ensure all SVGs are visible and styled
  const clonedSvgs = clone.querySelectorAll('svg');
  clonedSvgs.forEach(svg => {
    const svgElement = svg as SVGElement;
    svgElement.style.display = 'block';
    svgElement.style.visibility = 'visible';
    svgElement.style.backgroundColor = 'transparent';
    
    // Set explicit dimensions if missing
    if (!svgElement.getAttribute('width')) {
      svgElement.setAttribute('width', '100%');
    }
    if (!svgElement.getAttribute('height')) {
      svgElement.setAttribute('height', '100%');
    }
  });
  
  console.log('Chart element cloned and styled for capture, SVGs:', clonedSvgs.length);
};
