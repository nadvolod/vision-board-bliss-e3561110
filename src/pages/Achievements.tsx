
import React from 'react';
import { useGoals } from '../context/GoalContext';
import { format, parseISO, isValid } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Achievements: React.FC = () => {
  const { getAchievedGoals } = useGoals();
  const achievedGoals = getAchievedGoals();

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Unknown date';
    try {
      const date = parseISO(dateStr);
      return isValid(date) ? format(date, 'MMMM d, yyyy') : 'Invalid date';
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-vision-purple to-vision-teal bg-clip-text text-transparent">
          My Achievements
        </h1>
        <Link to="/app">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Back to Vision Board
          </Button>
        </Link>
      </div>
      
      {achievedGoals.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <div className="text-center max-w-md animate-float">
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-vision-purple to-vision-teal bg-clip-text text-transparent">
              No Achievements Yet
            </h2>
            <p className="text-muted-foreground mb-4">
              When you mark goals as achieved, they'll appear here so you can celebrate your progress!
            </p>
            <div className="opacity-40 text-center">
              <p className="text-6xl mb-2">🏆</p>
              <p className="text-sm">Your achievements will be displayed here</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievedGoals.map((goal) => (
            <Card key={goal.id} className="overflow-hidden h-full flex flex-col">
              <div className="h-48 overflow-hidden">
                <img 
                  src={goal.image} 
                  alt={goal.description}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{goal.description}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                {goal.why && (
                  <p className="text-sm text-muted-foreground mb-4">
                    <span className="font-medium">Why it mattered:</span> {goal.why}
                  </p>
                )}
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-green-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Achieved on: {formatDate(goal.achievedAt)}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Target date: {formatDate(goal.deadline)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Achievements;
