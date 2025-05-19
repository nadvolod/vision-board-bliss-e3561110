
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useGoals } from '@/context/GoalContext';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const { addGoal } = useGoals();
  const [description, setDescription] = useState('');
  const [why, setWhy] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imagePreview || !date || !description.trim()) {
      return;
    }
    
    setIsUploading(true);
    
    // In a real app, you might upload the image to a server here
    setTimeout(() => {
      addGoal({
        image: imagePreview,
        description: description.trim(),
        why: why.trim() || undefined,
        deadline: date.toISOString(),
      });
      
      // Reset form
      setImagePreview(null);
      setDescription('');
      setWhy('');
      setDate(new Date());
      setImageFile(null);
      setIsUploading(false);
      onClose();
    }, 500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto pb-6">
        <DialogHeader>
          <DialogTitle>Add New Vision</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Upload Image</Label>
            <Input 
              id="image" 
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
              required
            />
            {imagePreview && (
              <div className="mt-2 relative aspect-video">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-40 object-cover rounded-md"
                />
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Goal Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your vision..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="why">Why This Goal Matters</Label>
            <Textarea
              id="why"
              placeholder="Why is this goal important to you?"
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deadline">Target Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
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
          
          <div className="flex justify-end gap-2 pt-4 pb-2 sticky bottom-0 bg-background">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button 
              type="submit" 
              disabled={isUploading || !imagePreview || !description.trim() || !date}
            >
              {isUploading ? "Adding..." : "Add to Vision Board"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadModal;
