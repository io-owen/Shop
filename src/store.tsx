import { createContext, useContext, useState, type ReactNode } from 'react';

import * as mock from '@/data/mock';
import type { Draft, IncomingOffer, Listing, Order, OrderStatus, Seller } from '@/data/types';
import { colors } from '@/theme';

function makeId() {
  return Math.random().toString(36).slice(2, 8);
}

function makeCode() {
  const s = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${s.slice(0, 4)}-${s.slice(4)}`;
}

function useStoreState() {
  const [mine, setMine] = useState<Listing[]>(mock.myListings);
  const [orders, setOrders] = useState<Order[]>(mock.orders);
  const [offers, setOffers] = useState<IncomingOffer[]>(mock.incomingOffers);
  const [saved, setSaved] = useState<string[]>([]);

  const all = [...mock.listings, ...mine];

  return {
    me: mock.me,
    listings: mock.listings,
    mine,
    orders,
    offers,
    saved,
    activeOrders: orders.filter((o) => o.status === 'reserved' || o.status === 'offer'),

    getListing: (id: string) => all.find((l) => l.id === id),
    getCollection: (id: string) => mock.collections.find((c) => c.id === id),
    collections: mock.collections,
    getSeller: (id: string): Seller => mock.sellers.find((s) => s.id === id) ?? mock.me,
    getOrder: (id: string) => orders.find((o) => o.id === id),

    isSaved: (id: string) => saved.includes(id),
    toggleSave: (id: string) =>
      setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [id, ...s])),

    reserve: (listing: Listing, slot: string, spot: string | undefined, fulfilment: Order['fulfilment']) => {
      const order: Order = {
        id: makeId(), listingId: listing.id, price: listing.price, slot, spot, fulfilment,
        status: 'reserved', code: makeCode(),
      };
      setOrders((o) => [order, ...o]);
      return order;
    },

    sendOffer: (listing: Listing, amount: number) => {
      const order: Order = {
        id: makeId(), listingId: listing.id, price: amount, slot: 'Choose a time once accepted',
        fulfilment: listing.shipsFrom ? 'shipping' : 'pickup', status: 'offer', code: makeCode(),
      };
      setOrders((o) => [order, ...o]);
    },

    setOrderStatus: (id: string, status: OrderStatus) =>
      setOrders((list) => list.map((o) => (o.id === id ? { ...o, status } : o))),

    respondToOffer: (id: string, accept: boolean) =>
      setOffers((list) => list.map((f) => (f.id === id ? { ...f, state: accept ? 'accepted' : 'declined' } : f))),

    publish: (d: Draft) => {
      const listing: Listing = {
        id: makeId(), title: d.title, price: d.price, category: d.category, condition: d.condition,
        description: d.description, distance: 0, minutesAgo: 0, sellerId: 'me', photo: d.photo,
        backdrop: d.backdrop, bulky: d.bulky, ships: d.ships, dimensions: d.dimensions, watchers: 0,
      };
      setMine((m) => [listing, ...m]);
    },
  };
}

type Store = ReturnType<typeof useStoreState>;

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const store = useStoreState();
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used inside StoreProvider');
  return store;
}

export function distanceText(l: Listing) {
  if (l.shipsFrom) return `Ships from ${l.shipsFrom}`;
  if (l.sellerId === 'me') return 'Your listing';
  const miles = l.distance < 1 ? `${l.distance.toFixed(1)} mi` : `${Math.round(l.distance)} mi`;
  return l.street ? `${miles} · ${l.street}` : miles;
}

export function postedText(l: Listing) {
  const m = l.minutesAgo;
  if (m < 1) return 'Just now';
  if (m < 60) return `${m} min ago`;
  if (m < 1440) return `${Math.floor(m / 60)}h ago`;
  return `${Math.floor(m / 1440)}d ago`;
}

/** Short live signal for a card, or nothing if the listing is quiet. */
export function liveBadge(l: Listing): string | undefined {
  if (l.minutesAgo < 60) return `New · ${l.minutesAgo < 1 ? 'just now' : `${l.minutesAgo} min`}`;
  if ((l.lookingNow ?? 0) >= 3) return `${l.lookingNow} looking now`;
  return undefined;
}

export const statusText: Record<OrderStatus, { label: string; color: string }> = {
  offer: { label: 'Offer sent', color: colors.amber },
  reserved: { label: 'Reserved', color: colors.forest },
  completed: { label: 'Completed', color: colors.muted },
  cancelled: { label: 'Cancelled', color: colors.faint },
};

export function shortName(name: string) {
  const [first, last] = name.split(' ');
  return last ? `${first} ${last[0]}.` : first;
}
