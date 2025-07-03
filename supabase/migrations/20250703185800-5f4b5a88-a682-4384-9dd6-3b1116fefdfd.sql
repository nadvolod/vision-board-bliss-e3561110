-- Create enum for NPS response types
CREATE TYPE public.nps_score AS ENUM ('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10');

-- Create NPS feedback table
CREATE TABLE public.nps_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  score nps_score NOT NULL,
  feedback_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create achievement tracking table
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  goal_id UUID,
  achievement_type TEXT NOT NULL, -- 'goal_completed', 'milestone_reached', etc.
  achievement_data JSONB, -- Store flexible achievement data
  impact_metrics JSONB, -- Store quantifiable impact data
  testimonial TEXT,
  is_featured BOOLEAN DEFAULT false,
  opt_in_sharing BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create wins publication table
CREATE TABLE public.published_wins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  achievement_id UUID NOT NULL REFERENCES public.user_achievements(id),
  platform TEXT NOT NULL, -- 'homepage', 'social_media', 'wins_page'
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Create user preferences table
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  nps_frequency_days INTEGER DEFAULT 30,
  last_nps_shown TIMESTAMP WITH TIME ZONE,
  achievement_notifications BOOLEAN DEFAULT true,
  sharing_opt_in BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.nps_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.published_wins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for nps_feedback
CREATE POLICY "Users can view their own NPS feedback" 
ON public.nps_feedback 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own NPS feedback" 
ON public.nps_feedback 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_achievements
CREATE POLICY "Users can view their own achievements" 
ON public.user_achievements 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own achievements" 
ON public.user_achievements 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements" 
ON public.user_achievements 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create RLS policies for published_wins (public read for featured content)
CREATE POLICY "Everyone can view published wins" 
ON public.published_wins 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "System can manage published wins" 
ON public.published_wins 
FOR ALL 
USING (true);

-- Create RLS policies for user_preferences
CREATE POLICY "Users can view their own preferences" 
ON public.user_preferences 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preferences" 
ON public.user_preferences 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" 
ON public.user_preferences 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_nps_feedback_updated_at
BEFORE UPDATE ON public.nps_feedback
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_achievements_updated_at
BEFORE UPDATE ON public.user_achievements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
BEFORE UPDATE ON public.user_preferences
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to check if user should see NPS survey
CREATE OR REPLACE FUNCTION public.should_show_nps_survey(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT CASE 
    WHEN NOT EXISTS (SELECT 1 FROM public.user_preferences WHERE user_id = user_uuid) THEN true
    WHEN EXISTS (
      SELECT 1 FROM public.user_preferences p 
      WHERE p.user_id = user_uuid 
      AND (p.last_nps_shown IS NULL OR p.last_nps_shown < now() - interval '1 day' * p.nps_frequency_days)
    ) THEN true
    ELSE false
  END;
$$;

-- Create indexes for better performance
CREATE INDEX idx_nps_feedback_user_id ON public.nps_feedback(user_id);
CREATE INDEX idx_nps_feedback_created_at ON public.nps_feedback(created_at);
CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX idx_user_achievements_goal_id ON public.user_achievements(goal_id);
CREATE INDEX idx_user_achievements_featured ON public.user_achievements(is_featured) WHERE is_featured = true;
CREATE INDEX idx_published_wins_active ON public.published_wins(is_active) WHERE is_active = true;
CREATE INDEX idx_published_wins_platform ON public.published_wins(platform);
CREATE INDEX idx_user_preferences_user_id ON public.user_preferences(user_id);