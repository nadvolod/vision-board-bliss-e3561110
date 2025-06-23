
import React, { useState, memo, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { format, parseISO, isValid } from 'date-fns';
import { Goal } from '../types';
import { Calendar, CheckCircle2 } from 'lucide-react';

interface OptimizedGoalCardProps {
  goal: Goal;
  onClick: () => void;
  index: number;
}

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&auto=format&fit=crop&q=75",
  "https://images.unsplash.com/photo-1617912187990-804dd1618f8d?w=400&auto=format&fit=crop&q=75",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&auto=format&fit=crop&q=75",
  "https://images.unsplash.com/photo-1521791055366-0d553872125f?w=400&auto=format&fit=crop&q=75",
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&auto=format&fit=crop&q=75",
  "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?w=400&auto=format&fit=crop&q=75",
];

const OptimizedGoalCard = memo<OptimizedGoalCardProps>(({ goal, onClick, index }) => {
  console.time(`goal-card-${goal.id}`);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const formatDate = useCallback((dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      return isValid(date) ? format(date, 'MMM d, yyyy') : 'Invalid date';
    } catch {
      return 'Invalid date';
    }
  }, []);

  const getDefaultImage = useCallback(() => {
    const index = goal.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % DEFAULT_IMAGES.length;
    return DEFAULT_IMAGES[index];
  }, [goal.id]);

  const handleImageError = useCallback(() => {
    console.log(`🖼️ Image error for goal ${goal.id}, using fallback`);
    setImageError(true);
    setImageLoaded(true);
  }, [goal.id]);

  const handleImageLoad = useCallback(() => {
    console.log(`✅ Image loaded for goal ${goal.id}`);
    setImageLoaded(true);
    console.timeEnd(`goal-card-${goal.id}`);
  }, [goal.id]);

  const memoizedDate = formatDate(goal.deadline);

  return (
    <Card
      className="vision-card cursor-pointer overflow-hidden h-full flex flex-col hover:shadow-md transition-all"
      onClick={onClick}
      style={{ animationDelay: `${index * 0.03}s` }}
    >
      <div className="relative h-40 sm:h-48 overflow-hidden bg-gray-100">
        {!imageLoaded && (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
        )}
        <img
          src={imageError ? getDefaultImage() : goal.image}
          alt={goal.description}
          className={`w-full h-full object-cover transition-opacity duration-200 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onError={handleImageError}
          onLoad={handleImageLoad}
          loading="lazy"
          decoding="async"
        />
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
          <span>{memoizedDate}</span>
        </div>
      </CardContent>
    </Card>
  );
});

OptimizedGoalCard.displayName = 'OptimizedGoalCard';

export default OptimizedGoalCard;
