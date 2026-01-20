"use client";
import Image from "next/image";
import Link from "next/link";
import HeartButton from "./heart-button";

type ListingCardProps = {
  id: string;
  locationRegion: string;
  locationLabel: string;
  imgSrc: string;
  category: string;
  price: string;
  isFavoritedByCurrentUser?: boolean;
};

export default function ListingCard({
  id: listingId,
  locationRegion,
  locationLabel,
  imgSrc,
  category,
  price,
  isFavoritedByCurrentUser,
}: ListingCardProps) {

  return (
    <div>
      {/* Image container - moved outside Link */}
      <div className="aspect-square overflow-hidden rounded-xl relative 
        group cursor-pointer border"
      >
        {/* HeartButton outside Link */}
        <div className="absolute top-3 right-3 z-10">
          <HeartButton 
            listingId={listingId}
            isFavoritedByCurrentUser={isFavoritedByCurrentUser}
          />
        </div>
        
        {/* Link only wraps the image */}
        <Link href={`/listings/${listingId}`}>
          <Image
            fill
            className="object-cover h-full w-full group-hover:scale-110 transition"
            src={imgSrc}
            alt="Listing"
          />
        </Link>
      </div>

      {/* Details */}
      <div>
        <p className="font-semibold text-lg">
          <span className="text-neutral-600">
            {locationRegion},{' '}
          </span>
          {locationLabel}
        </p>
        <p className="font-light text-neutral-500">
          {category}
        </p>
      </div>

      {/* Price */}
      <div className="flex flex-col gap-1">
        <div className="flex gap-1">
          <p className="font-semibold">{price}</p>
          <p className="font-light">night</p>
        </div>
      </div>
    </div>
  );
}