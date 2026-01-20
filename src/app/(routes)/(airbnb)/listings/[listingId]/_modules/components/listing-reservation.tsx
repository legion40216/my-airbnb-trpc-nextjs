// components/listing-reservation.tsx
"use client";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { differenceInDays } from "date-fns";
import { useQueryClient, useMutation } from "@tanstack/react-query";

import { formatter } from "@/utils/formatters";
import { reservationFormSchema, ReservationFormValues } from "@/schemas";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ActionBtn } from "@/components/global-ui/airbnb-buttons/action-btn";
import { Separator } from "@/components/ui/separator";
import ListingCalendar from "./listing-reservation/listing-calander";
import { useTRPC } from "@/trpc/react";

interface ListingReservationProps {
  price: number;
  listingId: string;
  disabledDates: Date[];
}

export default function ListingReservation({
  price,
  listingId,
  disabledDates,
}: ListingReservationProps) {
  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationFormSchema),
    defaultValues: {
      startDate: undefined,
      endDate: undefined,
      listingId: listingId,
      totalPrice: 0,
    },
  });

  // Watch for date changes
  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");

  // Calculate total price based on selected dates
  const totalPrice = useMemo(() => {
    if (startDate && endDate) {
      const dayCount = differenceInDays(endDate, startDate);
      if (dayCount > 0) {
        return dayCount * price;
      }
    }
    return 0;
  }, [startDate, endDate, price]);

  // Update form when total price changes
  useMemo(() => {
    form.setValue("totalPrice", totalPrice);
  }, [totalPrice, form]);

  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // Create reservation mutation
  const createReservation = useMutation({
    ...trpc.reservations.create.mutationOptions(),
    onSuccess: () => {
      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries({
        queryKey: [['reservations']],
      });
      queryClient.invalidateQueries({
        queryKey: [['listings']],
      });
      
      toast.success("Reservation created successfully!");
      form.reset({
        startDate: undefined,
        endDate: undefined,
        listingId: listingId,
        totalPrice: 0,
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create reservation");
      console.error("Error creating reservation:", error);
    },
  });

  const onSubmit = async (data: ReservationFormValues) => {
    if (!data.startDate || !data.endDate) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    const toastId = toast.loading("Creating reservation...");
    
    try {
      await createReservation.mutateAsync({
        startDate: data.startDate,
        endDate: data.endDate,
        totalPrice: totalPrice,
        listingId: listingId,
      });
    } catch (error) {
      // Error handling is done in onError callback
    } finally {
      toast.dismiss(toastId);
    }
  };

  const dayCount = useMemo(() => {
    if (startDate && endDate) {
      return differenceInDays(endDate, startDate);
    }
    return 0;
  }, [startDate, endDate]);

  const isLoading = createReservation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle className="flex items-baseline gap-1">
              <span className="text-2xl font-semibold">
                {formatter.format(price)}
              </span>
              <span className="text-base font-normal text-muted-foreground">
                night
              </span>
            </CardTitle>
            <CardDescription>
              {startDate && endDate
                ? `${dayCount} night${dayCount !== 1 ? "s" : ""} selected`
                : "Select your dates to see the total price"}
            </CardDescription>
          </CardHeader>

          <Separator />

          <CardContent className="pt-6">
            <ListingCalendar form={form} disabledDates={disabledDates} />
          </CardContent>

          <Separator />

          <CardFooter className="flex-col gap-4 pt-6">
            <ActionBtn
              onClick={form.handleSubmit(onSubmit)}
              type="submit"
              disabled={!startDate || !endDate || isLoading}
            >
              {isLoading ? "Reserving..." : "Reserve"}
            </ActionBtn>
            
            {totalPrice > 0 && (
              <>
                <div className="w-full space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="underline">
                      {formatter.format(price)} × {dayCount} night
                      {dayCount !== 1 ? "s" : ""}
                    </span>
                    <span>{formatter.format(totalPrice)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex w-full justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatter.format(totalPrice)}</span>
                </div>
              </>
            )}
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}