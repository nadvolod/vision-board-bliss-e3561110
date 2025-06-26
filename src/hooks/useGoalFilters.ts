import { FilterPeriod } from '@/components/GoalFilters';
import { Goal } from '@/types';
import { useMemo } from 'react';

export const useGoalFilters = (goals: Goal[], selectedPeriod: FilterPeriod) => {
  return useMemo(() => {
    if (selectedPeriod === 'all') {
      return goals;
    }

    const now = new Date();
    const currentTime = now.getTime();
    
    // Calculate cutoff dates with better precision
    const cutoffDates = {
      next30days: new Date(currentTime + (30 * 24 * 60 * 60 * 1000)),
      nextQuarter: new Date(currentTime + (90 * 24 * 60 * 60 * 1000)),
      nextHalf: new Date(currentTime + (180 * 24 * 60 * 60 * 1000)),
      nextYear: new Date(currentTime + (365 * 24 * 60 * 60 * 1000))
    };

    const cutoffDate = cutoffDates[selectedPeriod as keyof typeof cutoffDates];
    
    if (!cutoffDate) {
      return goals;
    }

    const filteredGoals = goals.filter(goal => {
      try {
        const goalDeadline = new Date(goal.deadline);
        
        // Check if date is valid
        if (isNaN(goalDeadline.getTime())) {
          return false;
        }
        
        return goalDeadline >= now && goalDeadline <= cutoffDate;
      } catch (error) {
        console.error(`Error processing goal ${goal.id}:`, error);
        return false;
      }
    });

    return filteredGoals;
  }, [goals, selectedPeriod]);
};
