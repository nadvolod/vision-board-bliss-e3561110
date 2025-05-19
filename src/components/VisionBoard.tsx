
import React, { useState } from 'react';
import { useGoals } from '../context/GoalContext';
import GoalCard from './GoalCard';
import ViewGoal from './ViewGoal';
import { Goal } from '../types';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';

const VisionBoard: React.FC = () => {
  const { goals } = useGoals();
  const [selectedGoalIndex, setSelectedGoalIndex] = useState<number | null>(null);
  
  // Filter out achieved goals for the main vision board
  const activeGoals = goals.filter(goal => !goal.achieved);
  const hasAchievedGoals = goals.some(goal => goal.achieved);
  
  const handleGoalClick = (index: number) => {
    setSelectedGoalIndex(index);
  };
  
  const handleCloseViewer = () => {
    setSelectedGoalIndex(null);
  };
  
  const handleNextGoal = () => {
    if (selectedGoalIndex === null || activeGoals.length === 0) return;
    setSelectedGoalIndex((selectedGoalIndex + 1) % activeGoals.length);
  };
  
  const handlePreviousGoal = () => {
    if (selectedGoalIndex === null || activeGoals.length === 0) return;
    setSelectedGoalIndex((selectedGoalIndex - 1 + activeGoals.length) % activeGoals.length);
  };
  
  const selectedGoal: Goal | null = 
    selectedGoalIndex !== null && activeGoals[selectedGoalIndex] 
      ? activeGoals[selectedGoalIndex] 
      : null;

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
            <div key={goal.id} className="animate-fade-in" style={{animationDelay: `${index * 0.05}s`}}>
              <GoalCard 
                goal={goal} 
                onClick={() => handleGoalClick(index)} 
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

export default VisionBoard;
