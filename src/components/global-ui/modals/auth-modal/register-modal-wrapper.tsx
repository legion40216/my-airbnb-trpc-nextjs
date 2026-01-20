// components/modals/auth-modal/register-modal-wrapper.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client"; // ✅ Use authClient
import { RegisterFormValues, registerSchema } from "@/schemas";
import { useAuthModalStore } from "@/hooks/useAuthModalStore";

import RegisterForm from "./register-form/registration-form";
import AuthModal from "./auth-modal";
import AuthModalAction from "./components/auth-modal-action";
import { Form } from "@/components/ui/form";

type RegisterModalWrapperProps = {
  title: string;
  description: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function RegisterModalWrapper({
  description,
  title,
  isOpen,
  onOpenChange,
}: RegisterModalWrapperProps) {
  const { setType, closeModal } = useAuthModalStore();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onBlur", // Better UX - validate on blur instead of every keystroke
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: RegisterFormValues) => {
    const toastId = toast.loading("Creating your account...");

    try {
      // ✅ Better Auth v1+ API
      const { data, error } = await authClient.signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
      });

      if (error) {
        toast.error(error.message || "Registration failed", { id: toastId });
        return;
      }

      if (data?.user) {
        toast.success("Account created! You can now sign in.", { id: toastId });
        // Switch to login modal
        setType("login");
        form.reset(); // Clear form
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Something went wrong. Please try again.", { id: toastId });
    }
  };

  const modalBody = <RegisterForm form={form} isSubmitting={isSubmitting} />;
  
  const modalFooter = (
    <AuthModalAction
      isSubmitting={isSubmitting}
      handleSubmitForm={form.handleSubmit(onSubmit)}
      formType="register"
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