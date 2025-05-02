import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

export default function ColorPicker({ selectedColor, onSelectColor }: ColorPickerProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const colors = [
    "#e91e63", // primary
    "#ff4081", // secondary
    "#f50057", // accent
    "#c2185b", // dark
    "#880e4f", // darker
  ];

  const handleColorClick = (color: string) => {
    onSelectColor(color);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSelectColor(e.target.value);
  };

  return (
    <div className="mb-6">
      <Label className="block text-sm font-medium text-gray-700 mb-2">Color</Label>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color}
            className="w-8 h-8 rounded-full border-2 transition-all duration-200"
            style={{
              backgroundColor: color,
              borderColor: selectedColor === color ? "#333" : "white",
              transform: selectedColor === color ? "scale(1.1)" : "scale(1)"
            }}
            onClick={() => handleColorClick(color)}
            aria-label={`Select color ${color}`}
          />
        ))}
        
        {/* Custom color button */}
        <button
          className="w-8 h-8 rounded-full border-2 border-gray-200 flex items-center justify-center bg-white transition-all duration-200 hover:bg-gray-50"
          onClick={() => setShowColorPicker(!showColorPicker)}
          aria-label="Custom color"
        >
          {showColorPicker ? (
            <span className="text-xs">×</span>
          ) : (
            <span className="text-xs">+</span>
          )}
        </button>
      </div>
      
      {/* Custom color picker */}
      {showColorPicker && (
        <div className="mt-2">
          <Input
            type="color"
            value={selectedColor}
            onChange={handleCustomColorChange}
            className="w-full h-10 p-1"
          />
        </div>
      )}
    </div>
  );
}
