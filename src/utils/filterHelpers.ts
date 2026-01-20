// ============================================
// 3. utils/filterHelpers.ts - Conversion utilities
// ============================================

import { SearchParamsValues } from "@/schemas";
import { CategoryLabel } from "@/types/type";

export interface FilterStateModal {
  locationValue: string | undefined;
  startDate: Date | undefined;
  endDate: Date | undefined;
  guestCount: number;
  roomCount: number;
  bathroomCount: number
}

export interface FilterState {
  locationValue: string | undefined;
  startDate: Date | undefined;
  endDate: Date | undefined;
  guestCount: number;
  roomCount: number;
  bathroomCount: number
  category: CategoryLabel | undefined
}

// Convert URL params to FilterState
export function searchParamsToFilterModal(params: SearchParamsValues): FilterStateModal {
  return {
    locationValue: params.locationValue,
    startDate: params.startDate,
    endDate: params.endDate,
    guestCount: params.guestCount,
    roomCount: params.roomCount,
    bathroomCount: params.bathroomCount
  };
}

// Convert FilterState to URL search params object
export function filterToSearchParamsModal(filters: FilterStateModal): Record<string, string> {
  const params: Record<string, string> = {};
  
  if (filters.locationValue) params.locationValue = filters.locationValue;
  if (filters.startDate) params.startDate = filters.startDate.toISOString();
  if (filters.endDate) params.endDate = filters.endDate.toISOString();
  if (filters.guestCount) params.guestCount = filters.guestCount.toString();
  if (filters.roomCount) params.roomCount = filters.roomCount.toString();
  if (filters.bathroomCount) params.bathroomCount = filters.bathroomCount.toString();
  
  return params;
}

export function searchParamsToFilter(params: SearchParamsValues): FilterState {
  return {
    locationValue: params.locationValue,
    startDate: params.startDate,
    endDate: params.endDate,
    guestCount: params.guestCount,
    roomCount: params.roomCount,
    bathroomCount: params.bathroomCount,
    category: params.category
  };
}