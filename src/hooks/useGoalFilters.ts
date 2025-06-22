
import { useMemo } from 'react';
import { Goal } from '@/types';
import { FilterPeriod } from '@/components/GoalFilters';

export const useGoalFilters = (goals: Goal[], selectedPeriod: FilterPeriod) => {
  return useMemo(() => {
    console.log('useGoalFilters: Filtering', goals.length, 'goals by period:', selectedPeriod);
    
    if (selectedPeriod === 'all') {
      console.log('useGoalFilters: Returning all goals');
      return goals;
    }

    const now = new Date();
    const currentTime = now.getTime();
    
    // Calculate cutoff dates
    const cutoffDates = {
      next30days: new Date(currentTime + 30 * 24 * 60 * 60 * 1000),
      nextQuarter: new Date(currentTime + 90 * 24 * 60 * 60 * 1000),
      nextHalf: new Date(currentTime + 180 * 24 * 60 * 60 * 1000),
      nextYear: new Date(currentTime + 365 * 24 * 60 * 60 * 1000)
    };

    const cutoffDate = cutoffDates[selectedPeriod as keyof typeof cutoffDates];
    
    if (!cutoffDate) {
      console.log('useGoalFilters: Invalid period, returning all goals');
      return goals;
    }

    const filteredGoals = goals.filter(goal => {
      try {
        const goalDeadline = new Date(goal.deadline);
        const isWithinPeriod = goalDeadline >= now && goalDeadline <= cutoffDate;
        
        console.log('useGoalFilters: Goal', goal.id, 'deadline:', goal.deadline, 'within period:', isWithinPeriod);
        
        return isWithinPeriod;
      } catch (error) {
        console.error('useGoalFilters: Error parsing deadline for goal', goal.id, error);
        return false;
      }
    });

    console.log('useGoalFilters: Filtered to', filteredGoals.length, 'goals');
    return filteredGoals;
  }, [goals, selectedPeriod]);
};
