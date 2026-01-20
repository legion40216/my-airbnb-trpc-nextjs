// @/hooks/client-auth-utils.ts
import { authClient } from "@/lib/auth-client";

export function useCurrentUser() {
  const { data: session, isPending, error, refetch } = authClient.useSession();
  
  return {
    user: session?.user ?? null,
    session,
    isPending,
    error,
    refetch
  };
}