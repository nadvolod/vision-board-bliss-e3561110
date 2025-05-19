
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import VisionBoard from '../components/VisionBoard';
import UploadModal from '../components/UploadModal';
import { useAuth } from '../context/AuthContext';

const Index: React.FC = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  // Check if the device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const openUploadModal = () => setIsUploadModalOpen(true);
  const closeUploadModal = () => setIsUploadModalOpen(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header openUploadModal={openUploadModal} />
      <main className={`flex-grow ${isMobile ? 'pb-20' : ''}`}>
        <VisionBoard />
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

export default Index;
