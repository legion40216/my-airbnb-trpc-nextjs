import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UseFavoriteProps {
  listingId: string;
  isFavorited: boolean;
}

const useFavorite = ({ listingId, isFavorited }: UseFavoriteProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  // 1. Get the Query Key safely using tRPC v11 helper
  // This matches ALL calls to "listings.getSearch" regardless of input
  const queryKey = trpc.listings.getSearch.queryKey();

  const mutation = useMutation({
    ...trpc.favourites.toggle.mutationOptions(),
    
    onMutate: async () => {
      const toastId = toast.loading(isFavorited ? "Adding..." : "Removing...");

      // 2. Cancel queries using the safe key
      await queryClient.cancelQueries({ queryKey });

      // 3. Snapshot previous data
      const previousSearchData = queryClient.getQueriesData({ queryKey });

      // 4. Optimistic Update
      queryClient.setQueriesData({ queryKey }, (old: any) => {
        if (!old?.listings) return old;
        
        return {
          ...old,
          listings: old.listings.map((listing: any) =>
            listing.id === listingId
              ? { ...listing, isFavoritedByCurrentUser: !isFavorited }
              : listing
          ),
        };
      });

      return { previousSearchData, toastId };
    },

    onError: (error, variables, context) => {
      // 5. Rollback using the context data
      if (context?.previousSearchData) {
        context.previousSearchData.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      toast.error("Failed to update favorite", { id: context?.toastId });
    },

    onSuccess: (data, variables, context) => {
      toast.success(
        data.status === "added" ? "Added to favorites" : "Removed from favorites", 
        { id: context?.toastId }
      );
    },

    onSettled: () => {
      // 6. Refetch safely
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ 
        queryKey: trpc.favourites.getUserFavourites.queryKey() 
      });
    },
  });

  return {
    toggleFavorite: () => mutation.mutate({ listingId }),
    toggleIsLoading: mutation.isPending,
  };
};

export default useFavorite;