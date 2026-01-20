import { currentUser } from '@/hooks/server-auth-utils';
import prisma from '@/lib/prismadb';
import { initTRPC, TRPCError } from '@trpc/server';
import { cache } from 'react';
import superjson from 'superjson';

export const createTRPCContext = cache(async () => {
  const session = await currentUser();
  return { betterAuthUserId: session?.id };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

const enforceUserIsAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.betterAuthUserId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  const user = await prisma.user.findUnique({
    where: { id: ctx.betterAuthUserId },
  });

  if (!user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      betterAuthUserId: ctx.betterAuthUserId,
      user,
    },
  });
});

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
export const protectedProcedure = baseProcedure.use(enforceUserIsAuthed);