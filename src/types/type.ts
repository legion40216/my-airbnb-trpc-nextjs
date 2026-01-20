//types
import { CATEGORY_LABELS } from "@/data/constants";
import { LucideIcon } from "lucide-react";

export type Category = {
  label: CategoryLabel;
  icon: LucideIcon;
  description: string;
};
export type CategoryLabel = typeof CATEGORY_LABELS[number];

export type Reservation = {
  id: string;
  startDate: Date;
  endDate: Date;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  imgSrc: string;
  category: string;
  roomCount: number;
  bathroomCount: number;
  guestCount: number;
  locationValue: string;
  userId: string;
  price: number;
  createdAt: Date;
  reservations: Reservation[]
}

export type Listings = Listing[];