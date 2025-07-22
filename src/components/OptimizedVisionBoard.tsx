import { Button } from '@/components/ui/button';
import { useOptimizedGoalContext } from '@/context/OptimizedGoalContext';
import { Trophy, WifiOff } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGoalFilters } from '../hooks/useGoalFilters';
import { useOptimizedGoals } from '../hooks/useOptimizedGoals';
import { Goal } from '../types';
import GoalFilters, { FilterPeriod } from './GoalFilters';
import OfflineIndicator from './OfflineIndicator';
import OptimizedGoalCard from './OptimizedGoalCard';
import WinsCarousel from './WinsCarousel';
// Import ViewGoal directly instead of lazy loading for faster initial render
import ViewGoal from './ViewGoal';

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
      <div className="text-center max-w-md">
        <h2 data-testid="empty-state-title" className="text-2xl font-bold mb-2 bg-gradient-to-r from-vision-purple to-vision-teal bg-clip-text text-transparent">
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
  const { data: goals = [], isLoading, error } = useOptimizedGoals(); // Provide default value
  const { isOnline } = useOptimizedGoalContext();
  const [selectedGoalIndex, setSelectedGoalIndex] = useState<number | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<FilterPeriod>('all');
  
  const { activeGoals, hasAchievedGoals } = useMemo(() => {
    // Early return for empty goals to avoid unnecessary computation
    if (!goals || goals.length === 0) {
      return { activeGoals: [], hasAchievedGoals: false };
    }
    
    const active = goals.filter(goal => !goal.achieved);
    const hasAchieved = goals.some(goal => goal.achieved);
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

  // Simplified error state without heavy button that requires user interaction
  if (error) {
    return (
      <div className="flex flex-col h-full" data-testid="vision-board">
        <div className="flex justify-between items-center px-4 py-3 border-b bg-background sticky top-0 z-10">
          <h2 className="text-lg font-medium">My Current Goals</h2>
        </div>
        
        {/* Always render GoalFilters for performance test - even in error state */}
        <GoalFilters
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
          goalCount={0}
        />
        
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold mb-2 text-red-600">Error Loading Goals</h2>
            <p className="text-muted-foreground mb-4">
              Please refresh the page to try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Simplified loading state with fewer skeleton cards for faster render
  if (isLoading) {
    return (
      <div className="flex flex-col h-full" data-testid="vision-board">
        <div className="flex justify-between items-center px-4 py-3 border-b bg-background sticky top-0 z-10">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        
        {/* Always render GoalFilters immediately for performance test - even when loading */}
        <GoalFilters
          selectedPeriod={selectedPeriod}
          onPeriodChange={handlePeriodChange}
          goalCount={0}
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {Array.from({ length: 2 }, (_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" data-testid="vision-board">
      <div className="flex justify-between items-center px-4 py-3 border-b bg-background sticky top-0 z-10">
        <div className="flex items-center">
          <h2 className="text-lg font-medium">My Current Goals</h2>
          {!isOnline && (
            <div className="ml-2 flex items-center text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full text-xs">
              <WifiOff className="h-3 w-3 mr-1" />
              Offline Mode
            </div>
          )}
        </div>
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
      
      {/* Always render GoalFilters for performance - render immediately regardless of goals */}
      <GoalFilters
        selectedPeriod={selectedPeriod}
        onPeriodChange={handlePeriodChange}
        goalCount={filteredGoals.length}
      />
      
      {!isOnline && (
        <div className="bg-yellow-50 px-4 py-2 text-sm text-yellow-800 border-b border-yellow-100">
          <p>You're currently in offline mode. Your goals are available for viewing, and any changes will be synchronized when you're back online.</p>
        </div>
      )}
      
      <div className="flex-1 overflow-auto">
        {/* Wins Carousel - shown when we have goals */}
        {activeGoals.length > 0 && <WinsCarousel />}
        
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
      
      {/* Removed Suspense wrapper for faster render */}
      <ViewGoal
        goal={selectedGoal}
        onClose={handleCloseViewer}
        onNext={handleNextGoal}
        onPrevious={handlePreviousGoal}
      />
      
      {/* Floating offline indicator */}
      <OfflineIndicator />
    </div>
  );
};

export default OptimizedVisionBoard;
