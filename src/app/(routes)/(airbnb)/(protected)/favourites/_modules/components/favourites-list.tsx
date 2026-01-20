'use client';
import React from 'react'

import FavouriteCard from './favourites-list/favourite-card';

type FavouritesItem = {
  id: string;
  locationRegion: string;
  locationLabel: string;
  imgSrc: string;
  category: string;
  price: string;
  isFavoritedByCurrentUser?: boolean;
};

type FavouritesListProps = {
  data: FavouritesItem[];
};

export default function FavouritesList({ data }: FavouritesListProps) {
  
  return (
      <div>
        {data && data.length > 0 ? (
          <div
            className="grid grid-cols-2 gap-3 
              sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))]"
          >
            {data?.map((item) => (
              <FavouriteCard
                key={item.id}
                id={item.id}
                locationRegion= {item.locationRegion}
                locationLabel= {item.locationLabel}
                imgSrc={item.imgSrc}
                category={item.category}
                price={item.price}
                isFavoritedByCurrentUser={item.isFavoritedByCurrentUser}
              />
            ))}
          </div>
        ) : (
          <div>No results found</div>
        )}
      </div>
  )
}
