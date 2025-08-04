import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useFeedback } from '@/hooks/useFeedback';
import { NPSScore } from '@/types/feedback';
import { useState } from 'react';

interface NPSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NPSModal = ({ isOpen, onClose }: NPSModalProps) => {
  const [selectedScore, setSelectedScore] = useState<NPSScore | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [showTextarea, setShowTextarea] = useState(false);
  const { submitNPSFeedback, isSubmittingNPS } = useFeedback();

  const handleScoreSelect = (score: NPSScore) => {
    setSelectedScore(score);
    setShowTextarea(true);
  };

  const handleSubmit = async () => {
    if (!selectedScore) return;

    try {
      await submitNPSFeedback.mutateAsync({
        score: selectedScore,
        feedback_text: feedbackText.trim() || undefined,
      });
      onClose();
      // Reset form
      setSelectedScore(null);
      setFeedbackText('');
      setShowTextarea(false);
    } catch (error: unknown) {
      console.error('Error submitting NPS feedback:', error);
    }
  };

  const handleSkip = async () => {
    try {
      // Update last_nps_shown timestamp when skipping
      await submitNPSFeedback.mutateAsync({
        score: '0', // Use 0 as a skip indicator
        feedback_text: null,
      });
      onClose();
      // Reset form
      setSelectedScore(null);
      setFeedbackText('');
      setShowTextarea(false);
    } catch (error: unknown) {
      console.error('Error skipping NPS feedback:', error);
    }
  };

  const getScoreLabel = (score: number) => {
    if (score <= 6) return 'Not likely';
    if (score <= 8) return 'Neutral';
    return 'Very likely';
  };

  const getScoreColor = (score: number) => {
    if (score <= 6) return 'text-red-600';
    if (score <= 8) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>How likely are you to recommend our app?</DialogTitle>
          <DialogDescription>
            Help us improve by sharing your experience with our vision board app.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* NPS Score Selection */}
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Not likely</span>
              <span>Very likely</span>
            </div>
            
            <div className="grid grid-cols-11 gap-2">
              {Array.from({ length: 11 }, (_, i) => {
                const score = i.toString() as NPSScore;
                const isSelected = selectedScore === score;
                
                return (
                  <Button
                    key={score}
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    className={`h-10 w-10 p-0 ${getScoreColor(i)}`}
                    onClick={() => handleScoreSelect(score)}
                  >
                    {score}
                  </Button>
                );
              })}
            </div>

            {selectedScore && (
              <p className={`text-center text-sm font-medium ${getScoreColor(parseInt(selectedScore))}`}>
                {getScoreLabel(parseInt(selectedScore))}
              </p>
            )}
          </div>

          {/* Feedback Text */}
          {showTextarea && (
            <div className="space-y-3">
              <label className="text-sm font-medium">
                What's the main reason for your score? (Optional)
              </label>
              <Textarea
                placeholder="Tell us what we're doing well or what we could improve..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={3}
              />
            </div>
          )}

          {/* Action Buttons */}
          {showTextarea && (
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={handleSkip} disabled={isSubmittingNPS}>
                {isSubmittingNPS ? 'Skipping...' : 'Skip'}
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!selectedScore || isSubmittingNPS}
              >
                {isSubmittingNPS ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NPSModal;