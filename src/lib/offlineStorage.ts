import { Goal } from "@/types";

const GOALS_STORAGE_KEY = 'vision-board-goals';
const LAST_SYNC_KEY = 'vision-board-last-sync';

/**
 * Save goals to local storage
 */
export const saveGoalsToLocalStorage = (goals: Goal[], userId: string): void => {
  try {
    // Filter out goals with large images to prevent quota exceeded errors
    const filteredGoals = goals.map(goal => ({
      ...goal,
      // Only keep small images or convert large ones to placeholder
      image: goal.image && goal.image.length > 50000 ? '' : goal.image
    }));
    
    const storageData = {
      userId,
      goals: filteredGoals,
      timestamp: new Date().toISOString()
    };
    
    const dataString = JSON.stringify(storageData);
    
    // Check if the data is too large (5MB limit for localStorage)
    if (dataString.length > 5 * 1024 * 1024) {
      console.warn('Data too large for localStorage, keeping only essential data');
      // Keep only essential data without images
      const essentialData = {
        userId,
        goals: filteredGoals.map(goal => ({
          ...goal,
          image: '' // Remove all images if still too large
        })),
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(essentialData));
    } else {
      localStorage.setItem(GOALS_STORAGE_KEY, dataString);
    }
    
    localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
  } catch (error: unknown) {
    console.error('Error saving goals to local storage:', error);
    // Try to save without images as fallback
    try {
      const fallbackData = {
        userId,
        goals: goals.map(goal => ({ ...goal, image: '' })),
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(fallbackData));
    } catch (fallbackError) {
      console.error('Failed to save even without images:', fallbackError);
    }
  }
};

/**
 * Get goals from local storage
 */
export const getGoalsFromLocalStorage = (userId: string): Goal[] => {
  try {
    const storageData = localStorage.getItem(GOALS_STORAGE_KEY);
    if (!storageData) return [];
    
    const parsedData = JSON.parse(storageData);
    
    // Only return goals if they belong to the current user
    if (parsedData.userId === userId) {
      return parsedData.goals;
    }
    
    return [];
  } catch (error: unknown) {
    console.error('Error retrieving goals from local storage:', error);
    return [];
  }
};

/**
 * Add a new goal to local storage
 */
export const addGoalToLocalStorage = (
  goal: Goal, 
  userId: string
): void => {
  try {
    const existingGoals = getGoalsFromLocalStorage(userId);
    const updatedGoals = [goal, ...existingGoals];
    saveGoalsToLocalStorage(updatedGoals, userId);
  } catch (error: unknown) {
    console.error('Error adding goal to local storage:', error);
  }
};

/**
 * Update a goal in local storage
 */
export const updateGoalInLocalStorage = (
  updatedGoal: Goal, 
  userId: string
): void => {
  try {
    const existingGoals = getGoalsFromLocalStorage(userId);
    const updatedGoals = existingGoals.map(goal => 
      goal.id === updatedGoal.id ? updatedGoal : goal
    );
    saveGoalsToLocalStorage(updatedGoals, userId);
  } catch (error: unknown) {
    console.error('Error updating goal in local storage:', error);
  }
};

/**
 * Delete a goal from local storage
 */
export const deleteGoalFromLocalStorage = (
  goalId: string, 
  userId: string
): void => {
  try {
    const existingGoals = getGoalsFromLocalStorage(userId);
    const updatedGoals = existingGoals.filter(goal => goal.id !== goalId);
    saveGoalsToLocalStorage(updatedGoals, userId);
  } catch (error: unknown) {
    console.error('Error deleting goal from local storage:', error);
  }
};

/**
 * Mark a goal as achieved in local storage
 */
export const markGoalAsAchievedInLocalStorage = (
  goalId: string, 
  userId: string
): void => {
  try {
    const existingGoals = getGoalsFromLocalStorage(userId);
    const now = new Date().toISOString();
    
    const updatedGoals = existingGoals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          achieved: true,
          achievedAt: now
        };
      }
      return goal;
    });
    
    saveGoalsToLocalStorage(updatedGoals, userId);
  } catch (error: unknown) {
    console.error('Error marking goal as achieved in local storage:', error);
  }
};

/**
 * Mark a goal as not completed in local storage
 */
export const markGoalAsNotCompletedInLocalStorage = (
  goalId: string, 
  userId: string
): void => {
  try {
    const existingGoals = getGoalsFromLocalStorage(userId);
    
    const updatedGoals = existingGoals.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          achieved: false,
          achievedAt: undefined
        };
      }
      return goal;
    });
    
    saveGoalsToLocalStorage(updatedGoals, userId);
  } catch (error) {
    console.error('Error marking goal as not completed in local storage:', error);
  }
};

/**
 * Check if the device is online
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};

/**
 * Get the last sync timestamp
 */
export const getLastSyncTime = (): string | null => {
  return localStorage.getItem(LAST_SYNC_KEY);
};