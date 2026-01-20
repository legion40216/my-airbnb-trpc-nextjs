// 3. Update HeartButton to use hybrid approach
'use client'
import { Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import useFavorite from '@/hooks/useFavorite';
import { useAuthModalStore } from '@/hooks/useAuthModalStore';
import { useCurrentUser } from '@/hooks/client-auth-utils';

import { Button } from '../ui/button';
import { useTRPC } from '@/trpc/react';
import { useQuery } from '@tanstack/react-query';

type HeartButtonProps = {
  listingId: string;
  isFavoritedByCurrentUser?: boolean;
};

export default function HeartButton({ 
  listingId, 
  isFavoritedByCurrentUser 
}: HeartButtonProps) {
  const { user } = useCurrentUser();
  const modalAuthSwitcher = useAuthModalStore();
  const isLoggedIn = !!user;

  // ✅ KEY: Use useState to track the favorite status
  // This allows server and client to start with the same value
  const [favoriteStatus, setFavoriteStatus] = useState(
    isFavoritedByCurrentUser ?? false
  );

  const trpc = useTRPC();

  const { data, isLoading } = useQuery(
    trpc.favourites.getIsUserFavoritedbyId.queryOptions(
      { listingId },
      {
        enabled: isLoggedIn,
        // Use prop as initial data
        initialData: isFavoritedByCurrentUser !== undefined
          ? { isFavorited: isFavoritedByCurrentUser, listingId }
          : undefined,
        staleTime: 60 * 1000,
      }
    )
);

  // ✅ Sync query data to local state (after hydration)
  useEffect(() => {
    if (data?.isFavorited !== undefined) {
      setFavoriteStatus(data.isFavorited);
    }
  }, [data?.isFavorited]);

  const { toggleFavorite, toggleIsLoading } = useFavorite({
    listingId,
    isFavorited: favoriteStatus,
  });

  const isLoadingFavourites = isLoading || toggleIsLoading;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      modalAuthSwitcher.openModal("login");
    } else {
      // ✅ Optimistically update local state
      setFavoriteStatus(!favoriteStatus);
      toggleFavorite();
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      size="icon"
      disabled={isLoadingFavourites}
    >
      {isLoadingFavourites ? (
        <div className="size-6 border-2 border-neutral-300 border-t-neutral-500 rounded-full animate-spin" />
      ) : (
        <Heart
          className="size-8"
          fill={
            isLoggedIn 
              ? (favoriteStatus ? "#f43f5e" : "rgb(115 115 115 / 0.7)") 
              : "rgb(115 115 115 / 0.7)"
          }
          stroke={
            isLoggedIn 
              ? (favoriteStatus ? "" : "white") 
              : "white"
          }
        />
      )}
    </Button>
  );
}