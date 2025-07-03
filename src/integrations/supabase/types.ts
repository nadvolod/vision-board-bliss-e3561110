export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      nps_feedback: {
        Row: {
          created_at: string
          feedback_text: string | null
          id: string
          score: Database["public"]["Enums"]["nps_score"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feedback_text?: string | null
          id?: string
          score: Database["public"]["Enums"]["nps_score"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          feedback_text?: string | null
          id?: string
          score?: Database["public"]["Enums"]["nps_score"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      published_wins: {
        Row: {
          achievement_id: string
          id: string
          is_active: boolean | null
          platform: string
          published_at: string
        }
        Insert: {
          achievement_id: string
          id?: string
          is_active?: boolean | null
          platform: string
          published_at?: string
        }
        Update: {
          achievement_id?: string
          id?: string
          is_active?: boolean | null
          platform?: string
          published_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "published_wins_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "user_achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_data: Json | null
          achievement_type: string
          created_at: string
          goal_id: string | null
          id: string
          impact_metrics: Json | null
          is_featured: boolean | null
          opt_in_sharing: boolean | null
          testimonial: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          achievement_data?: Json | null
          achievement_type: string
          created_at?: string
          goal_id?: string | null
          id?: string
          impact_metrics?: Json | null
          is_featured?: boolean | null
          opt_in_sharing?: boolean | null
          testimonial?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          achievement_data?: Json | null
          achievement_type?: string
          created_at?: string
          goal_id?: string | null
          id?: string
          impact_metrics?: Json | null
          is_featured?: boolean | null
          opt_in_sharing?: boolean | null
          testimonial?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_goals: {
        Row: {
          achieved: boolean
          achieved_at: string | null
          created_at: string
          deadline: string
          description: string
          id: string
          image: string
          user_id: string
          why: string | null
        }
        Insert: {
          achieved?: boolean
          achieved_at?: string | null
          created_at?: string
          deadline: string
          description: string
          id?: string
          image: string
          user_id: string
          why?: string | null
        }
        Update: {
          achieved?: boolean
          achieved_at?: string | null
          created_at?: string
          deadline?: string
          description?: string
          id?: string
          image?: string
          user_id?: string
          why?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          achievement_notifications: boolean | null
          created_at: string
          id: string
          last_nps_shown: string | null
          nps_frequency_days: number | null
          sharing_opt_in: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          achievement_notifications?: boolean | null
          created_at?: string
          id?: string
          last_nps_shown?: string | null
          nps_frequency_days?: number | null
          sharing_opt_in?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          achievement_notifications?: boolean | null
          created_at?: string
          id?: string
          last_nps_shown?: string | null
          nps_frequency_days?: number | null
          sharing_opt_in?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_total_achieved_goals: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      should_show_nps_survey: {
        Args: { user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      nps_score:
        | "0"
        | "1"
        | "2"
        | "3"
        | "4"
        | "5"
        | "6"
        | "7"
        | "8"
        | "9"
        | "10"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      nps_score: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    },
  },
} as const
