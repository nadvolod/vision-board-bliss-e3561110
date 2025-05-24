
import React from 'react';
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

interface GoalConfirmationDialogsProps {
  showDeleteConfirm: boolean;
  showAchieveConfirm: boolean;
  onDeleteConfirmChange: (open: boolean) => void;
  onAchieveConfirmChange: (open: boolean) => void;
  onDelete: () => void;
  onAchieve: () => void;
}

const GoalConfirmationDialogs: React.FC<GoalConfirmationDialogsProps> = ({
  showDeleteConfirm,
  showAchieveConfirm,
  onDeleteConfirmChange,
  onAchieveConfirmChange,
  onDelete,
  onAchieve
}) => {
  return (
    <>
      <AlertDialog open={showDeleteConfirm} onOpenChange={onDeleteConfirmChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this goal from your vision board.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={showAchieveConfirm} onOpenChange={onAchieveConfirmChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark goal as achieved?</AlertDialogTitle>
            <AlertDialogDescription>
              Congratulations on reaching your goal! Once marked as achieved, this goal will be moved to your achievements page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onAchieve} className="bg-green-600 text-white hover:bg-green-700">
              Mark as Achieved
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default GoalConfirmationDialogs;
