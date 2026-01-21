// components/home/listing-section.tsx
'use client';
import { Suspense } from 'react';
import { formatter } from '@/utils/formatters';
import { ErrorBoundary } from 'react-error-boundary';
import useCountries from '@/hooks/useCountries';

import FavouritesList from '../components/favourites-list';
import EmptyState from '@/components/global-ui/empty-state';
import { useTRPC } from '@/trpc/react';
import { useSuspenseQuery } from '@tanstack/react-query';

export const FavouritesSection = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={        
          <EmptyState 
            title="Error loading favourites" 
            subtitle="Please try again later." 
          />
        }>
        <FavouritesSectionContent />
      </ErrorBoundary>
    </Suspense>
  );
};

const FavouritesSectionContent = () => {
  const trpc = useTRPC()
  const {data} = useSuspenseQuery(trpc.favourites.getUserFavourites.queryOptions());

  const favourites = data.favourites;

  // Handle no favourites case
  if (favourites.length === 0) {
    return (
      <EmptyState 
      title="No favourites found" 
      subtitle="You have no favourites on your favourites." 
      />
    );
  }

  const { getByValue } = useCountries();
  const formattedListings = favourites.map((item) => {
    const country = getByValue(item.listing.locationValue);
    return {
      id: item.listing.id,
      locationRegion: country?.region ?? "Unknown Region",
      locationLabel: country?.label ?? "Unknown Location",
      imgSrc: item.listing.imgSrc,
      category: item.listing.category,
      price: formatter.format(item.listing.price),
      isFavoritedByCurrentUser: item.isFavorited,
    };
  });

  return <FavouritesList data={formattedListings} />;
};
