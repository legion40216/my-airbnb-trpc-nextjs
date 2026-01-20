// modules/listings/server/procedures.ts
import prisma from "@/lib/prismadb";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { ListingSchema, searchParamsSchema } from "@/schemas";
import {
  createTRPCRouter,
  protectedProcedure,
  baseProcedure,
} from "@/trpc/init";

// This router handles all listing-related procedures
export const listingsRouter = createTRPCRouter({
    // This procedure fetches all listings
  getAll: baseProcedure.query(async () => {
    try {
      const listings = await prisma.listing.findMany({
        include: {
          user: true,
          images: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
          
      return { listings }
    } catch (error) {
      console.error("Error listings [getAll]:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch listings",
        cause: error,
      });
    }
  }),

  create: protectedProcedure
    .input(ListingSchema)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.betterAuthUserId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      try {
        const listing = await prisma.listing.create({
          data: {
            title: input.title,
            description: input.description,
            category: input.category,
            roomCount: input.roomCount,
            bathroomCount: input.bathroomCount,
            guestCount: input.guestCount,
            locationValue: input.locationValue,
            price: input.price,
            userId: ctx.betterAuthUserId,
            images: {
              create:
                input.images?.map((img) => ({
                  url: img.url,
                })) ?? [],
            },
            imgSrc: input.imgSrc || "",
          },
        });

        return {
          success: true,
          message: "Listing created successfully",
        };
      } catch (error) {
        console.error("Error listings [create]:", error);

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create listing",
          cause: error,
        });
      }
    }),

  // This procedure fetches a single listing by its ID
  getByListingId: baseProcedure
    .input(
      z.object({
        listingId: z.string(),
      })
    )
    .query(async ({ input }) => {
      try {
        const { listingId } = input;
      
        const listing = await prisma.listing.findUnique({
          where: {
            id: listingId,
          },
          include: {
            user: true,
            images: true,
            reservations: true,
          },
        });

      // Not an TRPC ERROR
      if (!listing) {
        return { listing: null };
      }

        return { listing }
      } catch (error) {
        // Re-throw tRPC errors as-is
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error("Error listings [getByListingId]:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch listing",
          cause: error,
        });
      }
    }),

  // This procedure fetches a listing based on search parameters
  getSearch: baseProcedure
    .input(searchParamsSchema)
    .query(async ({ input, ctx }) => {
      try {
        const {
          locationValue,
          guestCount,
          roomCount,
          bathroomCount,
          category,
          startDate,
          endDate,
        } = input;

        const query: any = {};

        // Category is either a valid enum value or undefined
        if (category) {
          query.category = category;
        }

        // These are always numbers >= 1 due to schema, so always apply them
        query.guestCount = { gte: guestCount };
        query.roomCount = { gte: roomCount };
        query.bathroomCount = { gte: bathroomCount };

        // Handle location filtering - locationValue can be empty string due to default
        if (locationValue && locationValue !== "") {
          query.locationValue = locationValue;
        }

        // Handle date filtering for availability
        if (startDate && endDate) {
          query.NOT = {
            reservations: {
              some: {
                OR: [
                  {
                    endDate: { gte: startDate },
                    startDate: { lte: startDate },
                  },
                  {
                    startDate: { lte: endDate },
                    endDate: { gte: endDate },
                  },
                ],
              },
            },
          };
        } else if (startDate) {
          query.NOT = {
            reservations: {
              some: {
                endDate: { gte: startDate },
                startDate: { lte: startDate },
              },
            },
          };
        }

        const listings = await prisma.listing.findMany({
          where: query,
          orderBy: {
            createdAt: "desc",
          },
          // Include favorites if user is logged in
          ...(ctx.betterAuthUserId && {
            include: {
              favouritedBy: {
                where: {
                  userId: ctx.betterAuthUserId,
                },
                select: {
                  userId: true,
                },
              },
            },
          }),
        });

        // Transform listings to include isFavorited flag
        const listingsWithFavorites = listings.map(listing => ({
          ...listing,
          isFavoritedByCurrentUser: ctx.betterAuthUserId 
            ? (listing as any).favouritedBy?.length > 0 
            : false,
        }));

        return { listings: listingsWithFavorites };

      } catch (error) {
        console.error("Error listings [search]:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch search results",
          cause: error,
        });
      }
    }),
});