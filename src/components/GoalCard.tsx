
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { format, parseISO, isValid } from 'date-fns';
import { Goal } from '../types';
import { Calendar, CheckCircle2 } from 'lucide-react';

interface GoalCardProps {
  goal: Goal;
  onClick: () => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onClick }) => {
  const formatDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      return isValid(date) ? format(date, 'MMM d, yyyy') : 'Invalid date';
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <Card
      className="vision-card cursor-pointer overflow-hidden h-full flex flex-col hover:shadow-md transition-all"
      onClick={onClick}
    >
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <img
          src={goal.image}
          alt={goal.description}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null; // Prevent infinite loop
            target.src = "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=500&auto=format&fit=crop";
          }}
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
          <span>{formatDate(goal.deadline)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalCard;
