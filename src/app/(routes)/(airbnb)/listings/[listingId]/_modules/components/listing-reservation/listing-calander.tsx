// components/listing-reservation/listing-calander.tsx
"use client";

import { UseFormReturn } from "react-hook-form";
import { ReservationFormValues } from "@/schemas";
import { DateRange } from "react-day-picker";

import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";

type ListingCalendarProps = {
  form: UseFormReturn<ReservationFormValues>;
  disabledDates: Date[];
};

export default function ListingCalendar({
  form,
  disabledDates,
}: ListingCalendarProps) {
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");

  const dateRange: DateRange = {
    from: startDate || undefined,
    to: endDate || undefined,
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (!range) {
      form.setValue("startDate", undefined);
      form.setValue("endDate", undefined);
      return;
    }

    const { from, to } = range;

    if (from && !to) {
      form.setValue("startDate", from);
      form.setValue("endDate", undefined);
      return;
    }

    if (from && to) {
      // If clicking the same range, deselect it
      if (startDate && endDate) {
        const fromTime = from.getTime();
        const toTime = to.getTime();
        const startTime = startDate.getTime();
        const endTime = endDate.getTime();

        if (fromTime === startTime && toTime === endTime) {
          form.setValue("startDate", from);
          form.setValue("endDate", undefined);
          return;
        }
      }

      form.setValue("startDate", from);
      form.setValue("endDate", to);
    }
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isReservedDate = (date: Date) => {
    return disabledDates.some(
      (disabled) => date.toDateString() === disabled.toDateString()
    );
  };

  const isDateDisabled = (date: Date) => {
    return isPastDate(date) || isReservedDate(date);
  };

  return (
    <FormField
      control={form.control}
      name="startDate"
      render={() => (
        <FormItem className="flex flex-col w-full">
          <FormControl>
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={handleDateRangeChange}
              disabled={isDateDisabled}
              numberOfMonths={1}
              className="w-full p-0 [&_.rdp-months]:w-full [&_.rdp-month]:w-full [&_table]:w-full [&_td]:p-0 [&_th]:p-2 [&_.rdp-day]:h-12 [&_.rdp-day]:w-full [&_.rdp-day]:text-base [&_.rdp-caption]:text-lg [&_.rdp-caption]:font-semibold"
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}