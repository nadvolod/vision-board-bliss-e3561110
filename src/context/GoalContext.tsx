import { useToast } from "@/components/ui/use-toast";
import { PostgrestError } from '@supabase/supabase-js';
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { supabase } from "../integrations/supabase/client";
import { Goal, UserGoal } from "../types";
import { useAuth } from "./AuthContext";

interface GoalContextType {
  goals: Goal[];
  isLoading: boolean;
  addGoal: (goal: Omit<Goal, "id" | "createdAt" | "achieved" | "achievedAt">) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  updateGoal: (goal: Goal) => Promise<void>;
  markAsAchieved: (id: string) => Promise<void>;
  getAchievedGoals: () => Goal[];
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const useGoals = () => {
  const context = useContext(GoalContext);
  if (!context) {
    throw new Error("useGoals must be used within a GoalProvider");
  }
  return context;
};

export const GoalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load goals from Supabase when user changes
  useEffect(() => {
    const fetchGoals = async () => {
      if (!user) {
        setGoals([]);
        setIsLoading(false);
        return;
      }

      try {
        console.log("Fetching goals for user:", user.id);
        
        const { data, error } = await supabase
          .from("user_goals")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          console.log("Goals fetched:", data.length);
          // Convert from UserGoal to Goal format
          const formattedGoals: Goal[] = data.map((item: UserGoal) => ({
            id: item.id,
            image: item.image,
            description: item.description,
            why: item.why || undefined,
            deadline: item.deadline,
            createdAt: item.created_at,
            achieved: item.achieved,
            achievedAt: item.achieved_at || undefined,
          }));
          setGoals(formattedGoals);
        }
      } catch (error: unknown) {
        const dbError = error as PostgrestError;
        console.error("Error fetching goals:", dbError.message);
        toast({
          title: "Error fetching goals",
          description: dbError.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoals();
  }, [user, toast]);

  const addGoal = async (newGoal: Omit<Goal, "id" | "createdAt" | "achieved" | "achievedAt">) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add goals",
        variant: "destructive",
      });
      return;
    }

    try {
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
        throw error;
      }

      if (data) {
        const goal: Goal = {
          id: data.id,
          image: data.image,
          description: data.description,
          why: data.why || undefined,
          deadline: data.deadline,
          createdAt: data.created_at,
          achieved: data.achieved,
          achievedAt: data.achieved_at || undefined,
        };

        setGoals([goal, ...goals]);
        toast({
          title: "Goal added",
          description: "Your vision has been added to your board",
        });
      }
    } catch (error: unknown) {
      console.error('Error creating goal:', error);
      const dbError = error as PostgrestError;
      toast({
        title: "Error adding goal",
        description: dbError.message,
        variant: "destructive",
      });
    }
  };

  const deleteGoal = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("user_goals")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      setGoals(goals.filter((goal) => goal.id !== id));
      toast({
        title: "Goal removed",
        description: "Your vision has been removed from your board",
      });
    } catch (error: unknown) {
      console.error('Error deleting goal:', error);
      const dbError = error as PostgrestError;
      toast({
        title: "Error removing goal",
        description: dbError.message,
        variant: "destructive",
      });
    }
  };

  const updateGoal = async (updatedGoal: Goal) => {
    if (!user) return;

    try {
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
        throw error;
      }

      setGoals(goals.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal)));
      toast({
        title: "Goal updated",
        description: "Your vision has been updated",
      });
    } catch (error: unknown) {
      console.error('Error updating goal:', error);
      const dbError = error as PostgrestError;
      toast({
        title: "Error updating goal",
        description: dbError.message,
        variant: "destructive",
      });
    }
  };

  const markAsAchieved = async (id: string) => {
    if (!user) return;

    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from("user_goals")
        .update({
          achieved: true,
          achieved_at: now
        })
        .eq("id", id);

      if (error) {
        throw error;
      }

      // Update local state
      setGoals(goals.map((goal) => {
        if (goal.id === id) {
          return { ...goal, achieved: true, achievedAt: now };
        }
        return goal;
      }));

      toast({
        title: "Congratulations! 🎉",
        description: "You've achieved your goal!",
      });
    } catch (error: unknown) {
      console.error('Error marking goal as achieved:', error);
      const dbError = error as PostgrestError;
      toast({
        title: "Error updating goal",
        description: dbError.message,
        variant: "destructive",
      });
    }
  };

  const getAchievedGoals = () => {
    return goals.filter(goal => goal.achieved);
  };

  const value = {
    goals,
    isLoading,
    addGoal,
    deleteGoal,
    updateGoal,
    markAsAchieved,
    getAchievedGoals,
  };

  return <GoalContext.Provider value={value}>{children}</GoalContext.Provider>;
};
