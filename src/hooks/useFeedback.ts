import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { NPSFeedback, NPSScore, UserPreferences } from '@/types/feedback';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useFeedback = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const submitNPSFeedback = useMutation({
    mutationFn: async ({ score, feedback_text }: { score: NPSScore; feedback_text?: string }) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('nps_feedback')
        .insert({
          user_id: user.id,
          score,
          feedback_text: feedback_text || null,
        })
        .select()
        .single();

      if (error) throw error;

      // Update last NPS shown timestamp
      await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          last_nps_shown: new Date().toISOString(),
        });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-preferences', user?.id] });
    },
  });

  const { data: shouldShowNPS, isLoading: isCheckingNPS } = useQuery({
    queryKey: ['should-show-nps', user?.id],
    queryFn: async () => {
      if (!user) return false;

      const { data, error } = await supabase.rpc('should_show_nps_survey', {
        user_uuid: user.id,
      });

      if (error) throw error;
      return data as boolean;
    },
    enabled: !!user,
    refetchInterval: 60000, // Check every minute
  });

  const { data: userPreferences } = useQuery({
    queryKey: ['user-preferences', user?.id],
    queryFn: async (): Promise<UserPreferences | null> => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return {
    submitNPSFeedback,
    shouldShowNPS: shouldShowNPS && !isCheckingNPS,
    userPreferences,
    isSubmittingNPS: submitNPSFeedback.isPending,
  };
};