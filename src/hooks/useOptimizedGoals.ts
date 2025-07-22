import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { getGoalsFromLocalStorage, saveGoalsToLocalStorage } from '@/lib/offlineStorage';
import { Goal, UserGoal } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useOnlineStatus } from './useOnlineStatus';

export const useOptimizedGoals = () => {
  const { user } = useAuth();
  const isOnline = useOnlineStatus();

  return useQuery({
    queryKey: ['goals', user?.id], // Remove isOnline from key to prevent cache invalidation on network changes
    queryFn: async (): Promise<Goal[]> => {
      if (!user) {
        return [];
      }

      // If offline, get goals from local storage
      if (!isOnline) {
        console.log('Offline mode: Loading goals from local storage');
        const localGoals = getGoalsFromLocalStorage(user.id);
        return localGoals;
      }

      try {
        // Ultra-fast database query with minimal fields and optimized for speed
        const { data, error } = await supabase
          .from('user_goals')
          .select('id, image, description, why, deadline, created_at, achieved, achieved_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50); // Increased limit to ensure we have all goals for offline use

        if (error) {
          throw error;
        }

        // Ultra-fast mapping - inline return for maximum speed
        const mappedGoals = data?.map((item: UserGoal): Goal => ({
          id: item.id,
          image: item.image,
          description: item.description,
          why: item.why || undefined,
          deadline: item.deadline,
          createdAt: item.created_at,
          achieved: item.achieved,
          achievedAt: item.achieved_at || undefined,
        })) || [];

        // Save goals to local storage for offline use
        if (mappedGoals.length > 0) {
          saveGoalsToLocalStorage(mappedGoals, user.id);
        }

        return mappedGoals;
      } catch (error: unknown) {
        console.error('Error fetching goals from Supabase:', error);
        
        // Fallback to local storage if online fetch fails
        const localGoals = getGoalsFromLocalStorage(user.id);
        if (localGoals.length > 0) {
          console.log('Fallback to local storage after online fetch failure');
          return localGoals;
        }
        
        // Return empty array instead of placeholder goals
        return [];
      }
    },
    // Enable query immediately when user is available
    enabled: !!user,
    // Use default settings from QueryClient for consistent behavior
    // This ensures cached data is used immediately for faster loads
  });
};
