import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useOptimizedGoalContext } from '@/context/OptimizedGoalContext';
import { parseISO } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { Goal } from '../types';

interface EditGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
}

const EditGoalModal: React.FC<EditGoalModalProps> = ({ isOpen, onClose, goal }) => {
  const { updateGoal } = useOptimizedGoalContext();
  const [description, setDescription] = useState('');
  const [why, setWhy] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isUpdating, setIsUpdating] = useState(false);

  // Reset form when goal changes or modal opens
  useEffect(() => {
    if (goal && isOpen) {
      setDescription(goal.description);
      setWhy(goal.why || '');
      try {
        setDate(parseISO(goal.deadline));
      } catch {
        setDate(new Date());
      }
    }
  }, [goal, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!goal || !date || !description.trim()) {
      return;
    }
    
    setIsUpdating(true);
    
    try {
      await updateGoal({
        ...goal,
        description: description.trim(),
        why: why.trim() || undefined,
        deadline: date.toISOString(),
      });
      
      onClose();
    } catch (error) {
      console.error('Error updating goal:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto" style={{ zIndex: 60 }}>
        <DialogHeader>
          <DialogTitle>Edit Goal</DialogTitle>
        </DialogHeader>
        {goal && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-description">Goal Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Describe your vision..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="min-h-[100px] resize-none"
                disabled={isUpdating}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-why">Why This Goal Matters</Label>
              <Textarea
                id="edit-why"
                placeholder="Why is this goal important to you?"
                value={why}
                onChange={(e) => setWhy(e.target.value)}
                className="min-h-[100px] resize-none"
                disabled={isUpdating}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-deadline">Target Date</Label>
              <DatePicker
                date={date}
                onSelect={setDate}
                placeholder="Pick your target date"
                disabled={isUpdating}
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose} disabled={isUpdating}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isUpdating || !description.trim() || !date}
              >
                {isUpdating ? "Updating..." : "Update Goal"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditGoalModal;
