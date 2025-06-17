
import React, { useState, useMemo, useCallback } from 'react';
import { useOptimizedGoals } from '../hooks/useOptimizedGoals';
import OptimizedGoalCard from './OptimizedGoalCard';
import ViewGoal from './ViewGoal';
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
  const { data: goals = [], isLoading } = useOptimizedGoals();
  const [selectedGoalIndex, setSelectedGoalIndex] = useState<number | null>(null);
  
  const { activeGoals, hasAchievedGoals } = useMemo(() => {
    const active = goals.filter(goal => !goal.achieved);
    const hasAchieved = goals.some(goal => goal.achieved);
    return { activeGoals: active, hasAchievedGoals: hasAchieved };
  }, [goals]);
  
  const handleGoalClick = useCallback((index: number) => {
    setSelectedGoalIndex(index);
  }, []);
  
  const handleCloseViewer = useCallback(() => {
    setSelectedGoalIndex(null);
  }, []);
  
  const handleNextGoal = useCallback(() => {
    if (selectedGoalIndex === null || activeGoals.length === 0) return;
    setSelectedGoalIndex((selectedGoalIndex + 1) % activeGoals.length);
  }, [selectedGoalIndex, activeGoals.length]);
  
  const handlePreviousGoal = useCallback(() => {
    if (selectedGoalIndex === null || activeGoals.length === 0) return;
    setSelectedGoalIndex((selectedGoalIndex - 1 + activeGoals.length) % activeGoals.length);
  }, [selectedGoalIndex, activeGoals.length]);
  
  const selectedGoal: Goal | null = useMemo(() => 
    selectedGoalIndex !== null && activeGoals[selectedGoalIndex] 
      ? activeGoals[selectedGoalIndex] 
      : null
  , [selectedGoalIndex, activeGoals]);

  if (isLoading) {
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {activeGoals.map((goal, index) => (
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
