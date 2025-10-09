
export const waitForSVGLoad = async (element: HTMLElement): Promise<void> => {
  return new Promise((resolve) => {
    const svgElements = element.querySelectorAll('svg');
    
    if (svgElements.length === 0) {
      resolve();
      return;
    }
    
    // For SVG elements, we just wait a bit for them to be rendered
    // SVG elements don't have load events like images do
    setTimeout(() => resolve(), 500);
  });
};

export const convertSVGToCanvas = async (svg: SVGElement): Promise<HTMLCanvasElement> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  // Get SVG dimensions
  const rect = svg.getBoundingClientRect();
  canvas.width = rect.width * 2; // Higher resolution
  canvas.height = rect.height * 2;
  
  // Scale context for higher resolution
  ctx.scale(2, 2);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, rect.width, rect.height);
  
  // Serialize SVG
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svg);
  
  // Create image from SVG
  const img = new Image();
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  
  return new Promise<HTMLCanvasElement>((resolve) => {
    img.onload = () => {
      ctx.drawImage(img, 0, 0, rect.width, rect.height);
      URL.revokeObjectURL(url);
      resolve(canvas);
    };
    img.onerror = () => {
      console.warn('Failed to convert SVG to canvas');
      resolve(canvas); // Return empty canvas as fallback
    };
    img.src = url;
  });
};
