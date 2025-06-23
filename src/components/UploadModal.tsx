
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { useOptimizedGoalContext } from '@/context/OptimizedGoalContext';
import { Image } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=500&auto=format&fit=crop", // vision/goal generic
  "https://images.unsplash.com/photo-1617912187990-804dd1618f8d?w=500&auto=format&fit=crop", // success/achievement
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&auto=format&fit=crop", // growth/development
  "https://images.unsplash.com/photo-1521791055366-0d553872125f?w=500&auto=format&fit=crop", // career/professional
  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=500&auto=format&fit=crop", // travel/adventure
];

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  console.log('🔄 UploadModal: Component rendering, isOpen:', isOpen);
  
  // Add error boundary for context usage
  let addGoal;
  try {
    const context = useOptimizedGoalContext();
    addGoal = context.addGoal;
  } catch (error) {
    console.error('❌ UploadModal: Context not available:', error);
    return null; // Don't render if context is not available
  }

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

  const getRandomDefaultImage = () => {
    const randomIndex = Math.floor(Math.random() * DEFAULT_IMAGES.length);
    return DEFAULT_IMAGES[randomIndex];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim() || !date) {
      return;
    }
    
    console.log('📝 UploadModal: Starting goal creation');
    setIsUploading(true);
    
    try {
      // Use the uploaded image or a default one
      const imageToUse = imagePreview || getRandomDefaultImage();
      
      console.log('UploadModal: Creating new goal with image:', imageToUse);
      
      await addGoal({
        image: imageToUse,
        description: description.trim(),
        why: why.trim() || undefined,
        deadline: date.toISOString(),
      });
      
      console.log('✅ UploadModal: Goal created successfully');
      
      // Reset form
      setImagePreview(null);
      setDescription('');
      setWhy('');
      setDate(new Date());
      setImageFile(null);
      setIsUploading(false);
      onClose();
    } catch (error) {
      console.error('❌ UploadModal: Error creating goal:', error);
      setIsUploading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open && !isUploading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto pb-6">
        <DialogHeader>
          <DialogTitle>Add New Vision</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Upload Image (Optional)</Label>
            <Input 
              id="image" 
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
              disabled={isUploading}
            />
            {imagePreview ? (
              <div className="mt-2 relative aspect-video">
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
                  <p className="text-xs">A default image will be used</p>
                </div>
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
              disabled={isUploading}
              className="min-h-[80px] resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="why">Why This Goal Matters</Label>
            <Textarea
              id="why"
              placeholder="Why is this goal important to you?"
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              disabled={isUploading}
              className="min-h-[80px] resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deadline">Target Date</Label>
            <DatePicker
              date={date}
              onSelect={setDate}
              placeholder="Pick your target date"
              disabled={isUploading}
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4 pb-2 sticky bottom-0 bg-background">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isUploading || !description.trim() || !date}
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
