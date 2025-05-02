import { DrawingTool } from "@/lib/canvas-utils";
import { 
  Pencil, 
  Pen, 
  Heart, 
  Eraser, 
  Droplet, 
  Type 
} from "lucide-react";

interface DrawingToolsProps {
  currentTool: DrawingTool;
  onSelectTool: (tool: DrawingTool) => void;
}

export default function DrawingTools({ currentTool, onSelectTool }: DrawingToolsProps) {
  const tools = [
    { id: 'pencil' as DrawingTool, icon: Pencil, label: 'Pencil' },
    { id: 'pen' as DrawingTool, icon: Pen, label: 'Pen' },
    { id: 'heart' as DrawingTool, icon: Heart, label: 'Heart' },
    { id: 'eraser' as DrawingTool, icon: Eraser, label: 'Eraser' },
    { id: 'fill' as DrawingTool, icon: Droplet, label: 'Fill' },
    { id: 'text' as DrawingTool, icon: Type, label: 'Text' },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 mb-6">
      {tools.map((tool) => {
        const Icon = tool.icon;
        const isActive = currentTool === tool.id;
        return (
          <button
            key={tool.id}
            className={`aspect-square p-2 rounded-lg flex items-center justify-center transition duration-200 ${
              isActive 
                ? 'bg-primary text-white' 
                : 'bg-light hover:bg-primary/10 text-gray-700'
            }`}
            onClick={() => onSelectTool(tool.id)}
            aria-label={tool.label}
            title={tool.label}
          >
            <Icon className="h-5 w-5" />
          </button>
        );
      })}
    </div>
  );
}
