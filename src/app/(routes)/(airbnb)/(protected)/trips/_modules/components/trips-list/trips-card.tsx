// components/home/trips-list/trips-card.tsx
"use client";
import { useState } from "react";

import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";

import HeartButton from "@/components/global-ui/heart-button";
import CardBtn from "@/components/global-ui/airbnb-buttons/card-btn";
import ConfirmModal from "@/components/global-ui/modal/confirm-modal";

type TripCardProps = {
  id: string;
  locationRegion: string;
  locationLabel: string;
  imgSrc: string;
  price: string;
  reservationDate: string;
  listingId: string;
  isFavoritedByCurrentUser?: boolean;
};

export default function TripCard({
  id: reservationId,
  locationRegion,
  locationLabel,
  imgSrc,
  price,
  reservationDate,
  listingId,
  isFavoritedByCurrentUser
}: TripCardProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const toastLoading = "Deleting trip... Please wait.";
  const toastMessage = "Trip deleted successfully!";

  const deleteListing = useMutation({
    ...trpc.trips.delete.mutationOptions(),
    onSuccess: (data) => {
      // Invalidate queries manually with queryClient
      queryClient.invalidateQueries({ 
        queryKey: [['trips', 'getUserTrips']] 
      });
      toast.success(toastMessage);
      setOpen(false);
    },
    onError: (error) => {
      console.error("Error deleting trip:", error);
      toast.error(error.message || "Something went wrong.");
      setOpen(false);
    },
  });

  const handleDelete = async () => {
    const toastId = toast.loading(toastLoading);
    try {
      await deleteListing.mutateAsync({ reservationId });
      // Success handling is done in onSuccess callback
    } catch (error) {
      // Error handling is done in onError callback
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="space-y-2">
      <div>
        {/* Image */}
        <div
          className="aspect-square overflow-hidden rounded-xl relative group cursor-pointer border"
          onClick={() => router.push(`/listings/${listingId}`)}
        >
          <div className="absolute top-3 right-3 z-10">
            <HeartButton 
            listingId={listingId} 
            isFavoritedByCurrentUser={isFavoritedByCurrentUser}
            />
          </div>
          <Image
            fill
            className="object-cover h-full w-full group-hover:scale-110 transition"
            src={imgSrc}
            alt="Reservation"
          />
        </div>
        {/* Details */}
        <div>
          <p className="font-semibold text-lg">
            <span className="text-neutral-600">{locationRegion}, </span>
            <span>{locationLabel}</span>
          </p>
          <p className="font-light text-neutral-500">
            {reservationDate}
          </p>
        </div>
         {/* Price and Reserved By */}
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">
            <p className="font-semibold">{price}</p>
            <p className="font-light">night</p>
          </div>
        </div>
      </div>
        {/* Delete Button */}
      <ConfirmModal 
      onConfirm={handleDelete} 
      open={open} 
      setOpen={setOpen}
      isDisabled={deleteListing.isPending}
      >
        <CardBtn
        onClick={() => setOpen(true)}
        disabled={deleteListing.isPending}
        >
          Delete trip
        </CardBtn>
      </ConfirmModal>
    </div>
  );
}