import { useOptimizedGoalContext } from '@/context/OptimizedGoalContext';
import { WifiOff } from 'lucide-react';
import React from 'react';

const OfflineIndicator: React.FC = () => {
  const { isOnline } = useOptimizedGoalContext();

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full shadow-md flex items-center gap-2 z-50">
      <WifiOff className="h-4 w-4" />
      <span className="text-sm font-medium">Offline Mode</span>
    </div>
  );
};

export default OfflineIndicator;