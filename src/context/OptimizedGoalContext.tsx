
import React, { createContext, useContext, ReactNode } from "react";
import { Goal } from "../types";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useOptimizedGoals } from '../hooks/useOptimizedGoals';

interface OptimizedGoalContextType {
  goals: Goal[];
  isLoading: boolean;
  addGoal: (goal: Omit<Goal, "id" | "createdAt" | "achieved" | "achievedAt">) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  updateGoal: (goal: Goal) => Promise<void>;
  markAsAchieved: (id: string) => Promise<void>;
  getAchievedGoals: () => Goal[];
}

const OptimizedGoalContext = createContext<OptimizedGoalContextType | undefined>(undefined);

export const useOptimizedGoalContext = () => {
  const context = useContext(OptimizedGoalContext);
  if (!context) {
    throw new Error("useOptimizedGoalContext must be used within an OptimizedGoalProvider");
  }
  return context;
};

export const OptimizedGoalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  console.log('🔄 OptimizedGoalProvider: Initializing context');
  const { data: goals = [], isLoading } = useOptimizedGoals();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const invalidateAndRefetch = () => {
    console.log('🔄 Invalidating and refetching goals cache');
    queryClient.invalidateQueries({ queryKey: ['goals', user?.id] });
    queryClient.refetchQueries({ queryKey: ['goals', user?.id] });
  };

  const addGoalMutation = useMutation({
    mutationFn: async (newGoal: Omit<Goal, "id" | "createdAt" | "achieved" | "achievedAt">) => {
      console.time('addGoal-mutation');
      console.log('➕ OptimizedGoalContext: Starting addGoal mutation');
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("user_goals")
        .insert({
          user_id: user.id,
          image: newGoal.image,
          description: newGoal.description,
          why: newGoal.why || null,
          deadline: newGoal.deadline,
          achieved: false,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ OptimizedGoalContext: Supabase error in addGoal:', error);
        console.timeEnd('addGoal-mutation');
        throw error;
      }

      console.log('✅ OptimizedGoalContext: Goal added successfully:', data);
      console.timeEnd('addGoal-mutation');
      return data;
    },
    onMutate: async (newGoal) => {
      console.time('addGoal-optimistic');
      console.log('⚡ OptimizedGoalContext: Performing optimistic update');
      await queryClient.cancelQueries({ queryKey: ['goals', user?.id] });
      
      const previousGoals = queryClient.getQueryData(['goals', user?.id]);
      
      // Create optimistic goal
      const optimisticGoal: Goal = {
        id: `temp-${Date.now()}`,
        image: newGoal.image,
        description: newGoal.description,
        why: newGoal.why,
        deadline: newGoal.deadline,
        createdAt: new Date().toISOString(),
        achieved: false,
        achievedAt: undefined,
      };
      
      queryClient.setQueryData(['goals', user?.id], (old: Goal[] | undefined) => {
        return [optimisticGoal, ...(old || [])];
      });
      
      console.timeEnd('addGoal-optimistic');
      return { previousGoals };
    },
    onSuccess: (data) => {
      console.log('✅ OptimizedGoalContext: addGoal succeeded, refreshing data');
      invalidateAndRefetch();
      toast({
        title: "Goal added",
        description: "Your vision has been added to your board",
      });
    },
    onError: (error: any, newGoal, context) => {
      console.error('💥 OptimizedGoalContext: addGoal error:', error);
      // Rollback optimistic update
      if (context?.previousGoals) {
        queryClient.setQueryData(['goals', user?.id], context.previousGoals);
      }
      toast({
        title: "Error adding goal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: async (id: string) => {
      console.time('deleteGoal-mutation');
      console.log('🗑️ OptimizedGoalContext: Deleting goal:', id);
      const { error } = await supabase
        .from("user_goals")
        .delete()
        .eq("id", id);

      if (error) {
        console.timeEnd('deleteGoal-mutation');
        throw error;
      }
      console.timeEnd('deleteGoal-mutation');
    },
    onMutate: async (deletedId) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['goals', user?.id] });
      
      const previousGoals = queryClient.getQueryData(['goals', user?.id]);
      
      queryClient.setQueryData(['goals', user?.id], (old: Goal[] | undefined) => {
        return (old || []).filter(goal => goal.id !== deletedId);
      });
      
      return { previousGoals };
    },
    onSuccess: () => {
      console.log('✅ OptimizedGoalContext: deleteGoal succeeded');
      invalidateAndRefetch();
      toast({
        title: "Goal removed",
        description: "Your vision has been removed from your board",
      });
    },
    onError: (error: any, deletedId, context) => {
      console.error('💥 OptimizedGoalContext: deleteGoal error:', error);
      // Rollback optimistic update
      if (context?.previousGoals) {
        queryClient.setQueryData(['goals', user?.id], context.previousGoals);
      }
      toast({
        title: "Error removing goal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: async (updatedGoal: Goal) => {
      console.time('updateGoal-mutation');
      const { error } = await supabase
        .from("user_goals")
        .update({
          image: updatedGoal.image,
          description: updatedGoal.description,
          why: updatedGoal.why || null,
          deadline: updatedGoal.deadline,
        })
        .eq("id", updatedGoal.id);

      if (error) {
        console.timeEnd('updateGoal-mutation');
        throw error;
      }
      console.timeEnd('updateGoal-mutation');
    },
    onSuccess: () => {
      invalidateAndRefetch();
      toast({
        title: "Goal updated",
        description: "Your vision has been updated",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating goal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const markAsAchievedMutation = useMutation({
    mutationFn: async (id: string) => {
      console.time('markAsAchieved-mutation');
      const now = new Date().toISOString();
      const { error } = await supabase
        .from("user_goals")
        .update({
          achieved: true,
          achieved_at: now
        })
        .eq("id", id);

      if (error) {
        console.timeEnd('markAsAchieved-mutation');
        throw error;
      }
      console.timeEnd('markAsAchieved-mutation');
    },
    onSuccess: () => {
      invalidateAndRefetch();
      toast({
        title: "Congratulations! 🎉",
        description: "You've achieved your goal!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error updating goal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getAchievedGoals = () => {
    return goals.filter(goal => goal.achieved);
  };

  // Wrap mutation functions to return void as expected by the interface
  const value = {
    goals,
    isLoading,
    addGoal: async (goal: Omit<Goal, "id" | "createdAt" | "achieved" | "achievedAt">) => {
      await addGoalMutation.mutateAsync(goal);
    },
    deleteGoal: async (id: string) => {
      await deleteGoalMutation.mutateAsync(id);
    },
    updateGoal: async (goal: Goal) => {
      await updateGoalMutation.mutateAsync(goal);
    },
    markAsAchieved: async (id: string) => {
      await markAsAchievedMutation.mutateAsync(id);
    },
    getAchievedGoals,
  };

  return <OptimizedGoalContext.Provider value={value}>{children}</OptimizedGoalContext.Provider>;
};
