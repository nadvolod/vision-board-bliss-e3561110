
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { Goal } from '../types';
import { useGoals } from '../context/GoalContext';
import { ChevronLeft, ChevronRight, Calendar, Trash, Pencil, Check, ImageIcon, X } from 'lucide-react';
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

// Array of default images to use as fallbacks
const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=500&auto=format&fit=crop", // vision/goal generic
  "https://images.unsplash.com/photo-1617912187990-804dd1618f8d?w=500&auto=format&fit=crop", // success/achievement
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&auto=format&fit=crop", // growth/development
  "https://images.unsplash.com/photo-1521791055366-0d553872125f?w=500&auto=format&fit=crop", // career/professional
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&auto=format&fit=crop", // travel/adventure
  "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?w=500&auto=format&fit=crop", // financial freedom
];

const ViewGoal: React.FC<ViewGoalProps> = ({ goal, onClose, onNext, onPrevious }) => {
  const { deleteGoal, markAsAchieved } = useGoals();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAchieveConfirm, setShowAchieveConfirm] = useState(false);
  const [imageError, setImageError] = useState(false);
  
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
    setShowEditModal(true);
  };

  const handleEditClose = () => {
    console.log('Edit modal closing');
    setShowEditModal(false);
  };
  
  const formatDate = (dateStr: string) => {
    try {
      const date = parseISO(dateStr);
      return format(date, 'MMMM d, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  // Get a random default image from our array
  const getRandomDefaultImage = () => {
    const randomIndex = Math.floor(Math.random() * DEFAULT_IMAGES.length);
    return DEFAULT_IMAGES[randomIndex];
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <>
      <Dialog open={!!goal} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0" closeButton={false}>
          <DialogHeader className="p-0">
            <DialogTitle className="sr-only">Goal Details</DialogTitle>
            <DialogDescription className="sr-only">View and manage your goal details</DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col">
            <div className="relative">
              <div className="w-full flex justify-center bg-black/10 p-4">
                {!imageError ? (
                  <img
                    src={goal.image}
                    alt={goal.description}
                    className="fullscreen-image"
                    onError={handleImageError}
                  />
                ) : (
                  <img
                    src={getRandomDefaultImage()}
                    alt="Default vision image"
                    className="fullscreen-image"
                    onError={(e) => {
                      // If even the fallback fails, show an icon placeholder
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                )}
              </div>
              
              {/* Action buttons in the bottom right */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm shadow-md"
                  onClick={handleEditClick}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-9 w-9 rounded-full bg-destructive/80 backdrop-blur-sm shadow-md"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Navigation buttons at the bottom */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-between px-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm shadow-md"
                  onClick={onPrevious}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm shadow-md"
                  onClick={onNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Close button in the top right */}
              <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-colors"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </Button>
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
              
              {goal.achieved ? (
                <div className="flex items-center mt-2 text-sm font-medium text-green-600">
                  <Check className="h-4 w-4 mr-2" />
                  <span>Achieved on: {formatDate(goal.achievedAt || '')}</span>
                </div>
              ) : (
                <Button 
                  onClick={() => setShowAchieveConfirm(true)}
                  className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="mr-2 h-4 w-4" /> Mark as Achieved
                </Button>
              )}
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
      
      <AlertDialog open={showAchieveConfirm} onOpenChange={setShowAchieveConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mark goal as achieved?</AlertDialogTitle>
            <AlertDialogDescription>
              Congratulations on reaching your goal! Once marked as achieved, this goal will be moved to your achievements page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAchieved} className="bg-green-600 text-white hover:bg-green-700">
              Mark as Achieved
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {goal && (
        <EditGoalModal 
          isOpen={showEditModal} 
          onClose={handleEditClose} 
          goal={goal}
        />
      )}
    </>
  );
};

export default ViewGoal;
