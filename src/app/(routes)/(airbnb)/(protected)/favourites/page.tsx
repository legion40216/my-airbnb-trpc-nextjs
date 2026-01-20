import React from 'react';

import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import FavouritesView from './_modules/view/favourites-view';
import { currentUser } from '@/hooks/server-auth-utils';
import EmptyState from '@/components/global-ui/empty-state';

export default async function FavouritesPage() {
  // Get current user
  const user = await currentUser();
  const userId = user?.id;

  // Authorization
  if (!userId) {
    return (
      <EmptyState 
      title="Unauthorized"
      subtitle="Please log in to view your favourites."
      />
    );
  }

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.favourites.getUserFavourites.queryOptions()
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FavouritesView />
    </HydrationBoundary>
  );
}