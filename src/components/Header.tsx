
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface HeaderProps {
  openUploadModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ openUploadModal }) => {
  return (
    <header className="sticky top-0 z-30 w-full bg-background/80 backdrop-blur-sm border-b">
      <div className="container flex items-center justify-between h-16 px-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-vision-blue via-vision-purple to-vision-pink bg-clip-text text-transparent">
          Vision Board
        </h1>
        <Button 
          onClick={openUploadModal} 
          className="bg-gradient-to-r from-vision-blue to-vision-purple hover:opacity-90"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Goal
        </Button>
      </div>
    </header>
  );
};

export default Header;
