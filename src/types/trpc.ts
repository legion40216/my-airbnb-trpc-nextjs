// In your types file (e.g., @/types/index.ts or @/types/trpc.ts)
import { AppRouter } from "@/trpc/routers/_app";
import type { inferRouterOutputs } from "@trpc/server";

export type RouterOutputs = inferRouterOutputs<AppRouter>;

// Get the listings array from the getSearch output
type ListingsArray = RouterOutputs["listings"]["getSearch"]["listings"];
export type Listing = ListingsArray[number];

// For your formatted listing type
export type FormattedListing = {
  id: string;
  locationRegion: string;
  locationLabel: string;
  imgSrc: string;
  category: string;
  price: string;
  isFavoritedByCurrentUser?: boolean; // Add this
};