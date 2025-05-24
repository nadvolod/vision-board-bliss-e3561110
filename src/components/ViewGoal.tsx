
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Goal } from '../types';
import { useGoals } from '../context/GoalContext';
import EditGoalModal from './EditGoalModal';
import GoalImageDisplay from './GoalImageDisplay';
import GoalDetails from './GoalDetails';
import GoalConfirmationDialogs from './GoalConfirmationDialogs';

interface ViewGoalProps {
  goal: Goal | null;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const ViewGoal: React.FC<ViewGoalProps> = ({ goal, onClose, onNext, onPrevious }) => {
  const { deleteGoal, markAsAchieved } = useGoals();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAchieveConfirm, setShowAchieveConfirm] = useState(false);
  
  if (!goal) return null;
  
  const handleDelete = () => {
    deleteGoal(goal.id);
    onClose();
    setShowDeleteConfirm(false);
  };
  
  const handleAchieved = () => {
    markAsAchieved(goal.id);
    setShowAchieveConfirm(false);
  };

  const handleEditClick = () => {
    console.log('Edit button clicked for goal:', goal.id);
    console.log('About to open edit modal');
    setShowEditModal(true);
    console.log('showEditModal set to true');
  };

  const handleEditClose = () => {
    console.log('Closing edit modal');
    setShowEditModal(false);
  };

  console.log('ViewGoal render - showEditModal:', showEditModal, 'goal:', goal?.id);

  return (
    <>
      <Dialog open={!!goal} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0" closeButton={false}>
          <DialogHeader className="p-0">
            <DialogTitle className="sr-only">Goal Details</DialogTitle>
            <DialogDescription className="sr-only">View and manage your goal details</DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col">
            <GoalImageDisplay
              image={goal.image}
              description={goal.description}
              onEdit={handleEditClick}
              onDelete={() => setShowDeleteConfirm(true)}
              onNext={onNext}
              onPrevious={onPrevious}
              onClose={onClose}
            />
            
            <GoalDetails
              goal={goal}
              onMarkAsAchieved={() => setShowAchieveConfirm(true)}
            />
          </div>
        </DialogContent>
      </Dialog>
      
      <GoalConfirmationDialogs
        showDeleteConfirm={showDeleteConfirm}
        showAchieveConfirm={showAchieveConfirm}
        onDeleteConfirmChange={setShowDeleteConfirm}
        onAchieveConfirmChange={setShowAchieveConfirm}
        onDelete={handleDelete}
        onAchieve={handleAchieved}
      />
      
      <EditGoalModal 
        isOpen={showEditModal} 
        onClose={handleEditClose} 
        goal={goal}
      />
    </>
  );
};

export default ViewGoal;
