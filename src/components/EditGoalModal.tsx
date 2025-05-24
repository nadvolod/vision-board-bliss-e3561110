
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { format, parseISO } from 'date-fns';
import { useGoals } from '@/context/GoalContext';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Goal } from '../types';

interface EditGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
}

const EditGoalModal: React.FC<EditGoalModalProps> = ({ isOpen, onClose, goal }) => {
  const { updateGoal } = useGoals();
  const [description, setDescription] = useState('');
  const [why, setWhy] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isUpdating, setIsUpdating] = useState(false);

  console.log('EditGoalModal render - isOpen:', isOpen, 'goal:', goal?.id);

  // Reset form when goal changes or modal opens
  useEffect(() => {
    if (goal && isOpen) {
      console.log('Resetting form with goal data:', goal);
      setDescription(goal.description);
      setWhy(goal.why || '');
      try {
        setDate(parseISO(goal.deadline));
      } catch {
        setDate(new Date());
      }
    }
  }, [goal, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!goal || !date || !description.trim()) {
      return;
    }
    
    setIsUpdating(true);
    
    setTimeout(() => {
      updateGoal({
        ...goal,
        description: description.trim(),
        why: why.trim() || undefined,
        deadline: date.toISOString(),
      });
      
      setIsUpdating(false);
      onClose();
    }, 300);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" style={{ zIndex: 60 }}>
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
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-why">Why This Goal Matters</Label>
              <Textarea
                id="edit-why"
                placeholder="Why is this goal important to you?"
                value={why}
                onChange={(e) => setWhy(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-deadline">Target Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="edit-deadline"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    captionLayout="dropdown-buttons"
                    fromYear={2000}
                    toYear={2100}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
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
