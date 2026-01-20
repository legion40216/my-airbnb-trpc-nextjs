// hooks/useFavorite.ts
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

  const mutation = useMutation({
    ...trpc.favourites.toggle.mutationOptions(),
    
    onMutate: async () => {
      const loadingMsg = isFavorited
        ? "Removing from favorites..."
        : "Adding to favorites...";
      
      const toastId = toast.loading(loadingMsg);

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: [['listings', 'getSearch']]
      });

      // Snapshot previous value
      const previousSearchData = queryClient.getQueriesData({
        queryKey: [['listings', 'getSearch']]
      });

      // Optimistically update all search result caches
      queryClient.setQueriesData(
        { queryKey: [['listings', 'getSearch']] },
        (old: any) => {
          if (!old?.listings) return old;
          
          return {
            ...old,
            listings: old.listings.map((listing: any) =>
              listing.id === listingId
                ? { ...listing, isFavoritedByCurrentUser: !isFavorited }
                : listing
            ),
          };
        }
      );

      return { previousSearchData, toastId };
    },

    onSuccess: (data, variables, context) => {
      const successMessage =
        data.status === "removed"
          ? "Removed from favorites"
          : "Added to favorites";

      toast.success(successMessage);
      
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
    },

    onError: (error, variables, context) => {
      // Rollback all search queries
      if (context?.previousSearchData) {
        context.previousSearchData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }

      toast.error(error.message || "Something went wrong.");
      
      if (context?.toastId) {
        toast.dismiss(context.toastId);
      }
    },

    onSettled: () => {
      // Refetch to ensure sync with server
      queryClient.invalidateQueries({ 
        queryKey: [['listings', 'getSearch']] 
      });
      queryClient.invalidateQueries({ 
        queryKey: [['favourites', 'getUserFavourites']] 
      });
    },
  });

  const toggleFavorite = () => {
    mutation.mutate({ listingId });
  };

  return {
    toggleFavorite,
    toggleIsLoading: mutation.isPending,
  };
};

export default useFavorite;