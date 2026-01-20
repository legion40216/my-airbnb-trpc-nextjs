"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

type CounterInputProps = {
  guestCount: number;
  roomCount: number;
  bathroomCount: number;
  onGuestCountChange: (count: number) => void;
  onRoomCountChange: (count: number) => void;
  onBathroomCountChange: (count: number) => void;
};

export default function CounterInput({ 
  guestCount,
  roomCount,
  bathroomCount,
  onGuestCountChange,
  onRoomCountChange,
  onBathroomCountChange
}: CounterInputProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">How many guests?</h2>
        <p className="text-muted-foreground">Select the number of guests and rooms</p>
      </div>

      {/* Guests Counter */}
      <div className="flex items-center justify-between py-4 border-b">
        <div>
          <p className="font-medium">Guests</p>
          <p className="text-sm text-muted-foreground">
            How many guests can stay?
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => guestCount > 1 && onGuestCountChange(guestCount - 1)}
            disabled={guestCount <= 1}
            className="size-8"
          >
            <Minus size={16} />
          </Button>
          <span className="text-lg font-medium w-6 text-center">
            {guestCount}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onGuestCountChange(guestCount + 1)}
            className="size-8"
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>

      {/* Rooms Counter */}
      <div className="flex items-center justify-between py-4 border-b">
        <div>
          <p className="font-medium">Rooms</p>
          <p className="text-sm text-muted-foreground">
            How many rooms are available?
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => roomCount > 1 && onRoomCountChange(roomCount - 1)}
            disabled={roomCount <= 1}
            className="size-8"
          >
            <Minus size={16} />
          </Button>
          <span className="text-lg font-medium w-6 text-center">
            {roomCount}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onRoomCountChange(roomCount + 1)}
            className="size-8"
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>

      {/* Bathrooms Counter */}
      <div className="flex items-center justify-between py-4">
        <div>
          <p className="font-medium">Bathrooms</p>
          <p className="text-sm text-muted-foreground">
            How many bathrooms are available?
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => bathroomCount > 1 && onBathroomCountChange(bathroomCount - 1)}
            disabled={bathroomCount <= 1}
            className="size-8"
          >
            <Minus size={16} />
          </Button>
          <span className="text-lg font-medium w-6 text-center">
            {bathroomCount}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onBathroomCountChange(bathroomCount + 1)}
            className="size-8"
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}