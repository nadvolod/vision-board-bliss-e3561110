import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';
import React, { Suspense, lazy, useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGoalFilters } from '../hooks/useGoalFilters';
import { useOptimizedGoals } from '../hooks/useOptimizedGoals';
import { Goal } from '../types';
import GoalFilters, { FilterPeriod } from './GoalFilters';
import OptimizedGoalCard from './OptimizedGoalCard';

// Lazy load ViewGoal to reduce initial bundle size
const ViewGoal = lazy(() => import('./ViewGoal'));

const SkeletonCard = React.memo(() => (
  <div className="h-full flex flex-col animate-pulse">
    <div className="h-40 sm:h-48 w-full rounded-t-lg bg-gradient-to-br from-gray-200 to-gray-300" />
    <div className="p-4 border border-t-0 rounded-b-lg space-y-2">
      <div className="h-4 w-full bg-gray-200 rounded" />
      <div className="h-3 w-3/4 bg-gray-200 rounded" />
      <div className="h-3 w-1/2 bg-gray-200 rounded" />
    </div>
  </div>
));

SkeletonCard.displayName = 'SkeletonCard';

const EmptyState = React.memo<{ hasAchievedGoals: boolean; isFiltered?: boolean }>(
  ({ hasAchievedGoals, isFiltered = false }) => (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh]">
      <div className="text-center max-w-md animate-float">
        <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-vision-purple to-vision-teal bg-clip-text text-transparent">
          {isFiltered ? "No goals in this time period" : "Welcome to Your Vision Board"}
        </h2>
        <p className="text-muted-foreground mb-4">
          {isFiltered 
            ? "Try selecting a different time period or add goals with deadlines in this range."
            : "Add images that represent your goals and dreams"
          }
        </p>
        {!isFiltered && (
          <div className="opacity-40 text-center">
            <p className="text-6xl mb-2">✨</p>
            <p className="text-sm">Click the "Add Goal" button to get started</p>
          </div>
        )}
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
  )
);

EmptyState.displayName = 'EmptyState';

const OptimizedVisionBoard: React.FC = () => {
  const { data: goals, isLoading, error } = useOptimizedGoals();
  const [selectedGoalIndex, setSelectedGoalIndex] = useState<number | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<FilterPeriod>('all');
  
  const { activeGoals, hasAchievedGoals } = useMemo(() => {
    const safeGoals = goals || [];
    
    if (safeGoals.length === 0) {
      return { activeGoals: [], hasAchievedGoals: false };
    }
    
    const active = safeGoals.filter(goal => !goal.achieved);
    const hasAchieved = safeGoals.some(goal => goal.achieved);
    return { activeGoals: active, hasAchievedGoals: hasAchieved };
  }, [goals]);

  const filteredGoals = useGoalFilters(activeGoals, selectedPeriod);
  
  const handleGoalClick = useCallback((index: number) => {
    setSelectedGoalIndex(index);
  }, []);
  
  const handleCloseViewer = useCallback(() => {
    setSelectedGoalIndex(null);
  }, []);
  
  const handleNextGoal = useCallback(() => {
    if (selectedGoalIndex === null || filteredGoals.length === 0) return;
    const nextIndex = (selectedGoalIndex + 1) % filteredGoals.length;
    setSelectedGoalIndex(nextIndex);
  }, [selectedGoalIndex, filteredGoals.length]);
  
  const handlePreviousGoal = useCallback(() => {
    if (selectedGoalIndex === null || filteredGoals.length === 0) return;
    const prevIndex = (selectedGoalIndex - 1 + filteredGoals.length) % filteredGoals.length;
    setSelectedGoalIndex(prevIndex);
  }, [selectedGoalIndex, filteredGoals.length]);
  
  const selectedGoal: Goal | null = useMemo(() => {
    return selectedGoalIndex !== null && filteredGoals[selectedGoalIndex] 
      ? filteredGoals[selectedGoalIndex] 
      : null;
  }, [selectedGoalIndex, filteredGoals]);

  const handlePeriodChange = useCallback((period: FilterPeriod) => {
    setSelectedPeriod(period);
    setSelectedGoalIndex(null);
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2 text-red-600">Error Loading Goals</h2>
          <p className="text-muted-foreground mb-4">
            There was a problem loading your vision board. Please try refreshing the page.
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {Array.from({ length: 8 }, (_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-4 py-3 border-b bg-background sticky top-0 z-10">
        <h2 className="text-lg font-medium">My Current Goals</h2>
        {hasAchievedGoals && (
          <Link to="/achievements">
            <Button variant="outline" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" /> 
              <span className="hidden sm:inline">View Achievements</span>
              <span className="sm:hidden">Achievements</span>
            </Button>
          </Link>
        )}
      </div>
      
      {activeGoals.length > 0 && (
        <GoalFilters
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
          goalCount={filteredGoals.length}
        />
      )}
      
      <div className="flex-1 overflow-auto">
        {activeGoals.length === 0 ? (
          <EmptyState hasAchievedGoals={hasAchievedGoals} />
        ) : filteredGoals.length === 0 ? (
          <EmptyState hasAchievedGoals={hasAchievedGoals} isFiltered={true} />
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
      </div>
      
      <Suspense fallback={<div>Loading...</div>}>
        <ViewGoal
          goal={selectedGoal}
          onClose={handleCloseViewer}
          onNext={handleNextGoal}
          onPrevious={handlePreviousGoal}
        />
      </Suspense>
    </div>
  );
};

export default OptimizedVisionBoard;
