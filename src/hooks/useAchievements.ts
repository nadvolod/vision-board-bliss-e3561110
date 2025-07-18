import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UserAchievement } from '@/types/feedback';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useAchievements = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const createAchievement = useMutation({
    mutationFn: async (achievement: Omit<UserAchievement, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement_type: achievement.achievement_type,
          goal_id: achievement.goal_id || null,
          achievement_data: achievement.achievement_data as any,
          impact_metrics: achievement.impact_metrics as any,
          is_featured: achievement.is_featured,
          opt_in_sharing: achievement.opt_in_sharing,
          testimonial: achievement.testimonial || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-achievements', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['featured-achievements'] });
    },
  });

  const updateAchievement = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<UserAchievement> }) => {
      const { data, error } = await supabase
        .from('user_achievements')
        .update({
          ...updates,
          achievement_data: updates.achievement_data as any,
          impact_metrics: updates.impact_metrics as any,
        } as any)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-achievements', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['featured-achievements'] });
    },
  });

  const { data: userAchievements = [], isLoading } = useQuery({
    queryKey: ['user-achievements', user?.id],
    queryFn: async (): Promise<UserAchievement[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as UserAchievement[];
    },
    enabled: !!user,
  });

  const { data: featuredAchievements = [] } = useQuery({
    queryKey: ['featured-achievements'],
    queryFn: async (): Promise<UserAchievement[]> => {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('is_featured', true)
        .eq('opt_in_sharing', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return (data || []) as UserAchievement[];
    },
  });

  // Auto-create achievement when goal is marked as achieved
  const handleGoalAchievement = async (goalId: string, goalDescription: string) => {
    if (!user) return;

    const achievementData = {
      goal_id: goalId,
      achievement_type: 'goal_completed',
      achievement_data: {
        goal_description: goalDescription,
        completed_at: new Date().toISOString(),
      },
      is_featured: false,
      opt_in_sharing: false,
    };

    createAchievement.mutate(achievementData);
  };

  return {
    userAchievements,
    featuredAchievements,
    createAchievement,
    updateAchievement,
    handleGoalAchievement,
    isLoading,
  };
};