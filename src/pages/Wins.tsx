import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAchievements } from '@/hooks/useAchievements';
import { format } from 'date-fns';
import { Trophy, Users } from 'lucide-react';

const Wins = () => {
  const { featuredAchievements } = useAchievements();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-primary mb-4">
            <Trophy className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Community Wins</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Celebrating real achievements from our community members. These stories showcase the power of vision and determination.
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">
                {featuredAchievements.length}
              </div>
              <p className="text-muted-foreground">Featured Achievements</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">
                <Users className="w-8 h-8 mx-auto" />
              </div>
              <p className="text-muted-foreground">Community Members</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">
                100%
              </div>
              <p className="text-muted-foreground">Anonymous & Private</p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredAchievements.map((achievement) => (
            <Card key={achievement.id} className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {achievement.achievement_type === 'goal_completed' ? 'Goal Achieved' : 'Achievement'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(achievement.created_at), 'MMM yyyy')}
                  </span>
                </div>
                
                {achievement.achievement_data?.goal_description && (
                  <CardTitle className="text-lg line-clamp-2">
                    {String(achievement.achievement_data.goal_description)}
                  </CardTitle>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {achievement.testimonial && (
                  <blockquote className="text-sm text-muted-foreground italic border-l-4 border-primary/20 pl-4">
                    "{achievement.testimonial}"
                  </blockquote>
                )}

                {achievement.impact_metrics && (
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                    {Object.entries(achievement.impact_metrics).map(([key, value]) => (
                      <div key={key} className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-lg font-bold text-primary">{String(value)}</div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {key.replace('_', ' ')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {featuredAchievements.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No wins featured yet</h3>
            <p className="text-muted-foreground">
              Be the first to share your achievement story with the community!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wins;