
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Pencil, Trash, X, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const [currentImageSrc, setCurrentImageSrc] = useState(image);

  // Reset image error state when image prop changes
  useEffect(() => {
    console.log('GoalImageDisplay: Image changed to:', image);
    setImageError(false);
    setCurrentImageSrc(image);
  }, [image]);

  const getRandomDefaultImage = () => {
    const randomIndex = Math.floor(Math.random() * DEFAULT_IMAGES.length);
    return DEFAULT_IMAGES[randomIndex];
  };

  const handleImageError = () => {
    console.log('GoalImageDisplay: Image error for:', currentImageSrc);
    if (!imageError) {
      setImageError(true);
      setCurrentImageSrc(getRandomDefaultImage());
    }
  };

  const handleEditClick = () => {
    console.log('Edit button clicked in GoalImageDisplay');
    onEdit();
  };

  return (
    <div className="flex flex-col h-[90vh]">
      {/* Image container with centered navigation arrows */}
      <div className="relative w-full flex-1 bg-black flex justify-center items-center overflow-hidden">
        <img
          src={currentImageSrc}
          alt={description}
          className="w-full h-full object-cover"
          onError={handleImageError}
          onLoad={() => console.log('GoalImageDisplay: Image loaded successfully:', currentImageSrc)}
        />
        
        {/* Close button in the top right */}
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute top-6 right-6 h-10 w-10 rounded-full bg-black/60 backdrop-blur-sm hover:bg-black/80 transition-colors text-white z-20"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Actions menu in the top left */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-6 left-6 h-10 w-10 rounded-full bg-black/60 backdrop-blur-sm hover:bg-black/80 transition-colors text-white z-20"
              aria-label="Goal actions"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={handleEditClick} className="flex items-center gap-2">
              <Pencil className="h-4 w-4" />
              Edit Goal
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="flex items-center gap-2 text-red-600">
              <Trash className="h-4 w-4" />
              Delete Goal
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Left navigation arrow - centered vertically with better positioning */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-8 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-black/60 backdrop-blur-sm hover:bg-black/80 transition-all duration-200 text-white z-10 hover:scale-110"
          onClick={onPrevious}
          aria-label="Previous goal"
        >
          <ChevronLeft className="h-7 w-7" />
        </Button>
        
        {/* Right navigation arrow - centered vertically with better positioning */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-8 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-black/60 backdrop-blur-sm hover:bg-black/80 transition-all duration-200 text-white z-10 hover:scale-110"
          onClick={onNext}
          aria-label="Next goal"
        >
          <ChevronRight className="h-7 w-7" />
        </Button>
      </div>
      
      {/* Goal description below the image */}
      <div className="p-6 bg-background border-t flex-shrink-0">
        <h3 className="text-lg font-semibold text-center text-foreground leading-relaxed">
          {description}
        </h3>
      </div>
    </div>
  );
};

export default GoalImageDisplay;
