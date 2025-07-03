export type NPSScore = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10';

export interface NPSFeedback {
  id: string;
  user_id: string;
  score: NPSScore;
  feedback_text?: string;
  created_at: string;
  updated_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  goal_id?: string | null;
  achievement_type: string;
  achievement_data?: any;
  impact_metrics?: any;
  testimonial?: string | null;
  is_featured: boolean;
  opt_in_sharing: boolean;
  created_at: string;
  updated_at: string;
}

export interface PublishedWin {
  id: string;
  achievement_id: string;
  platform: string;
  published_at: string;
  is_active: boolean;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  nps_frequency_days: number;
  last_nps_shown?: string;
  achievement_notifications: boolean;
  sharing_opt_in: boolean;
  created_at: string;
  updated_at: string;
}