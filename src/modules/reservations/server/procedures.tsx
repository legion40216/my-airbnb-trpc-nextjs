
import prisma from "@/lib/prismadb";
import { reservationServerSchema } from "@/schemas";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Prisma } from "../../../../app/generated/prisma/client";

export const reservationsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(reservationServerSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.betterAuthUserId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }
      try {
        const { startDate, endDate, totalPrice, listingId } = input;

        // Check if listing exists and is not deleted
        const listing = await prisma.listing.findUnique({
          where: { id: listingId },
        });

        if (!listing) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Listing not found",
          });
        }

        // Optional: Check that user is not booking their own listing
        // if (listing.userId === ctx.betterAuthUserId) {
        //   throw new TRPCError({
        //     code: "FORBIDDEN",
        //     message: "You cannot reserve your own listing.",
        //   });
        // }

        const reservation = await prisma.reservation.create({
          data: {
            startDate,
            endDate,
            totalPrice,
            userId: ctx.betterAuthUserId,
            listingId,
          },
        });

        return {
          success: true,
          message: "Reservation created successfully",
        };
      } catch (error) {
        // Re-throw tRPC errors as-is
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error("Error reservation [create]:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create reservation",
        });
      }
    }),

  getUserReservations: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.betterAuthUserId;
    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    try {
      const reservations = await prisma.reservation.findMany({
        where: {
          listing: {
            userId: userId, // <-- only fetch reservations on your listings
          },
        },
        include: {
          listing: {
            include: {
              favouritedBy: {
                where: {
                  userId: userId,
                },
                select: {
                  id: true,
                },
              },
            },
          },
          user: true, // guest who made the reservation
        },
        orderBy: {
          startDate: "desc",
        },
      });

      // Add isFavorited logic
      const reservationsWithFavoriteStatus = reservations.map(
        (reservation) => ({
          ...reservation,
          listing: {
            ...reservation.listing,
            isFavorited: reservation.listing.favouritedBy.length > 0,
            favouritedBy: undefined,
          },
        })
      );

      return { reservations: reservationsWithFavoriteStatus };
    } catch (error) {
      console.error("Error reservations [getUserReservations]:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get reservations",
        cause: error,
      });
    }
  }),

  delete: protectedProcedure
    .input(
      z.object({
        reservationId: z.string().uuid("Invalid reservation ID format"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.betterAuthUserId;

      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      try {
        const { reservationId } = input;

        const reservation = await prisma.reservation.findUnique({
          where: { id: reservationId },
          select: {
            id: true,
            userId: true,
            listing: {
              select: {
                userId: true,
              },
            },
          },
        });

        if (!reservation) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Reservation not found",
          });
        }

        const isGuest = reservation.userId === userId;
        const isHost = reservation.listing.userId === userId;

        if (!isGuest && !isHost) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have permission to delete this reservation",
          });
        }

        await prisma.reservation.delete({
          where: { id: reservationId },
        });

        return {
          success: true,
          message: "Reservation deleted successfully",
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        console.error("Error reservations [delete]:", error);

        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Reservation not found or already deleted",
            cause: error,
          });
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete reservation",
          cause: error,
        });
      }
    }),
});
