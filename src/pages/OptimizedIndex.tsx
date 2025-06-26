import React, { useState } from 'react';
import Header from '../components/Header';
import OptimizedVisionBoard from '../components/OptimizedVisionBoard';
import UploadModal from '../components/UploadModal';
import { useAuth } from '../context/AuthContext';
import { useIsMobile } from '../hooks/use-mobile';

const OptimizedIndex: React.FC = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const openUploadModal = () => {
    setIsUploadModalOpen(true);
  };
  
  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header openUploadModal={openUploadModal} />
      <main className={`flex-grow ${isMobile ? 'pb-20' : ''}`}>
        <OptimizedVisionBoard />
      </main>
      
      {user && (
        <UploadModal 
          isOpen={isUploadModalOpen}
          onClose={closeUploadModal}
        />
      )}
    </div>
  );
};

export default OptimizedIndex;
