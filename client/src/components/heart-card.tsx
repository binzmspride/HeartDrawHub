import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Edit, Download, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Drawing {
  id: number;
  userId: number;
  name: string;
  imageData: string;
  createdAt: string;
}

interface HeartCardProps {
  drawing: Drawing;
  onEdit: () => void;
  onDelete: () => void;
  onDownload: () => void;
}

export default function HeartCard({ drawing, onEdit, onDelete, onDownload }: HeartCardProps) {
  const formattedDate = format(new Date(drawing.createdAt), 'MMM d, yyyy');
  
  return (
    <Card className="bg-light rounded-lg overflow-hidden shadow-sm hover:shadow-md transition duration-200">
      <div className="aspect-square bg-white relative">
        <img
          src={drawing.imageData}
          alt={drawing.name}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-800">{drawing.name}</h3>
        <p className="text-gray-500 text-sm">Created on {formattedDate}</p>
        <div className="mt-3 flex justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="text-gray-600 hover:text-primary transition duration-200"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDownload}
            className="text-gray-600 hover:text-primary transition duration-200"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-gray-600 hover:text-red-500 transition duration-200"
            title="Delete"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
