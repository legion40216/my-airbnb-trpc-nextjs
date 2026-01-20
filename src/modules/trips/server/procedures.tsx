import { Prisma } from "@/generated/prisma";
import prisma from "@/lib/prismadb";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const tripsRouter = createTRPCRouter({
  getUserTrips: protectedProcedure.query(async ({ ctx }) => {
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
          userId,
        },
        include: {
          listing: {
            include: {
              images: true,
              favouritedBy: {
                where: {
                  userId,
                },
                select: {
                  id: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const reservationsWithFavoriteFlag = reservations.map((res) => ({
        ...res,
        listing: {
          ...res.listing,
          isFavorited: res.listing.favouritedBy.length > 0,
          favouritedBy: undefined,
        },
      }));

      return { listings: reservationsWithFavoriteFlag };
    } catch (error) {
      console.error("Error trip [getUserTrips]:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch trips",
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

      const { reservationId } = input;

      try {
        const reservation = await prisma.reservation.findUnique({
          where: { id: reservationId },
          select: {
            id: true,
            userId: true,
          },
        });

        if (!reservation) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Reservation not found",
          });
        }

        if (reservation.userId !== userId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You do not have permission to delete this reservation",
          });
        }

        await prisma.reservation.delete({
          where: { id: reservationId },
        });

        return { success: true, message: "Reservation deleted successfully" };
      } catch (error) {
        console.error("Error trip [deleteTrip]:", error);

        if (error instanceof TRPCError) throw error;

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Reservation not found or already deleted",
              cause: error,
            });
          }
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete reservation",
          cause: error,
        });
      }
    }),
});
