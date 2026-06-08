import { useCallback, useState } from 'react';

import { Modal } from '@components/Modal';

import { ModalContext } from './ModalContext';

interface ModalConfig {
  title?: string;
  content: React.ReactNode;
  maxWidth?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  hideCloseButton?: boolean;
}

const SIZE_MAP = {
  small: '400px',
  medium: '600px',
  large: '800px',
  xlarge: '1200px',
};

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);

  const openModal = useCallback((config: ModalConfig) => {
    setModalConfig(config);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Delay clearing config to allow exit animation
    setTimeout(() => setModalConfig(null), 300);
  }, []);

  const getMaxWidth = () => {
    if (modalConfig?.maxWidth) return modalConfig.maxWidth;
    if (modalConfig?.size) return SIZE_MAP[modalConfig.size];

    return '600px';
  };

  return (
    <ModalContext.Provider value={{ openModal, closeModal, isOpen }}>
      {children}
      {modalConfig && (
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          title={modalConfig.title}
          maxWidth={getMaxWidth()}
          hideCloseButton={modalConfig.hideCloseButton}
        >
          {modalConfig.content}
        </Modal>
      )}
    </ModalContext.Provider>
  );
}
