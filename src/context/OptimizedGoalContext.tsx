
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
  const { data: goals = [], isLoading } = useOptimizedGoals();
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const invalidateGoals = () => {
    queryClient.invalidateQueries({ queryKey: ['goals', user?.id] });
  };

  const addGoalMutation = useMutation({
    mutationFn: async (newGoal: Omit<Goal, "id" | "createdAt" | "achieved" | "achievedAt">) => {
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

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      invalidateGoals();
      toast({
        title: "Goal added",
        description: "Your vision has been added to your board",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error adding goal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("user_goals")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      invalidateGoals();
      toast({
        title: "Goal removed",
        description: "Your vision has been removed from your board",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error removing goal",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: async (updatedGoal: Goal) => {
      const { error } = await supabase
        .from("user_goals")
        .update({
          image: updatedGoal.image,
          description: updatedGoal.description,
          why: updatedGoal.why || null,
          deadline: updatedGoal.deadline,
        })
        .eq("id", updatedGoal.id);

      if (error) throw error;
    },
    onSuccess: () => {
      invalidateGoals();
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
      const now = new Date().toISOString();
      const { error } = await supabase
        .from("user_goals")
        .update({
          achieved: true,
          achieved_at: now
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      invalidateGoals();
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
