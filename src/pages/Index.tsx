
import React, { useState } from 'react';
import { GoalProvider } from '../context/GoalContext';
import Header from '../components/Header';
import VisionBoard from '../components/VisionBoard';
import UploadModal from '../components/UploadModal';

const Index: React.FC = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const openUploadModal = () => setIsUploadModalOpen(true);
  const closeUploadModal = () => setIsUploadModalOpen(false);

  return (
    <GoalProvider>
      <div className="min-h-screen flex flex-col">
        <Header openUploadModal={openUploadModal} />
        <main className="flex-grow">
          <VisionBoard />
        </main>
        
        <UploadModal 
          isOpen={isUploadModalOpen}
          onClose={closeUploadModal}
        />
      </div>
    </GoalProvider>
  );
};

export default Index;
