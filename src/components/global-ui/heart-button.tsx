'use client'
import { Heart } from 'lucide-react';
import useFavorite from '@/hooks/useFavorite';
import { useAuthModalStore } from '@/hooks/useAuthModalStore';
import { useCurrentUser } from '@/hooks/client-auth-utils';
import { Button } from '../ui/button';

type HeartButtonProps = {
  listingId: string;
  isFavoritedByCurrentUser?: boolean;
};

export default function HeartButton({ 
  listingId, 
  isFavoritedByCurrentUser = false 
}: HeartButtonProps) {
  const { user, isPending } = useCurrentUser();
  const modalAuthSwitcher = useAuthModalStore();

  const isLoggedIn = !!user;

  const { toggleFavorite, toggleIsLoading } = useFavorite({
    listingId,
    isFavorited: isFavoritedByCurrentUser,
  });
  
  const isLoadingFavourites = toggleIsLoading || isPending;
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      modalAuthSwitcher.openModal("login");
    } else {
      toggleFavorite();
    }
  };

  return (
    <Button
      variant={"ghost"}
      onClick={handleClick}
      size={"icon"}
      disabled={isLoadingFavourites}
    >
      {isLoadingFavourites ? (
        <div className="size-6 border-2 border-neutral-300 
        border-t-neutral-500 rounded-full animate-spin"
        />
      ) : (
        <Heart
          className="size-8"
          fill={
            isLoggedIn 
              ? (isFavoritedByCurrentUser ? "#f43f5e" : "rgb(115 115 115 / 0.7)") 
              : "rgb(115 115 115 / 0.7)"
          }
          stroke={
            isLoggedIn 
              ? (isFavoritedByCurrentUser ? "#f43f5e" : "white") 
              : "white"
          }
        />
      )}
    </Button>
  );
}