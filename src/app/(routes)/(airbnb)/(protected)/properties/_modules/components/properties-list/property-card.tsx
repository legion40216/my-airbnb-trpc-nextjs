// components/PropertyCard.tsx
"use client";
import React, { useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";
import Image from "next/image";

import HeartButton from "@/components/global-ui/heart-button";
import CardBtn from "@/components/global-ui/airbnb-buttons/card-btn";
import ConfirmModal from "@/components/global-ui/modal/confirm-modal";

import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type PropertyCardProps = {
  id: string;
  locationRegion: string;
  locationLabel: string;
  imgSrc: string;
  category: string;
  price: string;
  isFavoritedByCurrentUser?: boolean;
};

export default function PropertyCard({
  id: listingId,
  locationRegion,
  locationLabel,
  imgSrc,
  category,
  price,
  isFavoritedByCurrentUser = false,
}: PropertyCardProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const toastLoading = "Deleting property... Please wait.";
  const toastMessage = "Property deleted successfully!";

  const deleteListing = useMutation({
    ...trpc.properties.delete.mutationOptions(),
    onSuccess: (data) => {
      // Invalidate queries manually with queryClient
      queryClient.invalidateQueries({ 
        queryKey: [['properties', 'getUserProperties']] 
      });
      toast.success(toastMessage);
      setOpen(false);
    },
    onError: (error) => {
      console.error("Error deleting property:", error);
      toast.error(error.message || "Something went wrong.");
      setOpen(false);
    },
  });

  const handleDelete = async () => {
    const toastId = toast.loading(toastLoading);
    try {
      await deleteListing.mutateAsync({ listingId });
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
          className="aspect-square overflow-hidden rounded-xl relative group 
          cursor-pointer border"
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
            className="object-cover h-full w-full group-hover:scale-110 
            transition"
            src={imgSrc}
            alt="Property"
          />
        </div>
        { /* Details */}
        <div>
          <p className="font-semibold text-lg">
            <span className="text-neutral-600">{locationRegion}, </span>
            {locationLabel}
          </p>
          <p className="font-light text-neutral-500">{category}</p>
        </div>
        {/* Price */}
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">
            <p className="font-semibold">{price}</p>
            <p className="font-light">night</p>
          </div>
        </div>
      </div>
      { /* Delete Button */}
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
          Delete property
        </CardBtn>
      </ConfirmModal>
    </div>
  );
}