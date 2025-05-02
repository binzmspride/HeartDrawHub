import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import NavHeader from "@/components/nav-header";
import DrawingTools from "@/components/drawing-tools";
import ColorPicker from "@/components/color-picker";
import { 
  DrawingTool, 
  HistoryEntry, 
  addTextToCanvas, 
  canvasToDataURL, 
  drawHeart, 
  drawSmoothLine, 
  fillCanvas, 
  initializeCanvas, 
  restoreFromHistory, 
  saveToHistory
} from "@/lib/canvas-utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Save, Trash2, Undo } from "lucide-react";

export default function DrawingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState({ x: 0, y: 0 });
  const [tool, setTool] = useState<DrawingTool>("pencil");
  const [color, setColor] = useState("#e91e63");
  const [brushSize, setBrushSize] = useState(5);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showTutorial, setShowTutorial] = useState(true);
  const { toast } = useToast();

  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current && containerRef.current) {
      const context = initializeCanvas(canvasRef.current, containerRef.current);
      if (context) {
        setCtx(context);
        // Save initial blank canvas to history
        const initialState = saveToHistory(context);
        setHistory([initialState]);
      }
    }

    // Add resize event listener
    const handleResize = () => {
      if (canvasRef.current && containerRef.current && ctx) {
        // Save current state
        const currentState = saveToHistory(ctx);
        
        // Resize canvas
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = containerRef.current.clientHeight;
        
        // Restore state
        restoreFromHistory(ctx, currentState);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle mouse/touch down
  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!ctx) return;
    
    setIsDrawing(true);
    
    // Get coordinates
    const point = getEventCoordinates(e);
    setLastPoint(point);
    
    // Save current state to history for undo
    const currentState = saveToHistory(ctx);
    setHistory(prev => [...prev, currentState]);
    
    // If using heart tool, draw a heart immediately
    if (tool === 'heart') {
      drawHeart(ctx, point.x, point.y, brushSize * 5, color);
    } else if (tool === 'fill') {
      fillCanvas(ctx, color);
    } else if (tool === 'text') {
      const text = prompt('Enter text:', 'Love');
      if (text) {
        addTextToCanvas(ctx, point.x, point.y, text, color, brushSize * 3);
      }
    }
  };

  // Handle mouse/touch move
  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !ctx) return;
    
    // Get current point
    const currentPoint = getEventCoordinates(e);
    
    // If pencil or pen, draw line
    if (tool === 'pencil' || tool === 'pen') {
      drawSmoothLine(ctx, lastPoint, currentPoint, brushSize, color);
    } else if (tool === 'eraser') {
      drawSmoothLine(ctx, lastPoint, currentPoint, brushSize, '#FFFFFF');
    }
    
    // Update last point
    setLastPoint(currentPoint);
  };

  // Handle mouse/touch up
  const handleEnd = () => {
    setIsDrawing(false);
  };

  // Helper to get coordinates from mouse or touch event
  const getEventCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const rect = canvasRef.current.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      // Touch event
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  // Handle undo
  const handleUndo = () => {
    if (!ctx || history.length <= 1) return;
    
    // Remove the last state
    const newHistory = [...history];
    newHistory.pop();
    setHistory(newHistory);
    
    // Restore the previous state
    const prevState = newHistory[newHistory.length - 1];
    restoreFromHistory(ctx, prevState);
  };

  // Handle clear canvas
  const handleClear = () => {
    if (!ctx || !canvasRef.current) return;
    
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Save cleared state to history
    const clearedState = saveToHistory(ctx);
    setHistory([clearedState]);
    
    toast({
      title: "Canvas cleared",
      description: "Your drawing has been cleared"
    });
  };

  // Handle save drawing
  const handleSave = async () => {
    if (!canvasRef.current) return;
    
    try {
      const dataUrl = canvasToDataURL(canvasRef.current);
      
      await apiRequest("POST", "/api/drawings", {
        imageData: dataUrl,
        name: `Heart ${new Date().toLocaleDateString()}`
      });
      
      // Invalidate gallery cache
      queryClient.invalidateQueries({ queryKey: ["/api/drawings"] });
      
      toast({
        title: "Heart saved!",
        description: "Your heart drawing was saved successfully"
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Could not save your drawing",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col">
        <div className="py-4">
          <h2 className="text-2xl font-semibold text-gray-800">Create Your Heart</h2>
          <p className="text-gray-500">Express your feelings through a beautiful heart drawing</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 flex-grow">
          {/* Tools Sidebar */}
          <Card className="md:w-64">
            <CardContent className="pt-4">
              <h3 className="font-medium text-gray-700 mb-3">Tools</h3>
              
              {/* Drawing Tools */}
              <DrawingTools 
                currentTool={tool}
                onSelectTool={setTool}
              />
              
              {/* Brush Size */}
              <div className="mb-6">
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Brush Size: {brushSize}px
                </Label>
                <Slider
                  value={[brushSize]}
                  min={1}
                  max={50}
                  step={1}
                  onValueChange={(values) => setBrushSize(values[0])}
                  className="w-full"
                />
              </div>
              
              {/* Color Picker */}
              <ColorPicker 
                selectedColor={color} 
                onSelectColor={setColor} 
              />
              
              {/* Actions */}
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleUndo}
                  disabled={history.length <= 1}
                >
                  <Undo className="mr-2 h-4 w-4" /> Undo
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleClear}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Clear
                </Button>
                <Button 
                  className="w-full justify-start"
                  onClick={handleSave}
                >
                  <Save className="mr-2 h-4 w-4" /> Save Heart
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Canvas Container */}
          <div className="flex-grow flex flex-col">
            <Card className="flex-grow flex items-center justify-center">
              <CardContent className="p-4 w-full h-full">
                <div 
                  ref={containerRef}
                  className="canvas-container w-full h-full max-h-[600px] rounded-lg overflow-hidden relative heart-bg drawing-cursor"
                  style={{
                    touchAction: 'none',
                    backgroundImage: `radial-gradient(#fce4ec 15%, transparent 16%), radial-gradient(#fce4ec 15%, transparent 16%)`,
                    backgroundSize: '60px 60px',
                    backgroundPosition: '0 0, 30px 30px',
                    cursor: tool === 'fill' ? 'paint-bucket' : 'crosshair'
                  }}
                >
                  <canvas 
                    ref={canvasRef}
                    className="w-full h-full absolute top-0 left-0"
                    onMouseDown={handleStart}
                    onMouseMove={handleMove}
                    onMouseUp={handleEnd}
                    onMouseLeave={handleEnd}
                    onTouchStart={handleStart}
                    onTouchMove={handleMove}
                    onTouchEnd={handleEnd}
                  />
                  
                  {/* Tutorial Overlay */}
                  {showTutorial && (
                    <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center p-6">
                      <div className="text-center max-w-md">
                        <svg className="mx-auto mb-4 h-32 w-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M50 85C73.5 55 87 38.5 87 27.5C87 12.8 72.5 5 60 15.5C55 20 51.5 25.5 50 30C48.5 25.5 45 20 40 15.5C27.5 5 13 12.8 13 27.5C13 38.5 26.5 55 50 85Z" fill="#e91e63"/>
                        </svg>
                        <h3 className="font-['Dancing_Script'] text-2xl font-bold text-primary mb-2">Welcome to HeartCanvas!</h3>
                        <p className="text-gray-700 mb-4">Use our drawing tools to create beautiful heart art. Select tools from the sidebar and express your love on the canvas.</p>
                        <Button
                          onClick={() => setShowTutorial(false)}
                        >
                          Start Drawing
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
