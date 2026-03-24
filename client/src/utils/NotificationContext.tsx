import React, { createContext, useContext, useState, useCallback } from 'react';
import Modal from '../components/Modal';

interface NotificationContextType {
  showAlert: (title: string, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; title: string; message: string }>({
    isOpen: false,
    title: '',
    message: '',
  });

  const showAlert = useCallback((title: string, message: string) => {
    setModalConfig({ isOpen: true, title, message });
  }, []);

  const closeAlert = useCallback(() => {
    setModalConfig(prev => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <NotificationContext.Provider value={{ showAlert }}>
      {children}
      <Modal 
        isOpen={modalConfig.isOpen} 
        onClose={closeAlert} 
        title={modalConfig.title}
      >
        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', color: 'rgba(255,255,255,0.9)' }}>
            {modalConfig.message}
          </p>
          <button className="btn btn-primary btn-block" onClick={closeAlert}>
            Got it
          </button>
        </div>
      </Modal>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};
