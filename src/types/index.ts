
export interface Goal {
  id: string;
  image: string;
  description: string;
  why?: string;
  deadline: string;
  createdAt: string;
  achieved: boolean;
  achievedAt?: string;
}

export interface UserGoal {
  id: string;
  user_id: string;
  image: string;
  description: string;
  why: string | null;
  deadline: string;
  created_at: string;
  achieved: boolean;
  achieved_at: string | null;
}

export interface AuthUser {
  id: string;
  email: string;
}
