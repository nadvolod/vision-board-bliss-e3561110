
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Goal, UserGoal } from '@/types';

export const useOptimizedGoals = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['goals', user?.id],
    queryFn: async (): Promise<Goal[]> => {
      console.log('useOptimizedGoals: Fetching goals for user:', user?.id);
      
      if (!user) {
        console.log('useOptimizedGoals: No user, returning empty array');
        return [];
      }

      try {
        const { data, error } = await supabase
          .from('user_goals')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('useOptimizedGoals: Supabase error:', error);
          throw error;
        }

        console.log('useOptimizedGoals: Raw data from Supabase:', data?.length || 0, 'items');

        const mappedData = data?.map((item: UserGoal) => ({
          id: item.id,
          image: item.image,
          description: item.description,
          why: item.why || undefined,
          deadline: item.deadline,
          createdAt: item.created_at,
          achieved: item.achieved,
          achievedAt: item.achieved_at || undefined,
        })) || [];

        console.log('useOptimizedGoals: Mapped goals:', mappedData.length, 'items');
        return mappedData;
      } catch (error) {
        console.error('useOptimizedGoals: Error in queryFn:', error);
        throw error;
      }
    },
    enabled: !!user,
    staleTime: 1 * 60 * 1000, // Reduced to 1 minute for more responsive updates
    gcTime: 5 * 60 * 1000, // Reduced to 5 minutes
    refetchOnWindowFocus: true, // Enable refetch on window focus for better UX
    refetchOnMount: true, // Always refetch on mount
    retry: (failureCount, error) => {
      console.log('useOptimizedGoals: Retry attempt', failureCount, 'Error:', error);
      return failureCount < 2;
    },
  });
};
