
import React, { useState } from 'react';
import { useGoals } from '../context/GoalContext';
import GoalCard from './GoalCard';
import ViewGoal from './ViewGoal';
import { Goal } from '../types';

const VisionBoard: React.FC = () => {
  const { goals } = useGoals();
  const [selectedGoalIndex, setSelectedGoalIndex] = useState<number | null>(null);
  
  const handleGoalClick = (index: number) => {
    setSelectedGoalIndex(index);
  };
  
  const handleCloseViewer = () => {
    setSelectedGoalIndex(null);
  };
  
  const handleNextGoal = () => {
    if (selectedGoalIndex === null || goals.length === 0) return;
    setSelectedGoalIndex((selectedGoalIndex + 1) % goals.length);
  };
  
  const handlePreviousGoal = () => {
    if (selectedGoalIndex === null || goals.length === 0) return;
    setSelectedGoalIndex((selectedGoalIndex - 1 + goals.length) % goals.length);
  };
  
  const selectedGoal: Goal | null = 
    selectedGoalIndex !== null && goals[selectedGoalIndex] 
      ? goals[selectedGoalIndex] 
      : null;

  return (
    <>
      {goals.length === 0 ? (
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
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {goals.map((goal, index) => (
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
