
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { format, parseISO, isValid } from 'date-fns';
import { Goal } from '../types';
import { Calendar } from 'lucide-react';

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
      className="vision-card cursor-pointer overflow-hidden h-full flex flex-col"
      onClick={onClick}
    >
      <div className="relative h-40 sm:h-48 overflow-hidden">
        <img
          src={goal.image}
          alt={goal.description}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4 flex-grow flex flex-col justify-between">
        <p className="text-sm line-clamp-2 mb-2">{goal.description}</p>
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{formatDate(goal.deadline)}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalCard;
