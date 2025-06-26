import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Goal, UserGoal } from '@/types';
import { useQuery } from '@tanstack/react-query';

export const useOptimizedGoals = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['goals', user?.id],
    queryFn: async (): Promise<Goal[]> => {
      if (!user) {
        return [];
      }

      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

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

      return mappedData;
    },
    enabled: !!user,
    // More aggressive caching for faster loads
    staleTime: 10 * 60 * 1000, // 10 minutes - data stays fresh longer
    gcTime: 60 * 60 * 1000, // 1 hour cache
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false, // Don't refetch on reconnect for faster loads
    retry: 1, // Reduce retries for faster fail-fast
    retryDelay: 1000, // Faster retry
    // Enable placeholderData for instant loading
    placeholderData: [],
  });
};
