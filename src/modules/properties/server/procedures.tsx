
import prisma from "@/lib/prismadb";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Prisma } from "../../../../app/generated/prisma/client";

export const propertiesRouter = createTRPCRouter({
  getUserProperties: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.betterAuthUserId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    try {
      const listings = await prisma.listing.findMany({
        where: {
          userId: ctx.betterAuthUserId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          favouritedBy: {
            where: {
              userId: ctx.betterAuthUserId,
            },
            select: {
              id: true, // Or listingId, doesn't matter here
            },
          },
        },
      });

    const listingsWithFavoriteStatus = listings.map((listing) => ({
    ...listing,
    isFavorited: listing.favouritedBy.length > 0,
    favouritedBy: undefined,
    }));

    return { listings: listingsWithFavoriteStatus };

    } catch (error) {
      console.error("Error properties [getPropertiesByUserId]:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get properties",
        cause: error,
      });
    }
  }),

  delete: protectedProcedure
    .input(
      z.object({
        listingId: z.string().uuid("Invalid listing ID format"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.betterAuthUserId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      try {
        const { listingId } = input;

        // Check if the listing exists and user owns it in one query
        const listing = await prisma.listing.findUnique({
          where: { id: listingId },
          select: {
            id: true,
            userId: true,
            title: true,
            _count: {
              select: {
                reservations: true,
              },
            },
          },
        });

        if (!listing) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Property not found",
          });
        }

        // Ensure the user owns the property
        if (listing.userId !== ctx.betterAuthUserId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You are not authorized to delete this property",
          });
        }

        // Check if there are active reservations
        if (listing._count.reservations > 0) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Cannot delete property with active reservations",
          });
        }

        const deletedProperty = await prisma.listing.delete({
          where: { id: listingId },
        });

        return {
          success: true,
          message: "Property deleted successfully",
        };
      } catch (error) {
        // Re-throw tRPC errors as-is
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error("Error properties [delete]:", error);

        // Handle specific Prisma errors
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Property not found or already deleted",
              cause: error,
            });
          }
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete property",
          cause: error,
        });
      }
    }),
});