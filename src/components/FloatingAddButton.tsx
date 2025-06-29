import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import React from 'react';

interface FloatingAddButtonProps {
  onClick: () => void;
}

const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-vision-purple hover:bg-vision-purple/90 shadow-lg hover:shadow-xl transition-all duration-200 z-50 hover:scale-110 focus:scale-110"
      size="icon"
      data-testid="floating-add-button"
      aria-label="Add new goal"
    >
      <Plus className="h-6 w-6 text-white" />
    </Button>
  );
};

export default FloatingAddButton; 