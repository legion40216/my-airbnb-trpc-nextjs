// components/auth/AuthModalAction.tsx
'use client';

import { ActionBtn } from '@/components/global-ui/airbnb-buttons/action-btn';
import { Button } from '@/components/ui/button';
import { useAuthModalStore } from '@/hooks/useAuthModalStore';
import { Loader2 } from 'lucide-react';

type AuthModalActionProps = {
  isSubmitting: boolean;
  handleSubmitForm: () => void;
  formType: 'register' | 'login';
};

export default function AuthModalAction({
  isSubmitting,
  handleSubmitForm,
  formType,
}: AuthModalActionProps) {
  const { setType } = useAuthModalStore();

  const toggleFormType = () => {
    setType(formType === 'login' ? 'register' : 'login');
  };

  return (
    <div className="space-y-4">
      <ActionBtn
        type="submit"
        onClick={handleSubmitForm}
        disabled={isSubmitting}
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {formType === 'register' ? 'Create Account' : 'Sign In'}
      </ActionBtn>

      <div className="text-center text-sm text-muted-foreground">
        {formType === 'register' ? (
          <>
            Already have an account?{' '}
            <button
              type="button"
              onClick={toggleFormType}
              className="text-primary hover:underline font-medium"
              disabled={isSubmitting}
            >
              Sign in
            </button>
          </>
        ) : (
          <>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={toggleFormType}
              className="text-primary hover:underline font-medium"
              disabled={isSubmitting}
            >
              Create one
            </button>
          </>
        )}
      </div>
    </div>
  );
}