import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { NPSScore, UserAchievement } from '@/types/feedback';
import { TestTube, Trophy, Users, MessageSquare, Star, Target } from 'lucide-react';
import { useState } from 'react';
import AchievementModal from '../components/AchievementModal';
import NPSModal from '../components/NPSModal';
import SocialSharePreview from '../components/SocialSharePreview';
import WinsCarousel from '../components/WinsCarousel';
import { useAchievements } from '../hooks/useAchievements';
import { useFeedback } from '../hooks/useFeedback';

const Demo = () => {
  const [showNPSModal, setShowNPSModal] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [showSocialPreview, setShowSocialPreview] = useState(false);
  const [mockAchievement, setMockAchievement] = useState<UserAchievement | null>(null);
  
  // Form states for creating test achievements
  const [achievementType, setAchievementType] = useState('goal_completed');
  const [goalDescription, setGoalDescription] = useState('Learn React Development');
  const [testimonial, setTestimonial] = useState('');
  const [impactMetrics, setImpactMetrics] = useState('{"days_spent": "30", "skills_learned": "5"}');
  
  const { toast } = useToast();
  const { createAchievement, userAchievements, featuredAchievements } = useAchievements();
  const { submitNPSFeedback } = useFeedback();

  const handleCreateMockAchievement = () => {
    const mockData: UserAchievement = {
      id: 'demo-' + Date.now(),
      user_id: 'demo-user',
      goal_id: 'demo-goal',
      achievement_type: achievementType,
      achievement_data: {
        goal_description: goalDescription,
        completed_at: new Date().toISOString(),
      },
      impact_metrics: impactMetrics ? JSON.parse(impactMetrics) : null,
      testimonial: testimonial || null,
      is_featured: false,
      opt_in_sharing: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setMockAchievement(mockData);
    setShowAchievementModal(true);
  };

  const handleCreateRealAchievement = async () => {
    try {
      await createAchievement.mutateAsync({
        achievement_type: achievementType,
        achievement_data: {
          goal_description: goalDescription,
          completed_at: new Date().toISOString(),
        },
        impact_metrics: impactMetrics ? JSON.parse(impactMetrics) : null,
        testimonial: testimonial || undefined,
        is_featured: Math.random() > 0.5, // Random for demo
        opt_in_sharing: true, // Enable sharing by default
      });
      
      toast({
        title: "Achievement Created!",
        description: "Test achievement has been added to the database.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create achievement. Check console for details.",
        variant: "destructive",
      });
      console.error('Error creating achievement:', error);
    }
  };

  const handleTestNPSSubmission = async (score: NPSScore) => {
    try {
      await submitNPSFeedback.mutateAsync({
        score,
        feedback_text: `Demo feedback for score ${score}`,
      });
      
      toast({
        title: "NPS Feedback Submitted!",
        description: `Score: ${score}/10 with demo feedback`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit NPS feedback. Check console for details.",
        variant: "destructive",
      });
      console.error('Error submitting NPS:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-primary mb-4">
            <TestTube className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Feature Demo</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Test all feedback and wins features independently. Perfect for development and testing.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6 text-center">
              <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{userAchievements.length}</div>
              <p className="text-muted-foreground">Your Achievements</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{featuredAchievements.length}</div>
              <p className="text-muted-foreground">Featured Wins</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Star className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">Live</div>
              <p className="text-muted-foreground">Demo Mode</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* NPS Testing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                NPS Survey Testing
              </CardTitle>
              <CardDescription>
                Test the Net Promoter Score survey modal and submission
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => setShowNPSModal(true)} 
                className="w-full"
              >
                Open NPS Survey Modal
              </Button>
              
              <Separator />
              
              <div>
                <Label className="text-sm font-medium mb-3 block">Quick NPS Submission (bypasses modal)</Label>
                <div className="grid grid-cols-6 gap-2">
                  {(['0', '6', '7', '8', '9', '10'] as NPSScore[]).map((score) => (
                    <Button
                      key={score}
                      variant="outline"
                      size="sm"
                      onClick={() => handleTestNPSSubmission(score)}
                      className="text-xs"
                    >
                      {score}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  0-6: Detractors, 7-8: Passive, 9-10: Promoters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Achievement Testing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Achievement Testing
              </CardTitle>
              <CardDescription>
                Test achievement modals and creation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="achievement-type">Achievement Type</Label>
                  <Select value={achievementType} onValueChange={setAchievementType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="goal_completed">Goal Completed</SelectItem>
                      <SelectItem value="milestone_reached">Milestone Reached</SelectItem>
                      <SelectItem value="habit_formed">Habit Formed</SelectItem>
                      <SelectItem value="skill_learned">Skill Learned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="goal-description">Goal Description</Label>
                  <Input
                    id="goal-description"
                    value={goalDescription}
                    onChange={(e) => setGoalDescription(e.target.value)}
                    placeholder="What was achieved?"
                  />
                </div>

                <div>
                  <Label htmlFor="testimonial">Testimonial (Optional)</Label>
                  <Textarea
                    id="testimonial"
                    value={testimonial}
                    onChange={(e) => setTestimonial(e.target.value)}
                    placeholder="Share your success story..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="impact-metrics">Impact Metrics (JSON)</Label>
                  <Textarea
                    id="impact-metrics"
                    value={impactMetrics}
                    onChange={(e) => setImpactMetrics(e.target.value)}
                    placeholder='{"days_spent": "30", "skills_learned": "5"}'
                    rows={2}
                    className="font-mono text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleCreateMockAchievement}
                  variant="outline"
                  className="flex-1"
                >
                  Mock Modal
                </Button>
                <Button 
                  onClick={handleCreateRealAchievement}
                  className="flex-1"
                  disabled={createAchievement.isPending}
                >
                  {createAchievement.isPending ? 'Creating...' : 'Create Real'}
                </Button>
              </div>
              
              <Button 
                onClick={() => {
                  const mockData: UserAchievement = {
                    id: 'demo-' + Date.now(),
                    user_id: 'demo-user',
                    goal_id: 'demo-goal',
                    achievement_type: achievementType,
                    achievement_data: {
                      goal_description: goalDescription,
                      completed_at: new Date().toISOString(),
                    },
                    impact_metrics: impactMetrics ? JSON.parse(impactMetrics) : null,
                    testimonial: testimonial || null,
                    is_featured: false,
                    opt_in_sharing: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  };
                  setMockAchievement(mockData);
                  setShowSocialPreview(true);
                }}
                variant="secondary"
                className="w-full"
              >
                Preview Social Share
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Wins Carousel Demo */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Wins Carousel Demo
            </CardTitle>
            <CardDescription>
              Live carousel showing current featured achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            {featuredAchievements.length > 0 ? (
              <WinsCarousel />
            ) : (
              <div className="text-center py-8">
                <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No featured achievements yet. Create some achievements with sharing enabled to see the carousel.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Current Data Preview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Your Current Data</CardTitle>
            <CardDescription>
              Preview of your achievements in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userAchievements.length > 0 ? (
              <div className="space-y-3">
                {userAchievements.slice(0, 5).map((achievement) => (
                  <div key={achievement.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs">
                          {achievement.achievement_type}
                        </Badge>
                        {achievement.is_featured && (
                          <Badge variant="default" className="text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-medium">
                        {achievement.achievement_data?.goal_description || 'No description'}
                      </p>
                      {achievement.testimonial && (
                        <p className="text-xs text-muted-foreground italic mt-1">
                          "{achievement.testimonial.slice(0, 100)}..."
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                {userAchievements.length > 5 && (
                  <p className="text-center text-sm text-muted-foreground">
                    And {userAchievements.length - 5} more achievements...
                  </p>
                )}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No achievements yet. Create some using the form above!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Modals */}
        <NPSModal
          isOpen={showNPSModal}
          onClose={() => setShowNPSModal(false)}
        />

        <AchievementModal
          isOpen={showAchievementModal}
          onClose={() => {
            setShowAchievementModal(false);
            setMockAchievement(null);
          }}
          achievement={mockAchievement}
        />

        {/* Social Preview Modal */}
        {mockAchievement && (
          <Dialog open={showSocialPreview} onOpenChange={setShowSocialPreview}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Social Share Preview</DialogTitle>
                <DialogDescription>
                  See how your achievement would appear when shared on social media
                </DialogDescription>
              </DialogHeader>
              <SocialSharePreview achievement={mockAchievement} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default Demo;