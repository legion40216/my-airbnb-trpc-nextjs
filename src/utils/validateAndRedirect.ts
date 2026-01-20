// utils/validateAndRedirect.ts

import { CATEGORY_LABELS } from '@/data/constants';
import { SearchParamsValues } from '@/schemas';


type RawSearchParams = { [key: string]: string | string[] | undefined };

/**
 * Validates raw search params and returns a redirect URL if params are invalid
 * Returns null if params are valid
 */
export function getRedirectUrlIfInvalid(
  rawParams: RawSearchParams,
  validatedParams: SearchParamsValues
): string | null {
  let hasInvalidParam = false;

  // Helper to safely get string value
  const getString = (key: string): string | undefined => {
    const val = rawParams[key];
    return typeof val === 'string' ? val : undefined;
  };

  // Check each parameter for validity
  const rawCategory = getString('category');
  if (rawCategory && !CATEGORY_LABELS.includes(rawCategory as any)) {
    hasInvalidParam = true;
  }

  const rawGuestCount = getString('guestCount');
  if (rawGuestCount) {
    const num = Number(rawGuestCount);
    if (isNaN(num) || num < 1) hasInvalidParam = true;
  }

  const rawRoomCount = getString('roomCount');
  if (rawRoomCount) {
    const num = Number(rawRoomCount);
    if (isNaN(num) || num < 1) hasInvalidParam = true;
  }

  const rawBathroomCount = getString('bathroomCount');
  if (rawBathroomCount) {
    const num = Number(rawBathroomCount);
    if (isNaN(num) || num < 1) hasInvalidParam = true;
  }

  const rawStartDate = getString('startDate');
  if (rawStartDate && isNaN(new Date(rawStartDate).getTime())) {
    hasInvalidParam = true;
  }

  const rawEndDate = getString('endDate');
  if (rawEndDate && isNaN(new Date(rawEndDate).getTime())) {
    hasInvalidParam = true;
  }

  // If any param is invalid, build clean URL
  if (hasInvalidParam) {
    return buildCleanUrl(validatedParams);
  }

  return null;
}

/**
 * Builds a clean URL from validated params, excluding defaults
 */
function buildCleanUrl(params: SearchParamsValues): string {
  const urlParams = new URLSearchParams();

  // Only add non-default values
  if (params.locationValue) {
    urlParams.set('locationValue', params.locationValue);
  }
  if (params.category) {
    urlParams.set('category', params.category);
  }
  if (params.guestCount > 1) {
    urlParams.set('guestCount', params.guestCount.toString());
  }
  if (params.roomCount > 1) {
    urlParams.set('roomCount', params.roomCount.toString());
  }
  if (params.bathroomCount > 1) {
    urlParams.set('bathroomCount', params.bathroomCount.toString());
  }
  if (params.startDate) {
    urlParams.set('startDate', params.startDate.toISOString());
  }
  if (params.endDate) {
    urlParams.set('endDate', params.endDate.toISOString());
  }

  const queryString = urlParams.toString();
  return queryString ? `/?${queryString}` : '/';
}