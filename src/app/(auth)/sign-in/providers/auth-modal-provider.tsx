'use client';

import { createContext, useState } from 'react';
import AuthModal from '../auth-modal';

export const AuthModalContext = createContext<AuthModalContextType>({
  openAuthModal: () => {},
  closeAuthModal: () => {},
  isAuthModalOpen: false,
});

interface AuthModalContextType {
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
}

export const AuthModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openAuthModal = () => setIsModalOpen(true);
  const closeAuthModal = () => setIsModalOpen(false);

  return (
    <AuthModalContext.Provider
      value={{ openAuthModal, closeAuthModal, isAuthModalOpen: isModalOpen }}
    >
      {children}
      <AuthModal isOpen={isModalOpen} onClose={closeAuthModal} />
    </AuthModalContext.Provider>
  );
};
