// components/home/listing-section.tsx
'use client';
import React, { Suspense } from 'react';

import { formatter } from '@/utils/formatters';
import { ErrorBoundary } from 'react-error-boundary';
import useCountries from '@/hooks/useCountries';
import { format } from 'date-fns';

import EmptyState from '@/components/global-ui/empty-state';
import TripsList from '../components/trips-list';
import { useTRPC } from '@/trpc/react';
import { useSuspenseQuery } from '@tanstack/react-query';

export const TripsSection = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={
        <EmptyState 
        title="Error loading trips" 
        subtitle="Please try again later." 
        />
        }>
        <TripsSectionContent />
      </ErrorBoundary>
    </Suspense>
  );
};

const TripsSectionContent = () => {
  const trpc = useTRPC()
  const {data} = useSuspenseQuery(trpc.trips.getUserTrips.queryOptions());
  const trips = data.listings;
  
  if (trips.length === 0) {
    return (
      <EmptyState 
      title="No trips found" 
      subtitle="You have no trips reserverd." 
      />
    );
  }

  const { getByValue } = useCountries();
  const formattedListings = trips.map((item) => {
  const country = getByValue(item.listing.locationValue);
  const reservationDate = `${format(new Date(item.startDate), "MMM d, yyyy")} – ${format(new Date(item.endDate), "MMM d, yyyy")}`;

  return {
    id: item.id, // reservation ID
    listingId: item.listing.id,
    locationRegion: country?.region || '',
    locationLabel: country?.label || '',
    imgSrc: item.listing.imgSrc,
    category: item.listing.category,
    price: formatter.format(item.totalPrice), // total price for reservation
    reservationDate,
    isFavoritedByCurrentUser: item.listing.isFavorited,
  };
});

  return <TripsList data={formattedListings} />;
};
