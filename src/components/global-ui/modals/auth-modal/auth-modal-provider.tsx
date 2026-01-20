// components/auth/AuthModalProvider.tsx
'use client';

import { useAuthModalStore } from '@/hooks/useAuthModalStore';
import LoginModalWrapper from './login-modal-wrapper';
import RegisterModalWrapper from './register-modal-wrapper';

const MODAL_CONFIG = {
  login: {
    title: 'Sign in',
    description: 'Welcome back! Please sign in to continue.',
  },
  register: {
    title: 'Create Account',
    description: 'Create an account to get started.',
  },
} as const;

export default function AuthModalProvider() {
  const { isOpen, type, closeModal } = useAuthModalStore();

  if (!isOpen || !type) return null;

  const config = MODAL_CONFIG[type];
  if (!config) return null;

  const handleOpenChange = (open: boolean) => {
    if (!open) closeModal();
  };

  return (
    <>
      {type === 'login' && (
        <LoginModalWrapper
          {...config}
          isOpen={isOpen}
          onOpenChange={handleOpenChange}
        />
      )}

      {type === 'register' && (
        <RegisterModalWrapper
          {...config}
          isOpen={isOpen}
          onOpenChange={handleOpenChange}
        />
      )}
    </>
  );
}