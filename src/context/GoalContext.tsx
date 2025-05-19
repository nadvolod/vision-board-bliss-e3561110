
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { Goal, UserGoal } from "../types";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../integrations/supabase/client";
import { useAuth } from "./AuthContext";

interface GoalContextType {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, "id" | "createdAt">) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  updateGoal: (goal: Goal) => Promise<void>;
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
  const { toast } = useToast();
  const { user } = useAuth();

  // Load goals from Supabase when user changes
  useEffect(() => {
    const fetchGoals = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("user_goals")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          // Convert from UserGoal to Goal format
          const formattedGoals: Goal[] = data.map((item: UserGoal) => ({
            id: item.id,
            image: item.image,
            description: item.description,
            why: item.why || undefined,
            deadline: item.deadline,
            createdAt: item.created_at,
          }));
          setGoals(formattedGoals);
        }
      } catch (error: any) {
        console.error("Error fetching goals:", error.message);
        toast({
          title: "Error fetching goals",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    fetchGoals();
  }, [user, toast]);

  const addGoal = async (newGoal: Omit<Goal, "id" | "createdAt">) => {
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
        };

        setGoals([goal, ...goals]);
        toast({
          title: "Goal added",
          description: "Your vision has been added to your board",
        });
      }
    } catch (error: any) {
      console.error("Error adding goal:", error.message);
      toast({
        title: "Error adding goal",
        description: error.message,
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
    } catch (error: any) {
      console.error("Error deleting goal:", error.message);
      toast({
        title: "Error removing goal",
        description: error.message,
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
    } catch (error: any) {
      console.error("Error updating goal:", error.message);
      toast({
        title: "Error updating goal",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const value = {
    goals,
    addGoal,
    deleteGoal,
    updateGoal,
  };

  return <GoalContext.Provider value={value}>{children}</GoalContext.Provider>;
};
