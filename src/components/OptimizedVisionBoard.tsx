
import React, { useState, useMemo, useCallback } from 'react';
import { useOptimizedGoals } from '../hooks/useOptimizedGoals';
import { useGoalFilters } from '../hooks/useGoalFilters';
import OptimizedGoalCard from './OptimizedGoalCard';
import ViewGoal from './ViewGoal';
import GoalFilters, { FilterPeriod } from './GoalFilters';
import { Goal } from '../types';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';

const FastSkeleton = () => (
  <div className="h-full flex flex-col">
    <div className="h-40 sm:h-48 w-full rounded-t-lg bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
    <div className="p-4 border border-t-0 rounded-b-lg">
      <div className="h-4 w-full mb-2 bg-gray-200 rounded animate-pulse" />
      <div className="h-3 w-3/4 mb-2 bg-gray-200 rounded animate-pulse" />
      <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
    </div>
  </div>
);

const OptimizedVisionBoard: React.FC = () => {
  console.log('OptimizedVisionBoard: Component rendering');
  
  const { data: goals, isLoading, error } = useOptimizedGoals();
  const [selectedGoalIndex, setSelectedGoalIndex] = useState<number | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<FilterPeriod>('all');
  
  // Ensure goals is always an array, even during loading
  const safeGoals = goals || [];
  
  console.log('OptimizedVisionBoard: Goals data:', safeGoals.length, 'isLoading:', isLoading, 'error:', error);
  
  const { activeGoals, hasAchievedGoals } = useMemo(() => {
    if (!safeGoals || safeGoals.length === 0) {
      return { activeGoals: [], hasAchievedGoals: false };
    }
    
    const active = safeGoals.filter(goal => !goal.achieved);
    const hasAchieved = safeGoals.some(goal => goal.achieved);
    console.log('OptimizedVisionBoard: Active goals:', active.length, 'Has achieved:', hasAchieved);
    return { activeGoals: active, hasAchievedGoals: hasAchieved };
  }, [safeGoals]);

  // Apply date-based filtering to active goals
  const filteredGoals = useGoalFilters(activeGoals, selectedPeriod);
  
  const handleGoalClick = useCallback((index: number) => {
    console.log('OptimizedVisionBoard: Goal clicked at index:', index);
    setSelectedGoalIndex(index);
  }, []);
  
  const handleCloseViewer = useCallback(() => {
    console.log('OptimizedVisionBoard: Closing viewer');
    setSelectedGoalIndex(null);
  }, []);
  
  const handleNextGoal = useCallback(() => {
    if (selectedGoalIndex === null || filteredGoals.length === 0) return;
    const nextIndex = (selectedGoalIndex + 1) % filteredGoals.length;
    console.log('OptimizedVisionBoard: Next goal, index:', nextIndex);
    setSelectedGoalIndex(nextIndex);
  }, [selectedGoalIndex, filteredGoals.length]);
  
  const handlePreviousGoal = useCallback(() => {
    if (selectedGoalIndex === null || filteredGoals.length === 0) return;
    const prevIndex = (selectedGoalIndex - 1 + filteredGoals.length) % filteredGoals.length;
    console.log('OptimizedVisionBoard: Previous goal, index:', prevIndex);
    setSelectedGoalIndex(prevIndex);
  }, [selectedGoalIndex, filteredGoals.length]);
  
  const selectedGoal: Goal | null = useMemo(() => {
    const goal = selectedGoalIndex !== null && filteredGoals[selectedGoalIndex] 
      ? filteredGoals[selectedGoalIndex] 
      : null;
    console.log('OptimizedVisionBoard: Selected goal:', goal?.id || 'none');
    return goal;
  }, [selectedGoalIndex, filteredGoals]);

  const handlePeriodChange = useCallback((period: FilterPeriod) => {
    console.log('OptimizedVisionBoard: Changing filter period to:', period);
    setSelectedPeriod(period);
    setSelectedGoalIndex(null); // Reset selection when filter changes
  }, []);

  // Handle error state
  if (error) {
    console.error('OptimizedVisionBoard: Error loading goals:', error);
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2 text-red-600">Error Loading Goals</h2>
          <p className="text-muted-foreground mb-4">
            There was a problem loading your vision board. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  // Handle loading state
  if (isLoading || !goals) {
    console.log('OptimizedVisionBoard: Showing loading state');
    return (
      <>
        <div className="flex justify-between items-center px-4 py-2">
          <h2 className="text-lg font-medium">My Current Goals</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {Array.from({ length: 8 }, (_, index) => (
            <FastSkeleton key={index} />
          ))}
        </div>
      </>
    );
  }

  console.log('OptimizedVisionBoard: Rendering main content');

  return (
    <>
      <div className="flex justify-between items-center px-4 py-2">
        <h2 className="text-lg font-medium">My Current Goals</h2>
        {hasAchievedGoals && (
          <Link to="/achievements">
            <Button variant="outline" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" /> View Achievements
            </Button>
          </Link>
        )}
      </div>
      
      {/* Add filters only when there are active goals */}
      {activeGoals.length > 0 && (
        <GoalFilters
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
          goalCount={filteredGoals.length}
        />
      )}
      
      {activeGoals.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="text-center max-w-md animate-float">
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-vision-purple to-vision-teal bg-clip-text text-transparent">Welcome to Your Vision Board</h2>
            <p className="text-muted-foreground mb-4">
              Add images that represent your goals and dreams
            </p>
            <div className="opacity-40 text-center">
              <p className="text-6xl mb-2">✨</p>
              <p className="text-sm">Click the "Add Goal" button to get started</p>
            </div>
            {hasAchievedGoals && (
              <div className="mt-8">
                <Link to="/achievements">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" /> View Your Achievements
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : filteredGoals.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh]">
          <div className="text-center max-w-md">
            <h3 className="text-xl font-semibold mb-2">No goals in this time period</h3>
            <p className="text-muted-foreground mb-4">
              Try selecting a different time period or add goals with deadlines in this range.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {filteredGoals.map((goal, index) => (
            <div key={goal.id} className="animate-fade-in">
              <OptimizedGoalCard 
                goal={goal} 
                onClick={() => handleGoalClick(index)}
                index={index}
              />
            </div>
          ))}
        </div>
      )}
      
      <ViewGoal
        goal={selectedGoal}
        onClose={handleCloseViewer}
        onNext={handleNextGoal}
        onPrevious={handlePreviousGoal}
      />
    </>
  );
};

export default OptimizedVisionBoard;
