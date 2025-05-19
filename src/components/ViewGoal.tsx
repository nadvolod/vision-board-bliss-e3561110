
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { Goal } from '../types';
import { useGoals } from '../context/GoalContext';
import { ChevronLeft, ChevronRight, Calendar, Trash, Pencil } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import EditGoalModal from './EditGoalModal';

interface ViewGoalProps {
  goal: Goal | null;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const ViewGoal: React.FC<ViewGoalProps> = ({ goal, onClose, onNext, onPrevious }) => {
  const { deleteGoal } = useGoals();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  if (!goal) return null;
  
  const handleDelete = () => {
    deleteGoal(goal.id);
    onClose();
    setShowDeleteConfirm(false);
  };
  
  const formatDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      return format(date, 'MMMM d, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <>
      <Dialog open={!!goal} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0">
          <div className="flex flex-col">
            <div className="relative">
              <div className="w-full flex justify-center bg-black/10 p-4">
                <img
                  src={goal.image}
                  alt={goal.description}
                  className="fullscreen-image"
                />
              </div>
              
              <div className="absolute top-2 right-2 flex gap-1">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setShowEditModal(true)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 flex justify-between p-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-background/80 backdrop-blur-sm"
                  onClick={onPrevious}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-background/80 backdrop-blur-sm"
                  onClick={onNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              <p className="text-lg">{goal.description}</p>
              
              {goal.why && (
                <p className="text-sm text-muted-foreground italic">
                  <strong>Why:</strong> {goal.why}
                </p>
              )}
              
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Target: {formatDate(goal.deadline)}</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this goal from your vision board.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {goal && (
        <EditGoalModal 
          isOpen={showEditModal} 
          onClose={() => setShowEditModal(false)} 
          goal={goal}
        />
      )}
    </>
  );
};

export default ViewGoal;
