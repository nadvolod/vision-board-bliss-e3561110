
import React from 'react';
import { Trophy } from 'lucide-react';
import { useAchievedGoalsCount } from '@/hooks/useAchievedGoalsCount';
import { Skeleton } from '@/components/ui/skeleton';

const AchievementCounter: React.FC = () => {
  const { count, isLoading } = useAchievedGoalsCount();

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <Trophy className="h-8 w-8 text-vision-yellow mx-auto mb-3" />
        <h3 className="text-lg font-semibold mb-2">Goals Achieved Worldwide</h3>
        <Skeleton className="h-8 w-16 mx-auto" />
        <p className="text-sm text-gray-600 mt-2">Dreams turned into reality</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
      <Trophy className="h-8 w-8 text-vision-yellow mx-auto mb-3" />
      <h3 className="text-lg font-semibold mb-2">Goals Achieved Worldwide</h3>
      <div className="text-3xl font-bold text-vision-purple mb-2">
        {count?.toLocaleString() || '0'}
      </div>
      <p className="text-sm text-gray-600">Dreams turned into reality</p>
    </div>
  );
};

export default AchievementCounter;
