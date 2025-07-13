import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronLeft, ChevronRight, MoreHorizontal, Pencil, Trash, X } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface GoalImageDisplayProps {
  image: string;
  description: string;
  goalId?: string; // Add optional goal ID for unique test IDs
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
  goalId,
  onEdit,
  onDelete,
  onNext,
  onPrevious,
  onClose
}) => {
  const [currentImageSrc, setCurrentImageSrc] = useState(image);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const mountedRef = useRef(true);

  const getRandomDefaultImage = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * DEFAULT_IMAGES.length);
    return DEFAULT_IMAGES[randomIndex];
  }, []);

  const handleImageError = useCallback(() => {
    console.log('GoalImageDisplay: Image error for:', currentImageSrc);
    if (!hasError && mountedRef.current) {
      setHasError(true);
      const fallbackImage = getRandomDefaultImage();
      setCurrentImageSrc(fallbackImage);
      console.log('GoalImageDisplay: Switching to fallback:', fallbackImage);
    }
  }, [currentImageSrc, hasError, getRandomDefaultImage]);

  const handleImageLoad = useCallback(() => {
    if (mountedRef.current) {
      setIsLoading(false);
      console.log('GoalImageDisplay: Image loaded successfully:', currentImageSrc);
    }
  }, [currentImageSrc]);

  // Reset states when image prop changes
  useEffect(() => {
    console.log('GoalImageDisplay: Image changed to:', image);
    setCurrentImageSrc(image);
    setIsLoading(true);
    setHasError(false);
    
    // Preload the new image
    if (image) {
      const img = new Image();
      img.onload = () => {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      };
      img.onerror = () => {
        if (mountedRef.current) {
          handleImageError();
        }
      };
      img.src = image;
    }
  }, [image, handleImageError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleEditClick = () => {
    console.log('Edit button clicked in GoalImageDisplay');
    onEdit();
  };

  return (
    <div className="flex flex-col h-[90vh]">
      {/* Image container with centered navigation arrows */}
      <div className="relative w-full flex-1 bg-black flex justify-center items-center overflow-hidden">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        <img
          ref={imageRef}
          src={currentImageSrc}
          alt={description}
          className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          data-testid={goalId ? `goal-image-${goalId}` : "goal-image"}
        />
        
        {/* Close button in the top right */}
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute top-6 right-6 h-12 w-12 rounded-full bg-black/70 backdrop-blur-sm hover:bg-black/90 transition-all duration-200 text-white z-20 hover:scale-105"
          aria-label="Close dialog"
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Actions menu in the top left */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-6 left-6 h-12 w-12 rounded-full bg-black/70 backdrop-blur-sm hover:bg-black/90 transition-all duration-200 text-white z-20 hover:scale-105"
              aria-label="Goal actions"
            >
              <MoreHorizontal className="h-6 w-6" />
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
        
        {/* Left navigation arrow - perfectly centered */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-6 top-1/2 -translate-y-1/2 h-16 w-16 rounded-full bg-black/70 backdrop-blur-sm hover:bg-black/90 transition-all duration-200 text-white z-10 hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
          onClick={onPrevious}
          aria-label="Previous goal"
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
        
        {/* Right navigation arrow - perfectly centered */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-6 top-1/2 -translate-y-1/2 h-16 w-16 rounded-full bg-black/70 backdrop-blur-sm hover:bg-black/90 transition-all duration-200 text-white z-10 hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
          onClick={onNext}
          aria-label="Next goal"
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>
      
      {/* Goal description below the image */}
      <div className="p-6 bg-background border-t flex-shrink-0 min-h-[120px] flex items-center justify-center">
        <h3 className="text-xl font-semibold text-center text-foreground leading-relaxed max-w-4xl">
          {description}
        </h3>
      </div>
    </div>
  );
};

export default GoalImageDisplay;
