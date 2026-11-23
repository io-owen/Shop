import type { ComponentProps } from 'react';
import type { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Backdrop } from '@/theme';

export type IconName = ComponentProps<typeof MaterialCommunityIcons>['name'];

export const CATEGORIES = ['Furniture', 'Home', 'Tech', 'Kids', 'Tools', 'Outdoor', 'Clothing'] as const;
export type Category = (typeof CATEGORIES)[number];

export const CONDITIONS = ['New', 'Like new', 'Good', 'Fair'] as const;
export type Condition = (typeof CONDITIONS)[number];

export interface Seller {
  id: string;
  name: string;
  neighborhood: string;
  rating: number;
  trades: number;
  verified: boolean;
  since: string;
  replies: string;
}

export interface Listing {
  id: string;
  title: string;
  price: number;
  category: Category;
  condition: Condition;
  description: string;
  distance: number;
  hoursAgo: number;
  sellerId: string;
  icon: IconName;
  backdrop: Backdrop;
  bulky?: boolean;
  ships?: boolean;
  /** Set when the item is outside the local area and only available by shipping. */
  shipsFrom?: string;
  dimensions?: string;
  watchers: number;
}

export type OrderStatus = 'offer' | 'reserved' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  listingId: string;
  price: number;
  slot: string;
  spot?: string;
  fulfilment: 'pickup' | 'delivery' | 'shipping';
  status: OrderStatus;
  code: string;
}

export interface IncomingOffer {
  id: string;
  listingId: string;
  buyer: string;
  buyerTrades: number;
  amount: number;
  state: 'pending' | 'accepted' | 'declined';
}

export interface Draft {
  title: string;
  category: Category;
  condition: Condition;
  price: number;
  priceLow: number;
  priceHigh: number;
  description: string;
  icon: IconName;
  backdrop: Backdrop;
  dimensions?: string;
  bulky: boolean;
  ships: boolean;
}
