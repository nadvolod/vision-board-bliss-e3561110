import { useToast } from "@/components/ui/use-toast";
import { PostgrestError } from '@supabase/supabase-js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { createContext, ReactNode, useContext } from "react";
import { useOptimizedGoals } from '../hooks/useOptimizedGoals';
import { supabase } from "../integrations/supabase/client";
import { Goal } from "../types";
import { useAuth } from "./AuthContext";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { 
  addGoalToLocalStorage, 
  deleteGoalFromLocalStorage, 
  markGoalAsAchievedInLocalStorage, 
  updateGoalInLocalStorage 
} from "@/lib/offlineStorage";
import { v4 as uuidv4 } from 'uuid';

interface OptimizedGoalContextType {
  goals: Goal[];
  isLoading: boolean;
  isOnline: boolean;
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
  const isOnline = useOnlineStatus();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['goals', user?.id, isOnline] });
  };

  const addGoalMutation = useMutation({
    mutationFn: async (newGoal: Omit<Goal, "id" | "createdAt" | "achieved" | "achievedAt">) => {
      if (!user) throw new Error("User not authenticated");

      // If offline, add to local storage only
      if (!isOnline) {
        const now = new Date().toISOString();
        const offlineGoal: Goal = {
          id: `offline-${uuidv4()}`,
          image: newGoal.image,
          description: newGoal.description,
          why: newGoal.why,
          deadline: newGoal.deadline,
          createdAt: now,
          achieved: false,
        };
        
        addGoalToLocalStorage(offlineGoal, user.id);
        return offlineGoal;
      }

      // If online, add to Supabase
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
      
      // Also add to local storage for offline access
      const mappedGoal: Goal = {
        id: data.id,
        image: data.image,
        description: data.description,
        why: data.why || undefined,
        deadline: data.deadline,
        createdAt: data.created_at,
        achieved: data.achieved,
        achievedAt: data.achieved_at || undefined,
      };
      
      addGoalToLocalStorage(mappedGoal, user.id);
      return data;
    },
    onSuccess: () => {
      invalidateQueries();
      toast({
        title: "Goal added",
        description: "Your vision has been added to your board",
      });
    },
    onError: (error) => {
      const dbError = error as PostgrestError;
      toast({
        title: "Error adding goal",
        description: isOnline ? dbError.message : "Failed to add goal while offline",
        variant: "destructive",
      });
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("User not authenticated");

      // Always update local storage
      deleteGoalFromLocalStorage(id, user.id);
      
      // If offline, only update local storage
      if (!isOnline) {
        return { success: true };
      }

      // If online, update Supabase
      const { error } = await supabase
        .from("user_goals")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      invalidateQueries();
      toast({
        title: "Goal removed",
        description: "Your vision has been removed from your board",
      });
    },
    onError: (error) => {
      const dbError = error as PostgrestError;
      toast({
        title: "Error removing goal",
        description: isOnline ? dbError.message : "Failed to remove goal while offline",
        variant: "destructive",
      });
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: async (updatedGoal: Goal) => {
      if (!user) throw new Error("User not authenticated");

      // Always update local storage
      updateGoalInLocalStorage(updatedGoal, user.id);
      
      // If offline, only update local storage
      if (!isOnline) {
        return { success: true };
      }

      // If online, update Supabase
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
      return { success: true };
    },
    onSuccess: () => {
      invalidateQueries();
      toast({
        title: "Goal updated",
        description: "Your vision has been updated",
      });
    },
    onError: (error) => {
      const dbError = error as PostgrestError;
      toast({
        title: "Error updating goal",
        description: isOnline ? dbError.message : "Failed to update goal while offline",
        variant: "destructive",
      });
    },
  });

  const markAsAchievedMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user) throw new Error("User not authenticated");
      const now = new Date().toISOString();
      
      // Always update local storage
      markGoalAsAchievedInLocalStorage(id, user.id);
      
      // If offline, only update local storage
      if (!isOnline) {
        return { success: true };
      }
      
      // Get the goal details before marking as achieved
      const { data: goalData } = await supabase
        .from("user_goals")
        .select("description")
        .eq("id", id)
        .single();

      const { error } = await supabase
        .from("user_goals")
        .update({
          achieved: true,
          achieved_at: now
        })
        .eq("id", id);

      if (error) throw error;

      // Create achievement record
      if (goalData && user) {
        await supabase
          .from("user_achievements")
          .insert({
            user_id: user.id,
            goal_id: id,
            achievement_type: "goal_completed",
            achievement_data: {
              goal_description: goalData.description,
              completed_at: now,
            },
            is_featured: false,
            opt_in_sharing: false,
          });
      }
      
      return { success: true };
    },
    onSuccess: () => {
      invalidateQueries();
      if (isOnline) {
        queryClient.invalidateQueries({ queryKey: ['user-achievements', user?.id] });
        queryClient.invalidateQueries({ queryKey: ['featured-achievements'] });
      }
      toast({
        title: "Congratulations! 🎉",
        description: "You've achieved your goal! 🎊",
      });
    },
    onError: (error) => {
      const dbError = error as PostgrestError;
      toast({
        title: "Error updating goal",
        description: isOnline ? dbError.message : "Failed to mark goal as achieved while offline",
        variant: "destructive",
      });
    },
  });

  const getAchievedGoals = () => {
    return goals.filter(goal => goal.achieved);
  };

  const value = {
    goals,
    isLoading,
    isOnline,
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
