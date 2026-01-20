"use client";

import { DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";

type CalendarInputProps = {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
};

export default function CalendarInput({ 
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}: CalendarInputProps) {
  const dateRange: DateRange | undefined = {
    from: startDate || undefined,
    to: endDate || undefined,
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (!range) {
      // Clear selection
      onStartDateChange(undefined);
      onEndDateChange(undefined);
      return;
    }

    const { from, to } = range;

    // If only 'from' is selected (single date click)
    if (from && !to) {
      onStartDateChange(from);
      onEndDateChange(undefined);
      return;
    }

    // If both dates are selected
    if (from && to) {
      // Check if the user clicked on an already selected date to "undo"
      if (startDate && endDate) {
        const fromTime = from.getTime();
        const toTime = to.getTime();
        const startTime = startDate.getTime();
        const endTime = endDate.getTime();

        // If user clicked the same range again, clear the end date
        if (fromTime === startTime && toTime === endTime) {
          onStartDateChange(from);
          onEndDateChange(undefined);
          return;
        }
      }

      // Normal case: set the range
      onStartDateChange(from);
      onEndDateChange(to);
    }
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">When's your trip?</h2>
        <p className="text-muted-foreground">Select your check-in and check-out dates</p>
      </div>

      <Calendar
        mode="range"
        selected={dateRange}
        onSelect={handleDateRangeChange}
        disabled={isDateDisabled}
        numberOfMonths={2}
        className="rounded-md border"
      />
    </div>
  );
}