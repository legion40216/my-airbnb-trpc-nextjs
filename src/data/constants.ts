// components/categories.ts
import { Category } from "@/types/type";

import {
  Sun,
  Mountain,
  Droplets,
  Home,
  Sailboat,
  Snowflake,
  TentTree,
  Landmark,
  DoorClosed,
  TreePalm,
  Wind,
  Gem
} from 'lucide-react';

// Define category labels as a const array first
export const CATEGORY_LABELS = [
  'Beach',
  'Windmills',
  'Modern',
  'Countryside',
  'Pools',
  'Lake',
  'Skiing',
  'Castles',
  'Caves',
  'Camping',
  'Arctic',
  'Desert',
  'Barns',
  'Lux',
] as const;

export const categories: Category[] = [
  {
    label: 'Beach',
    icon: Sun,
    description: 'This property is close to the beach!',
  },
  {
    label: 'Windmills',
    icon: Wind,
    description: 'This property has windmills!',
  },
  {
    label: 'Modern',
    icon: Home,
    description: 'This property is modern!',
  },
  {
    label: 'Countryside',
    icon: Mountain,
    description: 'This property is in the countryside!',
  },
  {
    label: 'Pools',
    icon: Droplets,
    description: 'This property has a beautiful pool!',
  },
  {
    label: 'Lake',
    icon: Sailboat,
    description: 'This property is near a lake!',
  },
  {
    label: 'Skiing',
    icon: Snowflake,
    description: 'This property has skiing activities!',
  },
  {
    label: 'Castles',
    icon: Landmark,
    description: 'This property is an ancient castle!',
  },
  {
    label: 'Caves',
    icon: DoorClosed,
    description: 'This property is in a spooky cave!',
  },
  {
    label: 'Camping',
    icon: TentTree,
    description: 'This property offers camping activities!',
  },
  {
    label: 'Arctic',
    icon: Snowflake,
    description: 'This property is in an arctic environment!',
  },
  {
    label: 'Desert',
    icon: TreePalm,
    description: 'This property is in the desert!',
  },
  {
    label: 'Barns',
    icon: Home,
    description: 'This property is in a barn!',
  },
  {
    label: 'Lux',
    icon: Gem,
    description: 'This property is brand new and luxurious!',
  },
];