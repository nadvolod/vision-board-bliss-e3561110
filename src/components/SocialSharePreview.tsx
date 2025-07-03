import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserAchievement } from '@/types/feedback';
import { Share, Twitter, Facebook, Linkedin } from 'lucide-react';

interface SocialSharePreviewProps {
  achievement: UserAchievement;
}

const SocialSharePreview = ({ achievement }: SocialSharePreviewProps) => {
  const getShareText = () => {
    const baseText = `🎉 Just achieved: ${achievement.achievement_data?.goal_description || 'My goal'}!`;
    const testimonialText = achievement.testimonial ? `\n\n"${achievement.testimonial}"` : '';
    const hashtags = '\n\n#Goals #Success #Achievement #VisionBoard';
    return baseText + testimonialText + hashtags;
  };

  const formatMetrics = () => {
    if (!achievement.impact_metrics) return null;
    return Object.entries(achievement.impact_metrics)
      .map(([key, value]) => `${key.replace('_', ' ')}: ${value}`)
      .join(' • ');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share className="w-5 h-5" />
          Social Share Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Twitter Preview */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Twitter className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Twitter/X</span>
          </div>
          <div className="border rounded-lg p-3 bg-background">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">U</span>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">User Name</span>
                  <span className="text-muted-foreground text-xs">@username • now</span>
                </div>
                <p className="text-sm whitespace-pre-line">{getShareText()}</p>
                {achievement.impact_metrics && (
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(achievement.impact_metrics).map(([key, value]) => (
                      <Badge key={key} variant="secondary" className="text-xs">
                        {key.replace('_', ' ')}: {String(value)}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* LinkedIn Preview */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Linkedin className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">LinkedIn</span>
          </div>
          <div className="border rounded-lg p-3 bg-background">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">U</span>
              </div>
              <div className="flex-1 space-y-2">
                <div className="space-y-1">
                  <span className="font-semibold text-sm">User Name</span>
                  <p className="text-xs text-muted-foreground">Professional Title • 1st</p>
                </div>
                <p className="text-sm whitespace-pre-line">{getShareText()}</p>
                {formatMetrics() && (
                  <p className="text-xs text-muted-foreground">📊 {formatMetrics()}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Facebook Preview */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Facebook className="w-4 h-4 text-blue-700" />
            <span className="text-sm font-medium">Facebook</span>
          </div>
          <div className="border rounded-lg p-3 bg-background">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">U</span>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">User Name</span>
                  <span className="text-muted-foreground text-xs">• Just now</span>
                </div>
                <p className="text-sm whitespace-pre-line">{getShareText()}</p>
                {achievement.impact_metrics && (
                  <div className="grid grid-cols-2 gap-2 mt-3 p-2 bg-muted/50 rounded">
                    {Object.entries(achievement.impact_metrics).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-sm font-semibold">{String(value)}</div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {key.replace('_', ' ')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialSharePreview;