import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useAchievements } from '@/hooks/useAchievements';
import { UserAchievement } from '@/types/feedback';
import { Trophy } from 'lucide-react';
import { useState } from 'react';

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievement: UserAchievement | null;
}

const AchievementModal = ({ isOpen, onClose, achievement }: AchievementModalProps) => {
  const [testimonial, setTestimonial] = useState(achievement?.testimonial || '');
  const [optInSharing, setOptInSharing] = useState(achievement?.opt_in_sharing ?? true);
  const { updateAchievement } = useAchievements();

  const handleSubmit = async () => {
    if (!achievement) return;

    // Don't try to update demo achievements (they have non-UUID IDs)
    if (achievement.id.startsWith('demo-')) {
      onClose();
      return;
    }

    try {
      await updateAchievement.mutateAsync({
        id: achievement.id,
        updates: {
          testimonial: testimonial.trim() || undefined,
          opt_in_sharing: optInSharing,
        },
      });
      onClose();
    } catch (error: unknown) {
      console.error('Error saving achievement:', error);
    }
  };

  if (!achievement) return null;

  const getAchievementTitle = () => {
    if (achievement.achievement_type === 'goal_completed') {
      return 'Goal Achieved! 🎉';
    }
    return 'Achievement Unlocked! 🏆';
  };

  const getAchievementDescription = () => {
    if (achievement.achievement_data?.goal_description) {
      return `Congratulations on completing: "${achievement.achievement_data.goal_description}"`;
    }
    return 'Congratulations on your achievement!';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-xl">{getAchievementTitle()}</DialogTitle>
          <DialogDescription className="text-base">
            {getAchievementDescription()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Testimonial Input */}
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Share your success story (Optional)
            </label>
            <Textarea
              placeholder="How did achieving this goal impact your life? What challenges did you overcome? Your story could inspire others..."
              value={testimonial}
              onChange={(e) => setTestimonial(e.target.value)}
              rows={4}
            />
          </div>

          {/* Sharing Opt-in */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <p className="text-sm font-medium">Don't share publicly</p>
              <p className="text-xs text-muted-foreground">
                Turn this on if you prefer to keep your achievement private
              </p>
            </div>
            <Switch
              checked={!optInSharing}
              onCheckedChange={(checked) => setOptInSharing(!checked)}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              Skip for now
            </Button>
            <Button onClick={handleSubmit}>
              {testimonial.trim() || optInSharing ? 'Save & Share' : 'Continue'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AchievementModal;