"use client";
import { useRouter } from "next/navigation";

import SecondaryBtn from "@/components/global-ui/airbnb-buttons/secondary-btn";

export default function RemoveFilterBtn({
  setOpen,
}: {
  setOpen?: (open: boolean) => void;
}) {
  const router = useRouter();

  const handleClick = () => {
    if (setOpen) {
      setOpen(false); // Close the modal
    }
    router.push("/"); // Navigate to home or reset filters
  };

  return <SecondaryBtn onClick={handleClick}>Remove all filters</SecondaryBtn>;
}
