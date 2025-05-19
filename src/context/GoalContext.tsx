
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { Goal } from "../types";
import { useToast } from "@/components/ui/use-toast";

interface GoalContextType {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, "id" | "createdAt">) => void;
  deleteGoal: (id: string) => void;
  updateGoal: (goal: Goal) => void;
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

  useEffect(() => {
    // Load goals from localStorage on component mount
    const savedGoals = localStorage.getItem("visionBoardGoals");
    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals));
      } catch (error) {
        console.error("Error parsing goals from localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    // Save goals to localStorage whenever they change
    localStorage.setItem("visionBoardGoals", JSON.stringify(goals));
  }, [goals]);

  const addGoal = (newGoal: Omit<Goal, "id" | "createdAt">) => {
    const goal: Goal = {
      ...newGoal,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    setGoals([...goals, goal]);
    toast({
      title: "Goal added",
      description: "Your vision has been added to your board",
    });
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter((goal) => goal.id !== id));
    toast({
      title: "Goal removed",
      description: "Your vision has been removed from your board",
    });
  };

  const updateGoal = (updatedGoal: Goal) => {
    setGoals(goals.map((goal) => (goal.id === updatedGoal.id ? updatedGoal : goal)));
    toast({
      title: "Goal updated",
      description: "Your vision has been updated",
    });
  };

  const value = {
    goals,
    addGoal,
    deleteGoal,
    updateGoal,
  };

  return <GoalContext.Provider value={value}>{children}</GoalContext.Provider>;
};
