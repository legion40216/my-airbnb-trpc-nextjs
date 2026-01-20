import { redirect } from 'next/navigation';
import HomeView from './_modules/view/home-view';

import { getValidatedSearchParams } from '@/utils/parseSearchParams';
import { getRedirectUrlIfInvalid } from '@/utils/validateAndRedirect';
import { getQueryClient, trpc } from '@/trpc/server';

export default async function Page(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const rawSearchParams = await props.searchParams;
  const validatedParams = getValidatedSearchParams(rawSearchParams);
  
  // Check if URL has invalid params and redirect if needed
  const redirectUrl = getRedirectUrlIfInvalid(rawSearchParams, validatedParams);
  if (redirectUrl) {
    redirect(redirectUrl);
  }

  const queryClient = getQueryClient();
  // Change this line - use .queryOptions() with the input
  await queryClient.prefetchQuery(
    trpc.listings.getSearch.queryOptions(validatedParams)
  );

  return (
    <div>
      <HomeView queryInput={validatedParams} />
    </div>
  );
}