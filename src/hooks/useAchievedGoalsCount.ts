
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

export const useAchievedGoalsCount = () => {
  const [count, setCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAchievedGoalsCount = async () => {
      try {
        const { data, error } = await supabase.rpc('get_total_achieved_goals');
        
        if (error) {
          console.error('Error fetching achieved goals count:', error);
          return;
        }

        setCount(data || 0);
      } catch (error: unknown) {
        console.error('Error fetching achieved goals count:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAchievedGoalsCount();
  }, []);

  return { count, isLoading };
};
