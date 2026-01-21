import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import PropertiesView from './_modules/view/properties-view';
import { currentUser } from '@/hooks/server-auth-utils';

import EmptyState from '@/components/global-ui/empty-state';

export default async function PropertiesPage() {
  // Get current user
  const user = await currentUser();
  const userId = user?.id;

  // Authorization
  if (!userId) {
    return (
      <EmptyState 
      title="Unauthorized"
      subtitle="Please log in to view your properites."
      />
    );
  }

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.properties.getUserProperties.queryOptions()
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PropertiesView />
    </HydrationBoundary>
  );
}