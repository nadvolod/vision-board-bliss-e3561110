
import React from 'react';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { Calendar, Check } from 'lucide-react';
import { Goal } from '../types';

interface GoalDetailsProps {
  goal: Goal;
  onMarkAsAchieved: () => void;
}

const GoalDetails: React.FC<GoalDetailsProps> = ({ goal, onMarkAsAchieved }) => {
  const formatDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      return format(date, 'MMMM d, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className="p-4 space-y-3">
      <p className="text-lg">{goal.description}</p>
      
      {goal.why && (
        <p className="text-sm text-muted-foreground italic">
          <strong>Why:</strong> {goal.why}
        </p>
      )}
      
      <div className="flex items-center text-sm text-muted-foreground">
        <Calendar className="h-4 w-4 mr-2" />
        <span>Target: {formatDate(goal.deadline)}</span>
      </div>
      
      {goal.achieved ? (
        <div className="flex items-center mt-2 text-sm font-medium text-green-600">
          <Check className="h-4 w-4 mr-2" />
          <span>Achieved on: {formatDate(goal.achievedAt || '')}</span>
        </div>
      ) : (
        <Button 
          onClick={onMarkAsAchieved}
          className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white"
        >
          <Check className="mr-2 h-4 w-4" /> Mark as Achieved
        </Button>
      )}
    </div>
  );
};

export default GoalDetails;
