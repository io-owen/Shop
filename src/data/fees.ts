import type { Listing, Order } from './types';

/**
 * Pricing model: selling is free. Buyers pay a protection fee on in-app payments:
 * $1 + 5% of the first $500, then 3% of anything above that.
 */
export function protectionFee(price: number) {
  return round(1 + Math.min(price, 500) * 0.05 + Math.max(price - 500, 0) * 0.03);
}

/** Refundable hold, applied to the price. The seller keeps it if the buyer doesn't show. */
export function holdDeposit(price: number) {
  if (price < 100) return 5;
  if (price < 500) return 10;
  return 20;
}

export function deliveryQuote(listing: Listing) {
  return Math.round((listing.bulky ? 39 : 15) + listing.distance * 2.5);
}

export function shippingQuote(listing: Listing) {
  return listing.price > 500 ? 89 : 12.4;
}

export function breakdown(listing: Listing, price: number, fulfilment: Order['fulfilment']) {
  const extra =
    fulfilment === 'delivery' ? deliveryQuote(listing) : fulfilment === 'shipping' ? shippingQuote(listing) : 0;
  const fee = protectionFee(price);
  const total = round(price + fee + extra);
  const deposit = fulfilment === 'shipping' ? total : holdDeposit(price);
  return { price, fee, extra, extraLabel: fulfilment === 'shipping' ? 'Shipping' : 'Delivery', total, deposit, dueLater: round(total - deposit) };
}

export function money(n: number) {
  const whole = Math.abs(n - Math.round(n)) < 0.005;
  return '$' + (whole ? Math.round(n).toLocaleString('en-US') : n.toFixed(2));
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}
