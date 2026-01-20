// components/auth/RegisterForm.tsx
'use client';

import { UseFormReturn } from 'react-hook-form';
import { RegisterFormValues } from '@/schemas';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type RegisterFormProps = {
  form: UseFormReturn<RegisterFormValues>;
  isSubmitting: boolean;
};

export default function RegisterForm({ form, isSubmitting }: RegisterFormProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="John Doe"
                disabled={isSubmitting}
                autoComplete="name"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="john.doe@example.com"
                type="email"
                disabled={isSubmitting}
                autoComplete="email"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="Create a strong password"
                type="password"
                disabled={isSubmitting}
                autoComplete="new-password"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}