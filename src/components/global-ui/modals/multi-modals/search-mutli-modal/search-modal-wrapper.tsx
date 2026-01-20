"use client";
import React, { useState, useMemo, useEffect } from 'react';

import { useMultiModalStore } from '@/hooks/useMultiModalStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { getValidatedSearchParams } from '@/utils/parseSearchParams';
import { FilterStateModal, filterToSearchParamsModal, searchParamsToFilterModal, } from '@/utils/filterHelpers';

import LocationInput from './search-modal/location-input';
import CounterInput from './search-modal/counter-input';
import CalendarInput from './search-modal/calender-input';
import SearchMultiModal from './search-multi-modal';

// Define step flow for the search process
const STEP_FLOW = ["location", "dates", "guests"] as const;
type Step = typeof STEP_FLOW[number];

type SearchModalProps = {
  title: string;
  description: string;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

export default function SearchModalWrapper({
  title,
  description,
  isOpen,
  setOpen,
}: SearchModalProps) {
  const router = useRouter();
  const params = useSearchParams();
  const { closeModal } = useMultiModalStore();

  const validatedParams = getValidatedSearchParams(params);
  const [filters, setFilters] = useState<FilterStateModal>(() => 
    searchParamsToFilterModal(validatedParams)
  );

  // Setup step navigation
  const [step, setStep] = useState<Step>(STEP_FLOW[0]);
  const [errors, setErrors] = useState<Partial<Record<keyof FilterStateModal, string>>>({});
  
  const currentIndex = useMemo(() => STEP_FLOW.indexOf(step), [step]);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === STEP_FLOW.length - 1;

  // Reset filters with query values when modal opens
  useEffect(() => {
    if (isOpen) {
      const queryDefaults = getValidatedSearchParams(params);
      setStep(STEP_FLOW[0]);
      setFilters(searchParamsToFilterModal(queryDefaults));
    }
  }, [isOpen, params]);

  // Update filter state
  const updateFilter = <K extends keyof FilterStateModal>(
    key: K,
    value: FilterStateModal[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Navigation functions
  const goBack = () => {
    if (!isFirst) {
      setStep(STEP_FLOW[currentIndex - 1]);
    }
  };

  const handleNextOrSubmit = () => {
    setErrors({}); // Clear previous errors
    
    // Optional: Soft validation with warnings
    const newErrors: Partial<Record<keyof FilterStateModal, string>> = {};
    
    if (step === "dates" && filters.startDate && filters.endDate) {
      if (filters.endDate < filters.startDate) {
        newErrors.endDate = "End date must be after start date";
        setErrors(newErrors);
        return;
      }
    }

    // Allow proceeding even without data (flexible search)
    if (!isLast) {
      setStep(STEP_FLOW[currentIndex + 1]);
    } else {
      // No validation needed - backend and URL parsing handle defaults
      updateURL(filters);
    }
  };

  const updateURL = (newFilters: FilterStateModal) => {
    const urlParams = new URLSearchParams();
    const filterParams = filterToSearchParamsModal(newFilters);

    // Only add non-default/non-empty values to URL
    Object.entries(filterParams).forEach(([key, value]) => {
      if (!value) return;
      
      // Skip default values
      if (key === "locationValue" && value === "") return;
      if (key === "guestCount" && value === "1") return;
      if (key === "roomCount" && value === "1") return;
      if (key === "bathroomCount" && value === "1") return;
      
      urlParams.set(key, value);
    });

    const newURL = urlParams.toString() 
      ? `?${urlParams.toString()}` 
      : window.location.pathname;
    
    router.push(newURL, { scroll: false });
    closeModal();
  };

  // Render appropriate step content based on current step
  let currentStepBody: React.ReactNode;
  switch (step) {
    case "location":
      currentStepBody = (
        <LocationInput 
          value={filters.locationValue} 
          onChange={(value) => updateFilter('locationValue', value)} 
        />
      );
      break;
    case "dates":
      currentStepBody = (
        <CalendarInput 
          startDate={filters.startDate}
          endDate={filters.endDate}
          onStartDateChange={(date) => updateFilter('startDate', date)}
          onEndDateChange={(date) => updateFilter('endDate', date)}
        />
      );
      break;
    case "guests":
      currentStepBody = (
        <CounterInput 
          guestCount={filters.guestCount}
          roomCount={filters.roomCount}
          bathroomCount={filters.bathroomCount}
          onGuestCountChange={(count) => updateFilter('guestCount', count)}
          onRoomCountChange={(count) => updateFilter('roomCount', count)}
          onBathroomCountChange={(count) => updateFilter('bathroomCount', count)}
        />
      );
      break;
    default:
      currentStepBody = <div>Unknown step content</div>;
  }

  return (
    <SearchMultiModal
      body={currentStepBody}
      description={description}
      title={title}
      isOpen={isOpen}
      setOpen={setOpen}
      onBack={goBack}
      onNext={handleNextOrSubmit}
      isFirstStep={isFirst}
      isLastStep={isLast}
      nextButtonText={isLast ? "Search" : "Next"}
    />
  );
}