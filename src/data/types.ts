import type { Backdrop } from '@/theme';

export const CATEGORIES = ['Furniture', 'Home', 'Tech', 'Kids', 'Tools', 'Outdoor', 'Clothing'] as const;
export type Category = (typeof CATEGORIES)[number];

export const CONDITIONS = ['New', 'Like new', 'Good', 'Fair'] as const;
export type Condition = (typeof CONDITIONS)[number];

/** An Unsplash photo id, e.g. "1555041469-a586c61ea9bc". See `photoUrl`. */
export type PhotoId = string;

export interface Seller {
  id: string;
  name: string;
  photo: PhotoId;
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
  photo: PhotoId;
  /** Color shown while the photo loads. */
  backdrop: Backdrop;
  distance: number;
  street?: string;
  minutesAgo: number;
  sellerId: string;
  /** People looking at the listing right now. */
  lookingNow?: number;
  /** A short personal note from the seller. */
  note?: string;
  /** Id of a collection (e.g. a moving sale) this item belongs to. */
  collection?: string;
  bulky?: boolean;
  ships?: boolean;
  /** Set when the item is outside the local area and only available by shipping. */
  shipsFrom?: string;
  dimensions?: string;
  watchers: number;
}

export interface Collection {
  id: string;
  kind: 'moving' | 'edit';
  title: string;
  subtitle: string;
  sellerId?: string;
  badge: string;
  listingIds: string[];
  /** For edits: a bundle price for everything together. */
  bundlePrice?: number;
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
  photo: PhotoId;
  backdrop: Backdrop;
  dimensions?: string;
  bulky: boolean;
  ships: boolean;
}
