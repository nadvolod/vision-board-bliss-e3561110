
import { useMemo } from 'react';
import { Goal } from '@/types';
import { FilterPeriod } from '@/components/GoalFilters';

export const useGoalFilters = (goals: Goal[], selectedPeriod: FilterPeriod) => {
  return useMemo(() => {
    console.log(`🔍 Filtering ${goals.length} goals by period: ${selectedPeriod}`);
    
    if (selectedPeriod === 'all') {
      console.log('✅ Showing all goals');
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
      console.warn('⚠️ Invalid filter period, returning all goals');
      return goals;
    }

    const filteredGoals = goals.filter(goal => {
      try {
        const goalDeadline = new Date(goal.deadline);
        
        // Check if date is valid
        if (isNaN(goalDeadline.getTime())) {
          console.warn(`⚠️ Invalid deadline for goal ${goal.id}: ${goal.deadline}`);
          return false;
        }
        
        const isWithinPeriod = goalDeadline >= now && goalDeadline <= cutoffDate;
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`📅 Goal "${goal.description.slice(0, 30)}..." (${goal.deadline}) - ${isWithinPeriod ? 'INCLUDED' : 'excluded'}`);
        }
        
        return isWithinPeriod;
      } catch (error) {
        console.error(`❌ Error processing goal ${goal.id}:`, error);
        return false;
      }
    });

    console.log(`✅ Filtered to ${filteredGoals.length} goals for period: ${selectedPeriod}`);
    return filteredGoals;
  }, [goals, selectedPeriod]);
};
