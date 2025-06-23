
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import OptimizedVisionBoard from '../components/OptimizedVisionBoard';
import UploadModal from '../components/UploadModal';
import { useAuth } from '../context/AuthContext';
import { useOptimizedGoalContext } from '../context/OptimizedGoalContext';

const OptimizedIndex: React.FC = () => {
  console.time('OptimizedIndex-mount');
  console.log('🏠 OptimizedIndex: Component mounting');
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  // Check if goal context is available
  let isContextAvailable = false;
  try {
    useOptimizedGoalContext();
    isContextAvailable = true;
  } catch (error) {
    console.warn('⚠️ OptimizedGoalContext not available yet');
  }

  useEffect(() => {
    console.time('mobile-detection');
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      console.log(`📱 Mobile detection: ${mobile}`);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    console.timeEnd('mobile-detection');
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    console.log(`👤 User state: ${user ? 'authenticated' : 'not authenticated'}`);
    console.log(`🔧 Context available: ${isContextAvailable}`);
    console.timeEnd('OptimizedIndex-mount');
  }, [user, isContextAvailable]);

  const openUploadModal = () => {
    console.log('📝 Opening upload modal, context available:', isContextAvailable);
    if (isContextAvailable) {
      setIsUploadModalOpen(true);
    } else {
      console.warn('⚠️ Cannot open modal, context not available');
    }
  };
  
  const closeUploadModal = () => {
    console.log('❌ Closing upload modal');
    setIsUploadModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header openUploadModal={openUploadModal} />
      <main className={`flex-grow ${isMobile ? 'pb-20' : ''}`}>
        <OptimizedVisionBoard />
      </main>
      
      {user && isContextAvailable && (
        <UploadModal 
          isOpen={isUploadModalOpen}
          onClose={closeUploadModal}
        />
      )}
    </div>
  );
};

export default OptimizedIndex;
