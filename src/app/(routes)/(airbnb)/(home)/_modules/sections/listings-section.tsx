'use client';
import { SearchParamsValues } from "@/schemas";
import { formatter } from "@/utils/formatters";
import countryUtils from "@/utils/countryUtils";
import { useTRPC } from "@/trpc/react";
import { useSuspenseQuery } from "@tanstack/react-query";

import RemoveFilterBtn from "@/components/global-ui/airbnb-buttons/remove-filter-btn";
import EmptyState from "@/components/global-ui/empty-state";
import ListingLists from "@/components/global-ui/listings-list";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const MainSectionContent = ({ queryInput }: { queryInput: SearchParamsValues }) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.listings.getSearch.queryOptions(queryInput));
  
  const listings = data.listings;

  const formattedListings = listings.map((item) => {
    const country = countryUtils.getByValue(item.locationValue);
    
    return {
      id: item.id,
      locationRegion: country?.region ?? "Unknown Region",
      locationLabel: country?.label ?? "Unknown Location",
      imgSrc: item.imgSrc,
      category: item.category,
      price: formatter.format(item.price),
      isFavoritedByCurrentUser: item.isFavoritedByCurrentUser,
    };
  });
  
  // Check if user has applied any filters
  const hasFilters = 
    queryInput.category !== undefined ||
    queryInput.locationValue !== "" ||
    queryInput.guestCount > 1 ||
    queryInput.roomCount > 1 ||
    queryInput.bathroomCount > 1 ||
    queryInput.startDate !== undefined ||
    queryInput.endDate !== undefined;

  // Handle empty states
  if (formattedListings.length === 0) {
    if (hasFilters) {
      return (
        <EmptyState
          title="No exact matches"
          subtitle="Try adjusting your search criteria or removing some filters."
        >
          <RemoveFilterBtn />
        </EmptyState>
      );
    } else {
      return (
        <EmptyState
          title="No listings yet"
          subtitle="Be the first to add a property"
        />
      );
    }
  }

  return (
    <>
      {hasFilters && (
        <div className="mb-4 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Showing {formattedListings.length}{" "}
            {formattedListings.length === 1 ? "listing" : "listings"}
          </p>
        </div>
      )}
      <ListingLists data={formattedListings} />
    </>
  );
};

export const ListingsSectionContent = ({ queryInput }: { queryInput: SearchParamsValues }) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorBoundary
        fallback={
          <EmptyState
            title="Failed to Listings"
            subtitle="Please try again later."
          />
        }
      >
        <MainSectionContent queryInput={queryInput} />
      </ErrorBoundary>
    </Suspense>
  );
};