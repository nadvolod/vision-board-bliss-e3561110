import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import React from 'react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-background shadow-sm border-b z-10" data-testid="app-header">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <h1 className="text-xl font-bold bg-gradient-to-r from-vision-purple to-vision-teal bg-clip-text text-transparent">
          Vision Board
        </h1>
        
        <div className="flex items-center gap-2">
          {user && (
            <>
              <span className="text-sm text-muted-foreground mr-2 hidden sm:inline-block" data-testid="user-email">
                {user.email}
              </span>
              <Button
                onClick={signOut}
                variant="outline"
                size="icon"
                className="h-8 w-8"
                data-testid="logout-button"
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
