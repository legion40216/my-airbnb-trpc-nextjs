// schemas/index.ts
import { z } from "zod";
import { CATEGORY_LABELS } from "@/data/constants";

// Create Zod enum from the const array
export const searchParamsSchema = z.object({
  locationValue: z.string().optional().default(""),
  guestCount: z.coerce.number().int().positive().min(1).catch(1).default(1),
  roomCount: z.coerce.number().int().positive().min(1).catch(1).default(1), 
  bathroomCount: z.coerce.number().int().positive().min(1).catch(1).default(1),
  category: z.enum(CATEGORY_LABELS).optional().catch(undefined),
  startDate: z.coerce.date().optional().catch(undefined),
  endDate: z.coerce.date().optional().catch(undefined),
});
export type SearchParamsValues = z.infer<typeof searchParamsSchema>;

// You can also export just the category schema if you need it elsewhere
export const categorySchema = z.enum(CATEGORY_LABELS);

//Form schemas
export type LoginFormValues = z.infer<typeof loginSchema>;
export const loginSchema = z.object({
    email: z.string().email({
     message: "Email is required"
    }),
    password: z.string().min(1,{
     message: "Password is required"
    })
})

export type RegisterFormValues = z.infer<typeof registerSchema>;
export const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export type ListingFormValues = z.infer<typeof ListingSchema>;
export const ListingSchema = z.object({
  category: z.string().min(1, "Category is required"),
  locationValue: z.string().min(1, "Location is required"),
  guestCount: z.number().min(1, "Guest count must be at least 1"),
  roomCount: z.number().min(1, "Room count must be at least 1"),
  bathroomCount: z.number().min(1, "Bathroom count must be at least 1"),
  imgSrc: z.string().url("At least one image is required"),
  images: z
  .array(
    z.object({
      url: z.string().url("Invalid URL"),
    })
  )
  .optional(),
  price: z.number().min(1, "Price must be greater than 0"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export const reservationFormSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  totalPrice: z.number().min(0),
  listingId: z.string().min(1),
}).refine(
  (data) => {
    if (data.startDate && !data.endDate) return false;
    if (data.endDate && !data.startDate) return false;
    if (data.startDate && data.endDate) {
      return data.endDate > data.startDate;
    }
    return true;
  },
  {
    message: "Check-out must be after check-in",
    path: ["endDate"],
  }
);
export type ReservationFormValues = z.infer<typeof reservationFormSchema>;


//Server schemas
export const reservationServerSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  totalPrice: z.coerce.number().int().positive(),
  listingId: z.string().min(1, "Listing ID is required"),
}).refine(
  (data) => data.endDate > data.startDate,
  {
    message: "End date must be after start date",
    path: ["endDate"],
  }
);
export type ReservationServerValues = z.infer<typeof reservationServerSchema>;