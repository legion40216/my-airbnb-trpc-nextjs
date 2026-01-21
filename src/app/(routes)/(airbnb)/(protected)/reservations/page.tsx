import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import ReservationsView from './_modules/view/reservations-view';
import { currentUser } from '@/hooks/server-auth-utils';

import EmptyState from '@/components/global-ui/empty-state';

export default async function ReservationPage() {
  // Get current user
  const user = await currentUser();
  const userId = user?.id;

  // Authorization
  if (!userId) {
    return (
      <EmptyState 
      title="Unauthorized"
      subtitle="Please log in to view your reservations."
      />
    );
  }

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.reservations.getUserReservations.queryOptions()
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReservationsView />
    </HydrationBoundary>
  );
}