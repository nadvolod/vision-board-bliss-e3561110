import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useAchievements } from '@/hooks/useAchievements';
import { Trophy } from 'lucide-react';
import { memo } from 'react';

const WinsCarousel = memo(() => {
  const { featuredAchievements } = useAchievements();

  if (featuredAchievements.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Community Wins</h2>
        <p className="text-muted-foreground">Real achievements from our community members</p>
      </div>

      <Carousel className="w-full max-w-4xl mx-auto">
        <CarouselContent>
          {featuredAchievements.map((achievement) => (
            <CarouselItem key={achievement.id} className="md:basis-1/2 lg:basis-1/3">
              <Card className="h-full">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Trophy className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-primary">
                      {achievement.achievement_type === 'goal_completed' ? 'Goal Achieved' : 'Achievement'}
                    </span>
                  </div>

                  {achievement.achievement_data?.goal_description && (
                    <h3 className="font-semibold mb-3 line-clamp-2">
                      {String(achievement.achievement_data.goal_description)}
                    </h3>
                  )}

                  {achievement.testimonial && (
                    <blockquote className="flex-1 text-sm text-muted-foreground italic line-clamp-4">
                      "{achievement.testimonial}"
                    </blockquote>
                  )}

                  {achievement.impact_metrics && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {Object.entries(achievement.impact_metrics).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className="font-semibold text-primary">{String(value)}</div>
                            <div className="text-muted-foreground capitalize">
                              {key.replace('_', ' ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
});

WinsCarousel.displayName = 'WinsCarousel';

export default WinsCarousel;