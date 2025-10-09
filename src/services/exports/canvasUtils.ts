
export const verifyCanvasContent = (canvas: HTMLCanvasElement): boolean => {
  const ctx = canvas.getContext('2d');
  const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
  const hasContent = imageData?.data.some((channel, index) => {
    // Check if there are non-white, non-transparent pixels
    if (index % 4 === 3) return false; // Skip alpha channel
    return channel !== 255 && channel !== 0;
  });
  
  if (!hasContent) {
    console.warn('Captured canvas appears to be empty or all white');
    return false;
  }
  
  return true;
};

export const logCanvasSuccess = (canvas: HTMLCanvasElement, chartId: string): void => {
  console.log('Chart image captured successfully:', {
    width: canvas.width,
    height: canvas.height,
    chartId,
    hasContent: verifyCanvasContent(canvas)
  });
};
