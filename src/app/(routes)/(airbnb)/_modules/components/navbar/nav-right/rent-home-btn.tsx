import React from "react";
import { useAuthModalStore } from "@/hooks/useAuthModalStore";
import { useCurrentUser } from "@/hooks/client-auth-utils";
import { useMultiModalStore } from "@/hooks/useMultiModalStore";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function RentHomeBtn() {
  const { user, isPending } = useCurrentUser();
  const { openModal } = useMultiModalStore();
  const { openModal: openAuthModal } = useAuthModalStore();

  const handleClick = () => {
    if (user) {
      openModal("rent");
    } else {
      openAuthModal();
    }
  };

  const buttonText = user ? "Rent your home" : "Airbnb your home";

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      className="rounded-full"
      size="lg"
      disabled={isPending}
      aria-label={user ? "List your property for rent" : "Sign in to list your property"}
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        buttonText
      )}
    </Button>
  );
}