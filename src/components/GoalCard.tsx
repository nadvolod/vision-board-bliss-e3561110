
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { format, parseISO, isValid } from 'date-fns';
import { Goal } from '../types';
import { Calendar, CheckCircle2, ImageIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface GoalCardProps {
  goal: Goal;
  onClick: () => void;
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

const GoalCard: React.FC<GoalCardProps> = ({ goal, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  
  const formatDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      return isValid(date) ? format(date, 'MMM d, yyyy') : 'Invalid date';
    } catch {
      return 'Invalid date';
    }
  };

  // Get a random default image from our array
  const getRandomDefaultImage = () => {
    const randomIndex = Math.floor(Math.random() * DEFAULT_IMAGES.length);
    return DEFAULT_IMAGES[randomIndex];
  };

  // Handle image error by setting state and allowing component to re-render
  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return (
    <Card
      className="vision-card cursor-pointer overflow-hidden h-full flex flex-col hover:shadow-md transition-all"
      onClick={onClick}
    >
      <div className="relative h-40 sm:h-48 overflow-hidden bg-gray-100">
        {imageLoading && (
          <Skeleton className="absolute inset-0 w-full h-full" />
        )}
        {!imageError ? (
          <img
            src={goal.image}
            alt={goal.description}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
          />
        ) : (
          // Fallback image when the original image fails to load
          <div className="h-full w-full flex flex-col items-center justify-center">
            <img
              src={getRandomDefaultImage()}
              alt="Default vision image"
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onError={(e) => {
                // If even the fallback fails, show an icon placeholder
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                setImageError(true);
                setImageLoading(false);
              }}
              onLoad={handleImageLoad}
              loading="lazy"
            />
          </div>
        )}
        {goal.achieved && (
          <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        )}
      </div>
      <CardContent className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <p className="text-sm line-clamp-2 mb-2">{goal.description}</p>
          {goal.why && (
            <p className="text-xs text-muted-foreground italic line-clamp-2 mt-1">
              Why: {goal.why}
            </p>
          )}
        </div>
        <div className="flex items-center text-xs text-muted-foreground mt-2">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{formatDate(goal.deadline)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalCard;
