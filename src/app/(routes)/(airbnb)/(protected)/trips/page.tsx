import React from "react";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";
import { currentUser } from "@/hooks/server-auth-utils";

import EmptyState from "@/components/global-ui/empty-state";
import TripsView from "./_modules/view/trips-view";

export default async function page() {
  // Get current user
  const user = await currentUser();
  const userId = user?.id;

  // Authorization
  if (!userId) {
    return (
      <EmptyState
        title="Unauthorized"
        subtitle="Please log in to view your trips."
      />
    );
  }

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.trips.getUserTrips.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TripsView />
    </HydrationBoundary>
  );
}
