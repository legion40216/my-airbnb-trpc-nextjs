// components/listing-section-content.tsx
"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { categories } from "@/data/constants";
import useCountries from "@/hooks/useCountries";

import EmptyState from "@/components/global-ui/empty-state";
import HeadingState from "@/components/global-ui/heading-state";
import ListingImg from "../components/listing-img";
import ListingInfo from "../components/listing-info";
import ListingReservation from "../components/listing-reservation";
import { useTRPC } from "@/trpc/react";

export const ListingSectionContent = ({ listingId }: { listingId: string }) => {
  const trpc = useTRPC();
  
  // Fetch the listing data using tRPC
  const { data } = useSuspenseQuery(
    trpc.listings.getByListingId.queryOptions({ listingId })
  );

  const listing = data?.listing;

  if (!listing) return <EmptyState />;

  const { getByValue } = useCountries();
  const country = listing.locationValue
    ? getByValue(listing.locationValue)
    : null;

  const formattedListing = {
    listingId: listing.id,
    title: listing.title,
    description: listing.description,
    category: listing.category,
    roomCount: listing.roomCount,
    bathroomCount: listing.bathroomCount,
    guestCount: listing.guestCount,
    locationRegion: country?.region,
    locationLabel: country?.label,
    price: listing.price || 0,
    // Use the first image from the images array if available
    imgSrc: listing.imgSrc
  };

  const subtitle = `${formattedListing.locationRegion}, ${formattedListing.locationLabel}`;
  const category = categories.find(
    (item) => item.label === formattedListing.category
  );

  // Convert reservations to disabled dates
  const disabledDates: Date[] = [];
  listing.reservations?.forEach((reservation) => {
    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);
    const currentDate = new Date(start);

    while (currentDate <= end) {
      disabledDates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  return (
    <div className="space-y-4">
      {/* Listing Title and Image Section */}
      <div className="space-y-4">
        <HeadingState title={formattedListing.title} subtitle={subtitle} />

        <ListingImg 
        listingId={formattedListing.listingId}
        imgSrc={formattedListing.imgSrc} 
        />
      </div>
      {/* Information and Reservation Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10">
        <ListingInfo
          category={category}
          description={formattedListing.description}
          roomCount={formattedListing.roomCount}
          guestCount={formattedListing.guestCount}
          bathroomCount={formattedListing.bathroomCount}
          locationValue={listing.locationValue}
        />

        <ListingReservation
          price={formattedListing.price}
          listingId={formattedListing.listingId}
          disabledDates={disabledDates}
        />
      </div>
    </div>
  );
};