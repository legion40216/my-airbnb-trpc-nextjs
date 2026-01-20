// components/auth/AuthModal.tsx
'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type AuthModalProps = {
  body: React.ReactNode;
  footer: React.ReactNode;
  title: string;
  description: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AuthModal({
  body,
  footer,
  description,
  title,
  isOpen,
  onOpenChange,
}: AuthModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col gap-0 max-h-[90vh] sm:max-w-106.25">
        <DialogHeader className="pb-2">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-2 py-6">
          {body}
        </div>

        <div className="border-t pt-4">
          {footer}
        </div>
      </DialogContent>
    </Dialog>
  );
}