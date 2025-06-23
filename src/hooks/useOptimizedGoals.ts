
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Goal, UserGoal } from '@/types';

export const useOptimizedGoals = () => {
  const { user } = useAuth();
  
  console.time('useOptimizedGoals-total');

  return useQuery({
    queryKey: ['goals', user?.id],
    queryFn: async (): Promise<Goal[]> => {
      console.time('useOptimizedGoals-fetch');
      console.log('🚀 useOptimizedGoals: Starting fetch for user:', user?.id);
      
      if (!user) {
        console.log('⚠️ useOptimizedGoals: No user, returning empty array');
        console.timeEnd('useOptimizedGoals-fetch');
        return [];
      }

      try {
        console.time('supabase-query');
        const { data, error } = await supabase
          .from('user_goals')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        console.timeEnd('supabase-query');

        if (error) {
          console.error('❌ useOptimizedGoals: Supabase error:', error);
          console.timeEnd('useOptimizedGoals-fetch');
          throw error;
        }

        console.log(`✅ useOptimizedGoals: Raw data from Supabase: ${data?.length || 0} items`);

        console.time('data-mapping');
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
        console.timeEnd('data-mapping');

        console.log(`🎯 useOptimizedGoals: Mapped goals: ${mappedData.length} items`);
        console.timeEnd('useOptimizedGoals-fetch');
        console.timeEnd('useOptimizedGoals-total');
        return mappedData;
      } catch (error) {
        console.error('💥 useOptimizedGoals: Error in queryFn:', error);
        console.timeEnd('useOptimizedGoals-fetch');
        console.timeEnd('useOptimizedGoals-total');
        throw error;
      }
    },
    enabled: !!user,
    staleTime: 30 * 1000, // 30 seconds - fresh data
    gcTime: 2 * 60 * 1000, // 2 minutes cache
    refetchOnWindowFocus: false, // Disable to improve performance
    refetchOnMount: false, // Only fetch if stale
    refetchOnReconnect: true,
    retry: (failureCount, error) => {
      console.log(`🔄 useOptimizedGoals: Retry attempt ${failureCount}. Error:`, error);
      return failureCount < 2;
    },
  });
};
