
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Goal, UserGoal } from '@/types';

export const useOptimizedGoals = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['goals', user?.id],
    queryFn: async (): Promise<Goal[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map((item: UserGoal) => ({
        id: item.id,
        image: item.image,
        description: item.description,
        why: item.why || undefined,
        deadline: item.deadline,
        createdAt: item.created_at,
        achieved: item.achieved,
        achievedAt: item.achieved_at || undefined,
      })) || [];
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
