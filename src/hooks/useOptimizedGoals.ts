import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { getGoalsFromLocalStorage, saveGoalsToLocalStorage } from '@/lib/offlineStorage';
import { Goal, UserGoal } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useOnlineStatus } from './useOnlineStatus';

// Placeholder goals for instant initial rendering while real data loads
const PLACEHOLDER_GOALS: Goal[] = [
  {
    id: 'placeholder-1',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400&auto=format&fit=crop&q=60',
    description: 'Master React development',
    why: 'To build amazing user interfaces',
    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    achieved: false,
  },
  {
    id: 'placeholder-2',
    image: 'https://images.unsplash.com/photo-1617912187990-804dd1618f8d?w=400&auto=format&fit=crop&q=60',
    description: 'Run a marathon',
    why: 'To improve health and endurance',
    deadline: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    achieved: false,
  }
];

export const useOptimizedGoals = () => {
  const { user } = useAuth();
  const isOnline = useOnlineStatus();

  return useQuery({
    queryKey: ['goals', user?.id, isOnline],
    queryFn: async (): Promise<Goal[]> => {
      if (!user) {
        return [];
      }

      // If offline, get goals from local storage
      if (!isOnline) {
        console.log('Offline mode: Loading goals from local storage');
        return getGoalsFromLocalStorage(user.id);
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
      } catch (error) {
        console.error('Error fetching goals from Supabase:', error);
        
        // Fallback to local storage if online fetch fails
        const localGoals = getGoalsFromLocalStorage(user.id);
        if (localGoals.length > 0) {
          console.log('Fallback to local storage after online fetch failure');
          return localGoals;
        }
        
        throw error;
      }
    },
    // Enable query immediately when user is available
    enabled: !!user,
    // Provide instant placeholder data for immediate rendering
    initialData: user ? PLACEHOLDER_GOALS : [],
    // Ultra-aggressive caching for instant loads
    staleTime: 0, // Always consider data fresh for instant cache hits
    gcTime: 30 * 60 * 1000, // 30 minutes cache retention
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Allow initial fetch to replace placeholder data
    refetchOnReconnect: true, // Refetch when reconnecting to ensure data is synced
    retry: 1, // Allow one retry for better offline resilience
    retryDelay: 1000,
    // Enable offline support
    networkMode: 'always',
    // Provide empty array for instant UI rendering
    placeholderData: [],
  });
};
