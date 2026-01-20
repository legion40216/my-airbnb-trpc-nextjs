// utils/listingFilters.ts
import { FilterState } from "@/utils/filterHelpers";

type Listing = {
  id: string;
  locationValue: string;
  category: string;
  guestCount: number;
  roomCount: number;
  bathroomCount: number;
  reservations?: Array<{ startDate: Date | string; endDate: Date | string }>;
  price: number;
  imgSrc: string;
};

/**
 * Filters listings based on search parameters
 */
export function filterListings(
  listings: Listing[],
  filters: FilterState
): Listing[] {
  return listings.filter((listing) => {
    // Location filter
    if (filters.locationValue && listing.locationValue !== filters.locationValue) {
      return false;
    }

    // Category filter
    if (filters.category && listing.category !== filters.category) {
      return false;
    }

    // Guest count filter (listing must accommodate at least the requested guests)
    if (listing.guestCount < filters.guestCount) {
      return false;
    }

    // Room count filter
    if (listing.roomCount < filters.roomCount) {
      return false;
    }

    // Bathroom count filter
    if (listing.bathroomCount < filters.bathroomCount) {
      return false;
    }

    // Date availability filter
    if (filters.startDate && filters.endDate) {
      if (isListingBooked(listing, filters.startDate, filters.endDate)) {
        return false;
      }
    }

    return true;
  });
}

/**
 * Checks if a listing is booked during the specified date range
 */
function isListingBooked(
  listing: Listing,
  requestedStart: Date,
  requestedEnd: Date
): boolean {
  if (!listing.reservations || listing.reservations.length === 0) {
    return false; // No reservations = available
  }

  return listing.reservations.some((reservation) => {
    const resStart = new Date(reservation.startDate);
    const resEnd = new Date(reservation.endDate);
    
    // Check for date overlap
    // Overlap occurs if: requestedStart <= resEnd AND requestedEnd >= resStart
    return requestedStart <= resEnd && requestedEnd >= resStart;
  });
}

/**
 * Checks if any filters are active (non-default values)
 */
export function hasActiveFilters(filters: FilterState): boolean {
  return !!(
    filters.locationValue ||
    filters.category ||
    filters.guestCount > 1 ||
    filters.roomCount > 1 ||
    filters.bathroomCount > 1 ||
    filters.startDate ||
    filters.endDate
  );
}

/**
 * Gets a human-readable summary of active filters
 */
export function getFilterSummary(filters: FilterState): string {
  const parts: string[] = [];
  
  if (filters.locationValue) parts.push(`Location: ${filters.locationValue}`);
  if (filters.category) parts.push(`Category: ${filters.category}`);
  if (filters.guestCount > 1) parts.push(`${filters.guestCount} guests`);
  if (filters.roomCount > 1) parts.push(`${filters.roomCount} rooms`);
  if (filters.bathroomCount > 1) parts.push(`${filters.bathroomCount} bathrooms`);
  if (filters.startDate && filters.endDate) {
    parts.push(`${filters.startDate.toLocaleDateString()} - ${filters.endDate.toLocaleDateString()}`);
  }
  
  return parts.join(' • ');
}