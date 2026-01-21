// components/home/listing-section.tsx
'use client';
import React, { Suspense } from 'react';

import { formatter } from '@/utils/formatters';
import { ErrorBoundary } from 'react-error-boundary';
import useCountries from '@/hooks/useCountries';

import PropertiesList from '../components/properties-list';
import EmptyState from '@/components/global-ui/empty-state';
import { useTRPC } from '@/trpc/react';
import { useSuspenseQuery } from '@tanstack/react-query';

export const PropertiesSection = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary fallback={
        <EmptyState 
        title="Error loading properties" 
        subtitle="Please try again later." 
        />
        }>
        <PropertiesSectionContent />
      </ErrorBoundary>
    </Suspense>
  );
};

const PropertiesSectionContent = () => {
  const trpc = useTRPC()
  const {data} = useSuspenseQuery(trpc.properties.getUserProperties.queryOptions());
  const properties = data.listings;

  if (properties.length === 0) {
    return (
      <EmptyState 
      title="No properties found" 
      subtitle="You have no properties." 
      />
    );
  }

  const { getByValue } = useCountries();
  const formattedListings = properties.map((item) => {
    const country = getByValue(item.locationValue);
    return {
      id: item.id,
      locationRegion: country?.region ?? "Unknown Region",
      locationLabel: country?.label ?? "Unknown Location",
      imgSrc: item.imgSrc,
      category: item.category,
      price: formatter.format(item.price),
      isFavoritedByCurrentUser: item.isFavorited,
    };
  });

  return <PropertiesList data={formattedListings} />;
};
