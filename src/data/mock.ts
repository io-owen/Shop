import type { Draft, IncomingOffer, Listing, Order, Seller } from './types';

// Everything here is fake. Nothing talks to a server.

export const me: Seller = {
  id: 'me', name: 'Jordan Lee', neighborhood: 'Mission', rating: 4.9, trades: 23,
  verified: true, since: '2026', replies: '~15 min',
};

export const sellers: Seller[] = [
  me,
  { id: 's1', name: 'Maya Chen', neighborhood: 'Noe Valley', rating: 4.9, trades: 41, verified: true, since: '2025', replies: '~10 min' },
  { id: 's2', name: 'Sam Ortiz', neighborhood: 'Bernal Heights', rating: 4.7, trades: 12, verified: true, since: '2026', replies: '~1 hr' },
  { id: 's3', name: 'Priya Nair', neighborhood: 'Inner Sunset', rating: 5.0, trades: 67, verified: true, since: '2025', replies: '~5 min' },
  { id: 's4', name: 'Leo Brandt', neighborhood: 'Richmond', rating: 4.5, trades: 4, verified: false, since: '2026', replies: '~3 hr' },
  { id: 's5', name: 'Grace Kim', neighborhood: 'SoMa', rating: 4.8, trades: 29, verified: true, since: '2025', replies: '~20 min' },
  { id: 's6', name: 'Theo Walsh', neighborhood: 'Potrero Hill', rating: 4.6, trades: 9, verified: true, since: '2026', replies: '~2 hr' },
  { id: 's7', name: 'Ana Souza', neighborhood: 'Portland, OR', rating: 4.9, trades: 112, verified: true, since: '2025', replies: '~30 min' },
];

export const listings: Listing[] = [
  { id: 'l1', title: 'Mid-century walnut sofa', price: 420, category: 'Furniture', condition: 'Good', distance: 1.2, hoursAgo: 3, sellerId: 's1', icon: 'sofa-outline', backdrop: 'sand', bulky: true, dimensions: '84″ W × 34″ D × 31″ H', watchers: 14,
    description: 'Three-seater with a solid walnut frame. Cushions were re-covered last year in oatmeal linen. Moving at the end of the month, so it needs a new home. Fits through a standard door.' },
  { id: 'l2', title: 'Electric standing desk', price: 180, category: 'Furniture', condition: 'Like new', distance: 0.6, hoursAgo: 1, sellerId: 's5', icon: 'desk', backdrop: 'sage', bulky: true, dimensions: '55″ × 28″', watchers: 21,
    description: 'Dual motor, three memory presets, 55″ bamboo top. Barely used since I went back to the office.' },
  { id: 'l3', title: 'Oak dining table, four chairs', price: 260, category: 'Furniture', condition: 'Good', distance: 2.8, hoursAgo: 9, sellerId: 's2', icon: 'table-furniture', backdrop: 'clay', bulky: true, dimensions: '60″ × 36″', watchers: 8,
    description: 'Solid oak with a few light marks on the top. Chairs are sturdy. Seats four comfortably, six at a push.' },
  { id: 'l4', title: 'Front-load washer', price: 300, category: 'Home', condition: 'Like new', distance: 4.1, hoursAgo: 20, sellerId: 's3', icon: 'washing-machine', backdrop: 'mist', bulky: true, watchers: 6,
    description: 'Two years old and works perfectly. Our new place has one built in. Heavy, so delivery is a good idea.' },
  { id: 'l5', title: 'Linen armchair', price: 140, category: 'Furniture', condition: 'Good', distance: 1.9, hoursAgo: 5, sellerId: 's6', icon: 'sofa-single-outline', backdrop: 'stone', bulky: true, dimensions: '30″ W × 32″ D × 34″ H', watchers: 9,
    description: 'Soft natural linen with oak legs. Light wear on one arm, otherwise very clean.' },
  { id: 'l6', title: 'Cordless stick vacuum', price: 220, category: 'Home', condition: 'Good', distance: 2.1, hoursAgo: 6, sellerId: 's3', icon: 'vacuum-outline', backdrop: 'blush', ships: true, watchers: 11,
    description: 'All attachments and a new filter. The battery lasts about 40 minutes.' },
  { id: 'l7', title: 'Handheld game console', price: 230, category: 'Tech', condition: 'Like new', distance: 1.9, hoursAgo: 2, sellerId: 's5', icon: 'gamepad-variant-outline', backdrop: 'mist', ships: true, watchers: 27,
    description: 'With dock, two controllers and a case. Factory reset and ready to go.' },
  { id: 'l8', title: '55″ 4K television', price: 250, category: 'Tech', condition: 'Good', distance: 6.4, hoursAgo: 12, sellerId: 's2', icon: 'television', backdrop: 'stone', bulky: true, watchers: 9,
    description: 'Smart TV with remote. Wall mount included. Pickup only.' },
  { id: 'l9', title: 'Full-size stroller', price: 340, category: 'Kids', condition: 'Good', distance: 3.6, hoursAgo: 26, sellerId: 's1', icon: 'baby-carriage', backdrop: 'butter', watchers: 7,
    description: 'Bassinet and toddler seat. Clean, no stains, smoke-free home.' },
  { id: 'l10', title: 'Hybrid bike, medium frame', price: 290, category: 'Outdoor', condition: 'Good', distance: 2.4, hoursAgo: 7, sellerId: 's3', icon: 'bike', backdrop: 'sage', watchers: 12,
    description: 'Tuned up last month, new tires. Lock included.' },
  { id: 'l11', title: 'Two-person tent', price: 90, category: 'Outdoor', condition: 'Like new', distance: 8.9, hoursAgo: 40, sellerId: 's6', icon: 'tent', backdrop: 'sand', ships: true, watchers: 3,
    description: 'Used twice. Footprint included.' },
  { id: 'l12', title: 'Drill and driver set', price: 140, category: 'Tools', condition: 'Good', distance: 4.8, hoursAgo: 18, sellerId: 's4', icon: 'toolbox-outline', backdrop: 'clay', ships: true, watchers: 4,
    description: 'Two batteries, charger and hard case.' },
  { id: 'l13', title: 'Down jacket, large', price: 85, category: 'Clothing', condition: 'Like new', distance: 1.5, hoursAgo: 4, sellerId: 's5', icon: 'tshirt-crew-outline', backdrop: 'mist', ships: true, watchers: 6,
    description: 'Navy, no tears. Too warm for San Francisco.' },
  { id: 'l14', title: 'Pine bookshelf', price: 60, category: 'Furniture', condition: 'Good', distance: 3.3, hoursAgo: 30, sellerId: 's4', icon: 'bookshelf', backdrop: 'butter', bulky: true, watchers: 3,
    description: 'Five shelves, already taken apart for easy transport. All hardware in a bag.' },
  { id: 'l15', title: 'Wooden play kitchen', price: 45, category: 'Kids', condition: 'Fair', distance: 7.2, hoursAgo: 70, sellerId: 's6', icon: 'teddy-bear', backdrop: 'blush', watchers: 2,
    description: 'Well loved, with some marker on the side. Comes with pots and pans.' },
  // Outside the local area: shipping only
  { id: 'l16', title: 'Leather lounge chair', price: 1200, category: 'Furniture', condition: 'Good', distance: 630, hoursAgo: 22, sellerId: 's7', icon: 'seat-outline', backdrop: 'clay', ships: true, shipsFrom: 'Portland', watchers: 33,
    description: 'Real leather with rosewood veneer. Ships by freight, fully crated.' },
  { id: 'l17', title: 'Noise-cancelling headphones', price: 210, category: 'Tech', condition: 'Like new', distance: 630, hoursAgo: 6, sellerId: 's7', icon: 'headphones', backdrop: 'stone', ships: true, shipsFrom: 'Portland', watchers: 18,
    description: 'All accessories and the original case.' },
  { id: 'l18', title: 'Enameled dutch oven', price: 160, category: 'Home', condition: 'Good', distance: 630, hoursAgo: 15, sellerId: 's7', icon: 'pot-steam-outline', backdrop: 'butter', ships: true, shipsFrom: 'Portland', watchers: 10,
    description: '5.5 quart. Light wear inside. A kitchen workhorse.' },
];

export const myListings: Listing[] = [
  { id: 'm1', title: 'Full-length mirror', price: 40, category: 'Home', condition: 'Good', distance: 0, hoursAgo: 50, sellerId: 'me', icon: 'mirror', backdrop: 'stone', bulky: true, watchers: 4,
    description: 'Black frame, leans against the wall.' },
  { id: 'm2', title: 'Stand mixer', price: 180, category: 'Home', condition: 'Like new', distance: 0, hoursAgo: 20, sellerId: 'me', icon: 'blender-outline', backdrop: 'blush', ships: true, watchers: 9,
    description: 'Red, with three attachments.' },
];

export const orders: Order[] = [
  { id: 'o1', listingId: 'l6', price: 210, slot: 'Tomorrow, 6–7 pm', spot: 'Mission Police Station', fulfilment: 'pickup', status: 'reserved', code: 'K7Q2-PX' },
  { id: 'o2', listingId: 'l11', price: 90, slot: 'Sat Nov 14, 10–11 am', spot: 'Dolores Park, 18th St entrance', fulfilment: 'pickup', status: 'completed', code: 'B3MZ-TA' },
];

export const incomingOffers: IncomingOffer[] = [
  { id: 'f1', listingId: 'm2', buyer: 'Chris P.', buyerTrades: 8, amount: 160, state: 'pending' },
  { id: 'f2', listingId: 'm1', buyer: 'Dana R.', buyerTrades: 2, amount: 35, state: 'pending' },
];

export const pickupSlots = ['Today, 6–7 pm', 'Today, 7–8 pm', 'Tomorrow, 9–10 am', 'Tomorrow, 12–1 pm', 'Tomorrow, 6–7 pm', 'Saturday, 10–11 am'];

export const safeSpots = [
  { name: 'Mission Police Station', detail: 'Lobby, open 24 hours' },
  { name: 'Dolores Park', detail: '18th St entrance, well lit' },
  { name: 'Seller’s place', detail: 'Address shared after you reserve' },
];

/** What the pretend "listing from photos" assistant returns. */
export const drafts: Draft[] = [
  { title: 'Linen armchair with oak legs', category: 'Furniture', condition: 'Good', price: 120, priceLow: 95, priceHigh: 150,
    description: 'Comfortable armchair in natural linen with solid oak legs. Light wear on the arms, no stains or tears. Smoke-free, pet-free home.',
    icon: 'sofa-single-outline', backdrop: 'stone', dimensions: '30″ W × 32″ D × 34″ H', bulky: true, ships: false },
  { title: 'Espresso machine with grinder', category: 'Home', condition: 'Like new', price: 380, priceLow: 340, priceHigh: 450,
    description: 'Built-in grinder, descaled last month. Comes with portafilter, tamper and milk jug.',
    icon: 'coffee-maker-outline', backdrop: 'clay', bulky: false, ships: true },
  { title: 'Six-drawer pine dresser', category: 'Furniture', condition: 'Good', price: 175, priceLow: 140, priceHigh: 220,
    description: 'Solid pine and all drawers slide smoothly. A few small scuffs on top.',
    icon: 'dresser-outline', backdrop: 'sand', dimensions: '58″ W × 18″ D × 30″ H', bulky: true, ships: false },
];
