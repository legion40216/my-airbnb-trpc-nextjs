// data/dummy-data/data.ts

import { Listings } from "@/types/type";

export const listingsDummyData: Listings = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    title: "Luxury Beachfront Villa in Malibu",
    description: "Stunning oceanfront property with panoramic views, infinity pool, and direct beach access. Features modern architecture, floor-to-ceiling windows, and high-end amenities throughout. Perfect for a relaxing getaway with family or friends.",
    imgSrc: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
    category: "Beach",
    roomCount: 5,
    bathroomCount: 4,
    guestCount: 10,
    locationValue: "US",
    userId: "replace-with-actual-user-id-1",
    price: 1200,
    createdAt: new Date("2024-01-15"),
    reservations: [
      {
        id: "res-001",
        startDate: new Date("2026-01-20"),
        endDate: new Date("2026-01-25"),
      },
      {
        id: "res-002",
        startDate: new Date("2026-02-10"),
        endDate: new Date("2026-02-15"),
      },
    ],
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    title: "Cozy Mountain Cabin in Aspen",
    description: "Charming wooden cabin nestled in the mountains. Perfect for winter getaways with a stone fireplace, outdoor hot tub, and ski-in/ski-out access. Rustic charm meets modern comfort with updated kitchen and bathrooms.",
    imgSrc: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800",
    category: "Countryside",
    roomCount: 3,
    bathroomCount: 2,
    guestCount: 6,
    locationValue: "US",
    userId: "replace-with-actual-user-id-2",
    price: 450,
    createdAt: new Date("2024-02-10"),
    reservations: [
      {
        id: "res-003",
        startDate: new Date("2026-01-18"),
        endDate: new Date("2026-01-22"),
      },
    ],
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    title: "Modern Downtown Loft in NYC",
    description: "Stylish industrial loft in the heart of Manhattan. Exposed brick walls, high ceilings, and contemporary furnishings create an urban oasis. Walking distance to top restaurants, museums, theaters, and subway stations.",
    imgSrc: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    category: "Windmills",
    roomCount: 2,
    bathroomCount: 2,
    guestCount: 4,
    locationValue: "US",
    userId: "replace-with-actual-user-id-3",
    price: 350,
    createdAt: new Date("2024-03-05"),
    reservations: [],
  },
];