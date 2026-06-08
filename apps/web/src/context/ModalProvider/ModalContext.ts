import { createContext } from 'react';

interface ModalConfig {
  title?: string;
  content: React.ReactNode;
  maxWidth?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  hideCloseButton?: boolean;
}

export interface ModalContextType {
  openModal: (config: ModalConfig) => void;
  closeModal: () => void;
  isOpen: boolean;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);
