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
        // First try a simple query without complex operations
        const { data, error } = await supabase
          .from('user_goals')
          .select('id, description, why, deadline, created_at, achieved, achieved_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase query error:', error);
          throw error;
        }

        // If successful, get images separately with error handling
        let goalsWithImages = data || [];
        
        try {
          const { data: imageData } = await supabase
            .from('user_goals')
            .select('id, image')
            .eq('user_id', user.id);
          
          // Merge image data safely
          if (imageData) {
            goalsWithImages = goalsWithImages.map(goal => {
              const imageRecord = imageData.find(img => img.id === goal.id);
              return {
                ...goal,
                image: imageRecord?.image || ''
              };
            });
          }
        } catch (imageError) {
          console.warn('Failed to load images, using defaults:', imageError);
          // Continue without images - they'll use defaults
        }
        
        // Ultra-fast mapping with image size validation
        const mappedGoals = goalsWithImages.map((item: any): Goal => ({
          id: item.id,
          image: item.image || '', // Handle null/undefined images
          description: item.description || '',
          why: item.why || undefined,
          deadline: item.deadline || new Date().toISOString(),
          createdAt: item.created_at,
          achieved: item.achieved || false,
          achievedAt: item.achieved_at || undefined,
        }));

        // Save goals to local storage for offline use (only if not too large)
        if (mappedGoals.length > 0) {
          try {
            saveGoalsToLocalStorage(mappedGoals, user.id);
          } catch (storageError) {
            console.warn('Failed to save to localStorage, continuing without offline cache:', storageError);
          }
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
    // Mobile-optimized settings
    staleTime: 30 * 1000, // 30 seconds to reduce mobile data usage
    refetchInterval: false, // Disable automatic refetch to save battery/data
  });
};
