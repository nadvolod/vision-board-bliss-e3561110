import React, { useState } from 'react';
import FloatingAddButton from '../components/FloatingAddButton';
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
      <Header />
      <main className={`flex-grow ${isMobile ? 'pb-20' : ''}`}>
        <OptimizedVisionBoard />
      </main>
      
      {user && (
        <>
          <FloatingAddButton onClick={openUploadModal} />
          <UploadModal 
            isOpen={isUploadModalOpen}
            onClose={closeUploadModal}
          />
        </>
      )}
    </div>
  );
};

export default OptimizedIndex;
