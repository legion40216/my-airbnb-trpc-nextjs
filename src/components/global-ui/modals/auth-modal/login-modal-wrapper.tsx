'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client'; // ✅ Use authClient
import { LoginFormValues, loginSchema } from '@/schemas';

import AuthModal from './auth-modal';
import AuthModalAction from './components/auth-modal-action';
import LoginForm from './login-form/login-form';
import { Form } from '@/components/ui/form';

type LoginModalWrapperProps = {
  title: string;
  description: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function LoginModalWrapper({
  description,
  title,
  isOpen,
  onOpenChange,
}: LoginModalWrapperProps) {
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: LoginFormValues) => {
    const toastId = toast.loading('Signing you in...');

    try {
      // ✅ Better Auth v1+ API
      const { data, error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast.error(error.message || 'Invalid credentials', { id: toastId });
        return;
      }

      if (data?.user) {
        toast.success('Welcome back!', { id: toastId });
        onOpenChange(false); // Close modal
        form.reset(); // Clear form
        router.refresh(); // Refresh to update auth state
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Something went wrong. Please try again.', { id: toastId });
    }
  };

  const modalBody = <LoginForm form={form} isSubmitting={isSubmitting} />;

  const modalFooter = (
    <AuthModalAction
      isSubmitting={isSubmitting}
      handleSubmitForm={form.handleSubmit(onSubmit)}
      formType="login"
    />
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="contents">
        <AuthModal
          title={title}
          description={description}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          body={modalBody}
          footer={modalFooter}
        />
      </form>
    </Form>
  );
}