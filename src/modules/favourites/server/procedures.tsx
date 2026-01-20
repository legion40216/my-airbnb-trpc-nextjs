import { z } from "zod";
import prisma from "@/lib/prismadb";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@/generated/prisma";

export const favouriteRouter = createTRPCRouter({
  toggle: protectedProcedure
    .input(z.object({ 
      listingId: z.string().uuid("Invalid listing ID format") 
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.betterAuthUserId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      try {
        const userId = ctx.betterAuthUserId;
        const { listingId } = input;

        // Verify listing exists first
        const listing = await prisma.listing.findUnique({
          where: { id: listingId },
          select: { id: true },
        });

        if (!listing) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Listing not found",
          });
        }

        // Check if the favourite already exists
        const existingFavourite = await prisma.favourite.findUnique({
          where: {
            userId_listingId: { userId, listingId },
          },
        });

        if (existingFavourite) {
          // Remove favourite
          await prisma.favourite.delete({
            where: { id: existingFavourite.id },
          });
          
          return { 
            success: true,
            status: "removed", 
            listingId,
            message: "Removed from favourites"
          };
        } else {
          // Add favourite
          await prisma.favourite.create({
            data: { userId, listingId },
          });

          return { 
            success: true,
            status: "added", 
            listingId,
            message: "Added to favourites"
          };
        }
      } catch (error) {
        // Re-throw tRPC errors as-is
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error("Error favourite [toggle]:", error);

        // Handle specific Prisma errors
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2025") {
            throw new TRPCError({
              code: "CONFLICT",
              message: "Favourite already exists",
              cause: error,
            });
          }
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to toggle favourite",
          cause: error,
        });
      }
    }),
  
  getUserFavourites: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.betterAuthUserId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    try {
      const favourites = await prisma.favourite.findMany({
        where: {
          userId: ctx.betterAuthUserId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              description: true,
              price: true,
              imgSrc: true,
              category: true,
              locationValue: true,
              createdAt: true,
              images: {
                select: {
                  id: true,
                  url: true,
                },
                take: 1,
              },
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
              favouritedBy: {
                where: {
                  userId: ctx.betterAuthUserId,
                },
              },
            },
          },
        },
      });

      // Map favourites to include isFavorited status
      const favouritesWithStatus = favourites.map(fav => ({
        ...fav,
        isFavorited: fav.listing.favouritedBy.length > 0,
        // Optionally remove favouritedBy from the nested listing to avoid circular references
        listing: {
          ...fav.listing,
          favouritedBy: undefined,
        },
      }));

      return { favourites: favouritesWithStatus };
    } catch (error) {
      console.error("Error favourite [getUserFavourites]:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch favourites",
        cause: error,
      });
    }
  }),

  getIsUserFavoritedbyId: protectedProcedure
    .input(z.object({ 
      listingId: z.string().uuid("Invalid listing ID format") 
    }))
    .query(async ({ ctx, input }) => {
      if (!ctx.betterAuthUserId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      try {
        const userId = ctx.betterAuthUserId;
        const { listingId } = input;

        const favourite = await prisma.favourite.findUnique({
          where: {
            userId_listingId: {
              userId,
              listingId,
            },
          },
          select: { id: true },
        });
        
        console.log("Favourite found:", favourite);

        return { 
          isFavorited: !!favourite,
          listingId 
        };
      } catch (error) {
        console.error("Error favourite [getIsFavorited]:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to check favourite status",
          cause: error,
        });
      }
    }),

  // Get favourite count for a listing (useful for displaying)
  getFavouriteCount: protectedProcedure
    .input(z.object({ 
      listingId: z.string().uuid("Invalid listing ID format") 
    }))
    .query(async ({ ctx, input }) => {
      if (!ctx.betterAuthUserId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      try {
        const { listingId } = input;

        const count = await prisma.favourite.count({
          where: { listingId },
        });

        return { 
          count,
          listingId 
        };
      } catch (error) {
        console.error("Error favourite [getFavouriteCount]:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get favourite count",
          cause: error,
        });
      }
    }),
});