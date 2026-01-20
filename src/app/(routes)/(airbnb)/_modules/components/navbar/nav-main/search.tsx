"use client";
import { useMemo } from "react";
import { SearchIcon } from "lucide-react";
import { differenceInDays, format } from "date-fns";
import { useSearchParams } from "next/navigation";

import useCountries from "@/hooks/useCountries";
import { useMultiModalStore } from "@/hooks/useMultiModalStore";
import { getValidatedSearchParams } from "@/utils/parseSearchParams";

export default function Search() {
  const params = useSearchParams();
  const { getByValue } = useCountries();
  const { openModal } = useMultiModalStore();

  const validatedParams = getValidatedSearchParams(params);
  const { locationValue, startDate, endDate, guestCount } = validatedParams;

  // Location label: show country name or default to 'Anywhere'
  const locationLabel = useMemo(() => {
    if (locationValue) {
      const country = getByValue(locationValue);
      return country ? country.label : "Anywhere";
    }
    return "Anywhere";
  }, [getByValue, locationValue]);

  // Duration label: calculate difference in days or show date range
  const durationLabel = useMemo(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diff = Math.max(1, differenceInDays(end, start));

      // Option 1: Show day count
      return `${diff} ${diff === 1 ? 'Day' : 'Days'}`;
      
      // Option 2: Show actual dates (uncomment to use)
      // return `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`;
    }

    return "Any Week";
  }, [startDate, endDate]);

  // Guest label: show guest count or default to 'Add Guests'
  const guestLabel = useMemo(() => {
    if (guestCount && guestCount > 1) {
      return `${guestCount} ${guestCount === 1 ? 'Guest' : 'Guests'}`;
    }
    return "Add Guests";
  }, [guestCount]);

  // Check if any filters are active (for visual feedback)
  const hasActiveFilters = !!(
    locationValue || 
    (startDate && endDate) || 
    (guestCount && guestCount > 1)
  );

  return (
    <button
      type="button"
      className="flex items-center justify-between gap-2 w-full 
        md:w-auto px-4 py-2 shadow-sm hover:shadow-md transition-shadow
        border border-gray-300 rounded-full cursor-pointer
        bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 
        focus:ring-offset-2"
      onClick={() => openModal("search")}
      aria-label="Search properties"
    >
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {/* Location */}
        <div className="text-sm font-semibold text-gray-700 truncate">
          {locationLabel}
        </div>

        {/* Duration - Hidden on mobile */}
        <div className="hidden sm:flex items-center px-3 border-x border-gray-200">
          <span className={`text-sm truncate ${
            startDate && endDate ? 'text-gray-700 font-medium' : 'text-gray-500'
          }`}>
            {durationLabel}
          </span>
        </div>

        {/* Guests - Hidden on mobile */}
        <div className="hidden sm:flex items-center">
          <span className={`text-sm truncate ${
            guestCount && guestCount > 1 ? 'text-gray-700 font-medium' : 'text-gray-500'
          }`}>
            {guestLabel}
          </span>
        </div>
      </div>

      {/* Search Icon */}
      <div className={`p-2 rounded-full text-white transition-colors shrink-0 ${
        hasActiveFilters ? 'bg-rose-500' : 'bg-rose-400'
      }`}>
        <SearchIcon className="w-4 h-4" />
      </div>
    </button>
  );
}