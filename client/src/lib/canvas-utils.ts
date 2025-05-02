export type Point = {
  x: number;
  y: number;
};

export type DrawingTool = 'pencil' | 'pen' | 'heart' | 'eraser' | 'fill' | 'text';

// History entry for undo functionality
export type HistoryEntry = ImageData;

// Tool configuration
export interface ToolConfig {
  tool: DrawingTool;
  color: string;
  size: number;
}

// Draw a heart shape at the given position with specified size and color
export function drawHeart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string
) {
  // Save canvas state
  ctx.save();
  
  // Position and scale
  ctx.translate(x, y);
  ctx.scale(size / 30, size / 30);
  
  // Start drawing the heart
  ctx.beginPath();
  ctx.moveTo(0, 0);
  
  // Draw heart shape using bezier curves
  ctx.bezierCurveTo(-10, -10, -15, 0, 0, 10);
  ctx.bezierCurveTo(15, 0, 10, -10, 0, 0);
  
  // Fill and stroke
  ctx.fillStyle = color;
  ctx.fill();
  
  // Restore canvas state
  ctx.restore();
}

// Create a smooth line between points for brush strokes
export function drawSmoothLine(
  ctx: CanvasRenderingContext2D,
  prev: Point,
  current: Point,
  size: number,
  color: string
) {
  ctx.beginPath();
  ctx.moveTo(prev.x, prev.y);
  ctx.lineTo(current.x, current.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = size;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
}

// Fill canvas with a color
export function fillCanvas(
  ctx: CanvasRenderingContext2D,
  color: string
) {
  const prevFillStyle = ctx.fillStyle;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = prevFillStyle;
}

// Add text to canvas
export function addTextToCanvas(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  color: string,
  size: number
) {
  ctx.font = `${size}px 'Dancing Script', cursive`;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

// Save canvas data to history for undo
export function saveToHistory(ctx: CanvasRenderingContext2D): HistoryEntry {
  return ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
}

// Restore canvas from history entry
export function restoreFromHistory(ctx: CanvasRenderingContext2D, entry: HistoryEntry) {
  ctx.putImageData(entry, 0, 0);
}

// Resize canvas to fit container and preserve drawing
export function resizeCanvas(canvas: HTMLCanvasElement, container: HTMLElement) {
  // Save current drawing
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  if (tempCtx) {
    tempCtx.drawImage(canvas, 0, 0);
  }

  // Adjust canvas size
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;

  // Restore drawing
  const ctx = canvas.getContext('2d');
  if (ctx && tempCtx) {
    ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 
                 0, 0, canvas.width, canvas.height);
  }
}

// Initialize canvas with correct pixel ratio
export function initializeCanvas(canvas: HTMLCanvasElement, container: HTMLElement) {
  const dpr = window.devicePixelRatio || 1;
  
  // Set canvas size to match container
  canvas.width = container.clientWidth * dpr;
  canvas.height = container.clientHeight * dpr;
  
  // Scale canvas CSS size
  canvas.style.width = `${container.clientWidth}px`;
  canvas.style.height = `${container.clientHeight}px`;
  
  // Scale context to match device pixel ratio
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.scale(dpr, dpr);
  }
  
  return ctx;
}

// Convert canvas to data URL for saving
export function canvasToDataURL(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/png');
}
