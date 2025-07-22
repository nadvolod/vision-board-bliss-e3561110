import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useOptimizedGoalContext } from '@/context/OptimizedGoalContext';
import { parseISO } from 'date-fns';
import { Image } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Goal } from '../types';

interface EditGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
}

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1617912187990-804dd1618f8d?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1521791055366-0d553872125f?w=500&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&auto=format&fit=crop",
];

const EditGoalModal: React.FC<EditGoalModalProps> = ({ isOpen, onClose, goal }) => {
  const { updateGoal } = useOptimizedGoalContext();
  const [description, setDescription] = useState('');
  const [why, setWhy] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Reset form when goal changes or modal opens
  useEffect(() => {
    if (goal && isOpen) {
      setDescription(goal.description);
      setWhy(goal.why || '');
      setImagePreview(goal.image || null);
      setImageFile(null);
      try {
        setDate(parseISO(goal.deadline));
      } catch {
        setDate(new Date());
      }
    }
  }, [goal, isOpen]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getRandomDefaultImage = () => {
    const randomIndex = Math.floor(Math.random() * DEFAULT_IMAGES.length);
    return DEFAULT_IMAGES[randomIndex];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!goal || !date || !description.trim()) {
      return;
    }
    
    setIsUpdating(true);
    
    try {
      const imageToUse = imagePreview || getRandomDefaultImage();

      await updateGoal({
        ...goal,
        image: imageToUse,
        description: description.trim(),
        why: why.trim() || undefined,
        deadline: date.toISOString(),
      });
      
      onClose();
    } catch (error: unknown) {
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
              <Label htmlFor="edit-image" data-testid="edit-image-label">Change Image (Optional)</Label>
              <Input 
                id="edit-image" 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                disabled={isUpdating}
                data-testid="edit-image-input"
              />
              {imagePreview ? (
                <div className="mt-2 relative aspect-video" data-testid="edit-image-preview">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-40 object-cover rounded-md"
                  />
                </div>
              ) : (
                <div className="mt-2 h-40 bg-gray-100 rounded-md flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <Image className="mx-auto h-8 w-8 opacity-50" />
                    <p className="text-sm mt-1">No image selected</p>
                    <p className="text-xs">Current image will be kept</p>
                  </div>
                </div>
              )}
            </div>

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
                data-testid="edit-description-input"
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
                data-testid="edit-why-input"
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
                data-testid="update-goal-button"
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
