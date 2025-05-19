
import React from 'react';
import { Plus, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  openUploadModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ openUploadModal }) => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-background shadow-sm border-b z-10">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <h1 className="text-xl font-bold bg-gradient-to-r from-vision-purple to-vision-teal bg-clip-text text-transparent">
          Vision Board
        </h1>
        
        <div className="flex items-center gap-2">
          {user && (
            <>
              <span className="text-sm text-muted-foreground mr-2 hidden sm:inline-block">
                {user.email}
              </span>
              <Button
                onClick={openUploadModal}
                variant="default"
                className="bg-vision-purple hover:bg-vision-purple/90"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" /> Add Goal
              </Button>
              <Button
                onClick={signOut}
                variant="outline"
                size="icon"
                className="h-8 w-8"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
