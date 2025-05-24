
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Pencil, Trash, X } from 'lucide-react';

interface GoalImageDisplayProps {
  image: string;
  description: string;
  onEdit: () => void;
  onDelete: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
}

// Array of default images to use as fallbacks
const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=500&auto=format&fit=crop", // vision/goal generic
  "https://images.unsplash.com/photo-1617912187990-804dd1618f8d?w=500&auto=format&fit=crop", // success/achievement
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&auto=format&fit=crop", // growth/development
  "https://images.unsplash.com/photo-1521791055366-0d553872125f?w=500&auto=format&fit=crop", // career/professional
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&auto=format&fit=crop", // travel/adventure
  "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?w=500&auto=format&fit=crop", // financial freedom
];

const GoalImageDisplay: React.FC<GoalImageDisplayProps> = ({
  image,
  description,
  onEdit,
  onDelete,
  onNext,
  onPrevious,
  onClose
}) => {
  const [imageError, setImageError] = useState(false);

  const getRandomDefaultImage = () => {
    const randomIndex = Math.floor(Math.random() * DEFAULT_IMAGES.length);
    return DEFAULT_IMAGES[randomIndex];
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleEditClick = () => {
    console.log('Edit button clicked in GoalImageDisplay');
    onEdit();
  };

  return (
    <div className="relative">
      <div className="w-full flex justify-center bg-black/10 p-4">
        {!imageError ? (
          <img
            src={image}
            alt={description}
            className="fullscreen-image"
            onError={handleImageError}
          />
        ) : (
          <img
            src={getRandomDefaultImage()}
            alt="Default vision image"
            className="fullscreen-image"
            onError={(e) => {
              // If even the fallback fails, show an icon placeholder
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        )}
      </div>
      
      {/* Close button in the top right */}
      <Button
        onClick={onClose}
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-colors"
        aria-label="Close dialog"
      >
        <X className="h-4 w-4" />
      </Button>
      
      {/* Navigation and action buttons at the bottom */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-between items-center px-4">
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm shadow-md"
          onClick={onPrevious}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {/* Center action buttons */}
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm shadow-md"
            onClick={handleEditClick}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          
          <Button
            variant="destructive"
            size="icon"
            className="h-9 w-9 rounded-full bg-destructive/80 backdrop-blur-sm shadow-md"
            onClick={onDelete}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
        
        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm shadow-md"
          onClick={onNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default GoalImageDisplay;
