"use client"
import HeartButton from '@/components/global-ui/heart-button';
import Image from 'next/image';

interface ListingImgProps {
  listingId: string;
  imgSrc: string;
}

export default function ListingImg({
listingId,
imgSrc
}: ListingImgProps) {
  return (
    <div
      className="w-full h-[60vh] overflow-hidden rounded-xl
        relative"
    >
      <Image
        fill
        src={imgSrc}
        alt="Image"
        className="object-cover w-full"
      />

      <div className="absolute top-3 right-3 z-10">
        <HeartButton listingId={listingId} />
      </div>
    </div>
  );
}
