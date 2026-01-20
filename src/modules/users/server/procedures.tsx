import prisma from "@/lib/prismadb";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const usersRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.betterAuthUserId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    try {
      const users = await prisma.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          // Don't expose sensitive fields like hashedPassword
        },
      });

      return { users };
    } catch (error) {
      console.error("Error users [getAll]:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch users",
        cause: error,
      });
    }
  }),

  getUserById: protectedProcedure
    .input(
      z.object({
        userId: z.string().uuid("Invalid user ID format").optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.betterAuthUserId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not authenticated",
        });
      }

      try {
        // Use provided userId or default to authenticated user
        const targetUserId = input?.userId || ctx.betterAuthUserId;

        const user = await prisma.user.findUnique({
          where: {
            id: targetUserId,
          },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            createdAt: true,
            updatedAt: true,
            // Add counts for additional info
            _count: {
              select: {
                listings: true,
                reservations: true,
                favourites: true,
              },
            },
          },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        return { user };
      } catch (error) {
        // Re-throw tRPC errors as-is
        if (error instanceof TRPCError) {
          throw error;
        }

        console.error("Error users [getUserById]:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch user",
          cause: error,
        });
      }
    }),

  // Get current authenticated user (common use case)
  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.betterAuthUserId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    try {
      const user = await prisma.user.findUnique({
        where: {
          id: ctx.betterAuthUserId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              listings: true,
              reservations: true,
              favourites: true,
            },
          },
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return { user };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      console.error("Error users [getCurrentUser]:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch current user",
        cause: error,
      });
    }
  }),
});