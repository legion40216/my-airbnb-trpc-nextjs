// components/ReservationCard.tsx
"use client";
import { useState } from "react";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

import HeartButton from "@/components/global-ui/heart-button";
import ConfirmModal from "@/components/global-ui/modal/confirm-modal";
import CardBtn from "@/components/global-ui/airbnb-buttons/card-btn";

import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type ReservationCardProps = {
  id: string;
  listingId: string;
  locationRegion: string;
  locationLabel: string;
  imgSrc: string;
  category: string;
  price: string;
  reservationDate: string;
  reservedBy?: string; 
  isFavoritedByCurrentUser?: boolean;
};

export default function ReservationCard({
  id: reservationId,
  listingId,
  locationRegion,
  locationLabel,
  imgSrc,
  price,
  reservationDate, 
  reservedBy,
  isFavoritedByCurrentUser,
}: ReservationCardProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const toastLoading = "Deleting Reservation... Please wait.";
  const toastMessage = "Reservation deleted successfully!";

  const deleteListing = useMutation({
    ...trpc.reservations.delete.mutationOptions(),
    onSuccess: (data) => {
      // Invalidate queries manually with queryClient
      queryClient.invalidateQueries({ 
        queryKey: [['reservations', 'getUserReservations']] 
      });
      toast.success(toastMessage);
      setOpen(false);
    },
    onError: (error) => {
      console.error("Error deleting reservation:", error);
      toast.error(error.message || "Something went wrong.");
      setOpen(false);
    },
  });

  // Function to handle deletion of the reservation
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
        {/* IMAGE */}
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

        {/* LOCATION */}
        <div>
          <p className="font-semibold text-lg">
            <span className="text-neutral-600">{locationRegion}, </span>
            <span>{locationLabel}</span>
          </p>
          <p className="font-light text-neutral-500">
            {reservationDate}
          </p>
        </div>

         {/* PRICE */}
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">
            <p className="font-semibold">{price}</p>
            <p className="font-light">night</p>
          </div>
          <div>
            <p className='font-semibold'>
              <span className='font-light'>Reserved by: </span>
              <span>{reservedBy}</span>
            </p>
          </div>
        </div>
      </div>

      {/* DElETE RESERVATION */}
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
          Delete Reservation
        </CardBtn>
      </ConfirmModal>
    </div>
  );
}