import { useEffect, useState } from 'react';
import AchievementModal from './AchievementModal';
import NPSModal from './NPSModal';
import { useAchievements } from '@/hooks/useAchievements';
import { useFeedback } from '@/hooks/useFeedback';
import { UserAchievement } from '@/types/feedback';

const FeedbackManager = () => {
  const [showNPSModal, setShowNPSModal] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [pendingAchievement, setPendingAchievement] = useState<UserAchievement | null>(null);
  
  const { shouldShowNPS } = useFeedback();
  const { userAchievements } = useAchievements();

  // Check for NPS survey
  useEffect(() => {
    if (shouldShowNPS) {
      // Show NPS with a slight delay to avoid overwhelming user on page load
      const timer = setTimeout(() => {
        setShowNPSModal(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [shouldShowNPS]);

  // Check for new achievements without testimonials
  useEffect(() => {
    const newAchievement = userAchievements.find(
      achievement => !achievement.testimonial && !achievement.opt_in_sharing
    );
    
    if (newAchievement && !showAchievementModal) {
      setPendingAchievement(newAchievement);
      setShowAchievementModal(true);
    }
  }, [userAchievements, showAchievementModal]);

  return (
    <>
      <NPSModal
        isOpen={showNPSModal}
        onClose={() => setShowNPSModal(false)}
      />
      
      <AchievementModal
        isOpen={showAchievementModal}
        onClose={() => {
          setShowAchievementModal(false);
          setPendingAchievement(null);
        }}
        achievement={pendingAchievement}
      />
    </>
  );
};

export default FeedbackManager;