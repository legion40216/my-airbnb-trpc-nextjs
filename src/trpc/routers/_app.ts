// trpc/routers/_app.ts
import { favouriteRouter } from '@/modules/favourites/server/procedures';
import { createTRPCRouter } from '../init';
import { listingsRouter } from '@/modules/listings/server/procedures'; // Add this import
import { usersRouter } from '@/modules/users/server/procedures';
import { reservationsRouter } from '@/modules/reservations/server/procedures';
import { propertiesRouter } from '@/modules/properties/server/procedures';
import { tripsRouter } from '@/modules/trips/server/procedures';

export const appRouter = createTRPCRouter({
  listings: listingsRouter,
  favourites: favouriteRouter,
  users: usersRouter,
  reservations: reservationsRouter,
  properties: propertiesRouter,
  trips: tripsRouter,
});

export type AppRouter = typeof appRouter;
