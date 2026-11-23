import type { Collection, Draft, IncomingOffer, Listing, Order, Seller } from './types';

// Everything here is fake. Nothing talks to a server.
// Photos are free-license images from Unsplash (unsplash.com/license), loaded by id.

export const me: Seller = {
  id: 'me', name: 'Jordan Lee', photo: '1611695434369-a8f5d76ceb7b', neighborhood: 'Mission',
  rating: 4.9, trades: 23, verified: true, since: '2026', replies: '~15 min',
};

export const sellers: Seller[] = [
  me,
  { id: 's1', name: 'Maya Chen', photo: '1489278353717-f64c6ee8a4d2', neighborhood: 'Noe Valley', rating: 4.9, trades: 41, verified: true, since: '2025', replies: '~10 min' },
  { id: 's2', name: 'Sam Ortiz', photo: '1522529599102-193c0d76b5b6', neighborhood: 'Bernal Heights', rating: 4.7, trades: 12, verified: true, since: '2026', replies: '~1 hr' },
  { id: 's3', name: 'Priya Nair', photo: '1494790108377-be9c29b29330', neighborhood: 'Inner Sunset', rating: 5.0, trades: 67, verified: true, since: '2025', replies: '~5 min' },
  { id: 's4', name: 'Leo Brandt', photo: '1568602471122-7832951cc4c5', neighborhood: 'Richmond', rating: 4.5, trades: 4, verified: false, since: '2026', replies: '~3 hr' },
  { id: 's5', name: 'Grace Kim', photo: '1548382131-e0ebb1f0cdea', neighborhood: 'SoMa', rating: 4.8, trades: 29, verified: true, since: '2025', replies: '~20 min' },
  { id: 's6', name: 'Theo Walsh', photo: '1757744705465-ea08b0ddc38a', neighborhood: 'Potrero Hill', rating: 4.6, trades: 9, verified: true, since: '2026', replies: '~2 hr' },
  { id: 's7', name: 'Ana Souza', photo: '1562337404-3044c84ac061', neighborhood: 'Portland, OR', rating: 4.9, trades: 112, verified: true, since: '2025', replies: '~30 min' },
];

export const listings: Listing[] = [
  { id: 'l2', title: 'Wooden standing desk', price: 180, category: 'Furniture', condition: 'Like new', photo: '1623177623442-979c1e42c255', backdrop: 'sand',
    distance: 0.6, street: 'Valencia St', minutesAgo: 4, lookingNow: 6, sellerId: 's5', bulky: true, dimensions: '55″ × 28″', watchers: 21,
    note: 'Back in the office four days a week now. It deserves someone who’ll actually stand at it.',
    description: 'Dual motor, three memory presets and a solid wood top. Goes from sitting to standing in about 15 seconds.' },
  { id: 'l1', title: 'Mid-century green sofa', price: 420, category: 'Furniture', condition: 'Good', photo: '1555041469-a586c61ea9bc', backdrop: 'sage',
    distance: 1.2, street: '24th St', minutesAgo: 180, lookingNow: 4, sellerId: 's1', collection: 'maya-moving', bulky: true, dimensions: '84″ W × 34″ D × 31″ H', watchers: 14,
    note: 'Bought it for our first apartment. We’re moving to Portland and it won’t fit in the van.',
    description: 'Three-seater in deep green velvet on tapered legs. No tears or stains. Fits through a standard door.' },
  { id: 'l20', title: 'Black arc floor lamp', price: 55, category: 'Home', condition: 'Good', photo: '1494438639946-1ebd1d20bf85', backdrop: 'stone',
    distance: 1.2, street: '24th St', minutesAgo: 22, sellerId: 's1', collection: 'maya-moving', watchers: 5,
    description: 'Adjustable head, warm bulb included. Lovely reading light.' },
  { id: 'l21', title: 'Red wool area rug, 5×8', price: 140, category: 'Home', condition: 'Good', photo: '1660394585016-508f949df960', backdrop: 'clay',
    distance: 1.2, street: '24th St', minutesAgo: 25, lookingNow: 3, sellerId: 's1', collection: 'maya-moving', watchers: 11,
    description: 'Hand-knotted wool. Professionally cleaned last spring. Rolled and ready to go.' },
  { id: 'l22', title: 'Reclaimed wood coffee table', price: 120, category: 'Furniture', condition: 'Good', photo: '1777513538143-8525eb3943f6', backdrop: 'sand',
    distance: 1.2, street: '24th St', minutesAgo: 28, sellerId: 's1', collection: 'maya-moving', bulky: true, dimensions: '48″ × 24″', watchers: 7,
    description: 'Solid and heavy, with lovely grain. A few rings from mugs, which we think add character.' },
  { id: 'l23', title: 'Walnut six-drawer dresser', price: 190, category: 'Furniture', condition: 'Good', photo: '1579283111509-855c7eea1c49', backdrop: 'sand',
    distance: 1.2, street: '24th St', minutesAgo: 31, sellerId: 's1', collection: 'maya-moving', bulky: true, dimensions: '58″ W × 18″ D × 30″ H', watchers: 9,
    description: 'All drawers slide smoothly. Small scuff on the top left corner.' },
  { id: 'l9', title: 'Full-size stroller', price: 340, category: 'Kids', condition: 'Good', photo: '1559135141-2bea6465fccf', backdrop: 'clay',
    distance: 1.2, street: '24th St', minutesAgo: 1560, sellerId: 's1', collection: 'maya-moving', watchers: 7,
    description: 'Bassinet and toddler seat. Clean, no stains, smoke-free home.' },
  { id: 'l5', title: 'Swivel lounge chair', price: 140, category: 'Furniture', condition: 'Good', photo: '1580480055273-228ff5388ef8', backdrop: 'stone',
    distance: 1.9, street: 'Guerrero St', minutesAgo: 300, sellerId: 's6', bulky: true, dimensions: '28″ W × 30″ D × 32″ H', watchers: 9,
    note: 'My favourite reading chair. New place has no room for it.',
    description: 'Oatmeal upholstery on a light oak swivel base. Very comfortable.' },
  { id: 'l14', title: 'Wooden bookshelf', price: 60, category: 'Furniture', condition: 'Good', photo: '1588580000645-4562a6d2c839', backdrop: 'sand',
    distance: 3.3, street: 'Clement St', minutesAgo: 1800, sellerId: 's4', bulky: true, watchers: 3,
    description: 'Tall and sturdy. Books not included, sadly.' },
  { id: 'l4', title: 'Front-load washer', price: 300, category: 'Home', condition: 'Like new', photo: '1626806787461-102c1bfaaea1', backdrop: 'mist',
    distance: 4.1, street: 'Irving St', minutesAgo: 1200, lookingNow: 2, sellerId: 's3', bulky: true, watchers: 6,
    description: 'Two years old and works perfectly. Our new place has one built in. Heavy, so delivery is a good idea.' },
  { id: 'l6', title: 'Cordless stick vacuum', price: 220, category: 'Home', condition: 'Good', photo: '1746645297698-306ef29852ca', backdrop: 'butter',
    distance: 2.1, street: 'Irving St', minutesAgo: 360, sellerId: 's3', ships: true, watchers: 11,
    description: 'All attachments and a new filter. The battery lasts about 40 minutes.' },
  { id: 'l7', title: 'Handheld game console', price: 230, category: 'Tech', condition: 'Like new', photo: '1618397360795-952a13220a66', backdrop: 'stone',
    distance: 1.9, street: 'Folsom St', minutesAgo: 120, lookingNow: 8, sellerId: 's5', ships: true, watchers: 27,
    description: 'With dock, two controllers and a case. Factory reset and ready to go.' },
  { id: 'l8', title: '55″ 4K television', price: 250, category: 'Tech', condition: 'Good', photo: '1646861039459-fd9e3aabf3fb', backdrop: 'stone',
    distance: 6.4, street: 'Cortland Ave', minutesAgo: 720, sellerId: 's2', bulky: true, watchers: 9,
    description: 'Smart TV with remote. Wall mount included. Pickup only.' },
  { id: 'l10', title: 'City bike, medium frame', price: 290, category: 'Outdoor', condition: 'Good', photo: '1485965120184-e220f721d03e', backdrop: 'stone',
    distance: 2.4, street: 'Irving St', minutesAgo: 420, lookingNow: 3, sellerId: 's3', watchers: 12,
    note: 'Rode it to work every day for two years. Just switched to an e-bike.',
    description: 'Steel frame, single speed, tuned up last month. Lock included.' },
  { id: 'l3', title: 'Oak dining table, four chairs', price: 260, category: 'Furniture', condition: 'Good', photo: '1758977403865-f79e156415b3', backdrop: 'sand',
    distance: 2.8, street: 'Cortland Ave', minutesAgo: 540, sellerId: 's2', bulky: true, dimensions: '60″ × 36″', watchers: 8,
    description: 'Solid oak with grey upholstered chairs. Seats four comfortably, six at a push.' },
  { id: 'l11', title: 'Two-person tent', price: 90, category: 'Outdoor', condition: 'Like new', photo: '1504280390367-361c6d9f38f4', backdrop: 'clay',
    distance: 8.9, street: '18th St', minutesAgo: 2400, sellerId: 's6', ships: true, watchers: 3,
    description: 'Used twice. Footprint included.' },
  { id: 'l12', title: 'Cordless drill and driver', price: 140, category: 'Tools', condition: 'Good', photo: '1572981779307-38b8cabb2407', backdrop: 'butter',
    distance: 4.8, street: 'Geary Blvd', minutesAgo: 1080, sellerId: 's4', ships: true, watchers: 4,
    description: 'Two batteries, charger and hard case.' },
  { id: 'l13', title: 'White puffer jacket, L', price: 85, category: 'Clothing', condition: 'Like new', photo: '1706765779494-2705542ebe74', backdrop: 'stone',
    distance: 1.5, street: 'Folsom St', minutesAgo: 240, sellerId: 's5', ships: true, watchers: 6,
    description: 'No tears or marks. Far too warm for San Francisco.' },
  { id: 'l15', title: 'Wooden play kitchen', price: 45, category: 'Kids', condition: 'Fair', photo: '1773543447025-8838024abc4c', backdrop: 'sand',
    distance: 7.2, street: '18th St', minutesAgo: 4200, sellerId: 's6', watchers: 2,
    description: 'Well loved, with some marker on the side. Comes with pots and pans.' },
  // Outside the local area: shipping only
  { id: 'l16', title: 'Leather lounge chair and ottoman', price: 1200, category: 'Furniture', condition: 'Good', photo: '1774927475366-7c4d31588d98', backdrop: 'clay',
    distance: 630, minutesAgo: 1320, sellerId: 's7', ships: true, shipsFrom: 'Portland', watchers: 33, lookingNow: 5,
    description: 'Real leather with a walnut shell. Ships by freight, fully crated.' },
  { id: 'l17', title: 'Wireless headphones', price: 210, category: 'Tech', condition: 'Like new', photo: '1505740420928-5e560c06d30e', backdrop: 'butter',
    distance: 630, minutesAgo: 360, sellerId: 's7', ships: true, shipsFrom: 'Portland', watchers: 18,
    description: 'Noise cancelling. All accessories and the original case.' },
  { id: 'l18', title: 'Enameled dutch oven', price: 160, category: 'Home', condition: 'Good', photo: '1695088224170-8d8670a19a16', backdrop: 'clay',
    distance: 630, minutesAgo: 900, sellerId: 's7', ships: true, shipsFrom: 'Portland', watchers: 10,
    description: '5.5 quart. Light wear inside. A kitchen workhorse.' },
];

export const myListings: Listing[] = [
  { id: 'm1', title: 'Full-length mirror', price: 40, category: 'Home', condition: 'Good', photo: '1683170760369-c555d0438bff', backdrop: 'stone',
    distance: 0, minutesAgo: 3000, sellerId: 'me', bulky: true, watchers: 4, description: 'Thin black frame, leans against the wall.' },
  { id: 'm2', title: 'Pink stand mixer', price: 180, category: 'Home', condition: 'Like new', photo: '1547091267-6b2be403a763', backdrop: 'clay',
    distance: 0, minutesAgo: 1200, sellerId: 'me', ships: true, watchers: 9, description: 'With three attachments. Used maybe five times.' },
];

export const collections: Collection[] = [
  { id: 'maya-moving', kind: 'moving', sellerId: 's1', title: 'Maya’s moving sale', subtitle: 'A whole Noe Valley apartment, priced to go',
    badge: 'Ends Saturday', listingIds: ['l1', 'l20', 'l21', 'l22', 'l23', 'l9'] },
  { id: 'studio-400', kind: 'edit', title: 'Furnish a studio for $400', subtitle: 'A desk, a chair and a bookshelf, all within 3 miles',
    badge: 'Our pick', listingIds: ['l2', 'l5', 'l14'], bundlePrice: 350 },
];

/** Rotating "what's happening" lines on Browse. */
export const tickerLines = [
  'Grace just listed a standing desk · 0.6 mi',
  'A city bike sold in 2 hours on Valencia St',
  '14 new things near you today',
  'Maya added 4 items to her moving sale',
  'Most things here sell within 3 days',
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
  { title: 'Mustard lounge chair, oak frame', category: 'Furniture', condition: 'Good', price: 120, priceLow: 95, priceHigh: 150,
    description: 'Comfortable mustard-yellow lounge chair on a solid oak frame. Light wear on the arms, no stains or tears. Smoke-free, pet-free home.',
    photo: '1586023492125-27b2c045efd7', backdrop: 'butter', dimensions: '27″ W × 30″ D × 31″ H', bulky: true, ships: false },
  { title: 'Espresso machine with steam wand', category: 'Home', condition: 'Like new', price: 380, priceLow: 340, priceHigh: 450,
    description: 'Stainless steel, descaled last month. Comes with portafilter, tamper and milk jug.',
    photo: '1620807773206-49c1f2957417', backdrop: 'stone', bulky: false, ships: true },
];
