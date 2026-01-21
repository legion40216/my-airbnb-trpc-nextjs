'use client';
import { Suspense } from 'react';

import { formatter } from '@/utils/formatters';
import { ErrorBoundary } from 'react-error-boundary';
import useCountries from '@/hooks/useCountries';
import { format } from 'date-fns';

import ReservationsList from '../components/reservations-list';
import EmptyState from '@/components/global-ui/empty-state';
import { useTRPC } from '@/trpc/react';
import { useSuspenseQuery } from '@tanstack/react-query';

export const ReservationsSection = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={
        <EmptyState 
            title="Unable to Load Reservations" 
            subtitle="We're experiencing technical difficulties. Please try again later."
          />
        }>
        <ReservationsSectionContent />
      </ErrorBoundary>
    </Suspense>
  );
};

const ReservationsSectionContent = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.reservations.getUserReservations.queryOptions()
  );

  const reservation = data.reservations;
  // Handle no reservations case
  if (reservation.length === 0) {
    return (
      <EmptyState 
        title="No reservations found" 
        subtitle="You have no reservations on your properties." 
      />
    );
  }

  // Format data
  const { getByValue } = useCountries();
  const formattedListings = reservation.map((item) => {
    const country = getByValue(item.listing.locationValue);
    // Format startDate and endDate to a readable string
    const reservationDate = `${format(new Date(item.startDate), "MMM d, yyyy")} – ${format(new Date(item.endDate), "MMM d, yyyy")}`;
    
    return {
      id: item.id,
      listingId: item.listing.id,
      locationRegion: country?.region || "Unknown region",
      locationLabel: country?.label || "Unknown location",
      imgSrc: item.listing.imgSrc,
      category: item.listing.category,
      price: formatter.format(item.totalPrice),
      reservationDate: reservationDate,
      reservedBy: item.user.name || item.user.email || 'Unknown user',
      isFavoritedByCurrentUser: item.listing.isFavorited,
    };
  });

  return <ReservationsList data={formattedListings} />;
};