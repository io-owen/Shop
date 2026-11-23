# Shop

A prototype app for buying and selling locally, with shipping as an option. It's built with Expo (React Native), so the same code runs on iOS, Android and the web.

Everything runs on **fake data**: no backend, no real payments, no real users.

## Run it

```bash
npm install
npx expo start
```

Then press `i` for the iOS simulator, `a` for an Android emulator, `w` for the web, or scan the QR code with the Expo Go app on your phone.

## What's in it

| Screen | What it does |
|---|---|
| **Browse** | Search, category tabs, a radius you can change (tap "Mission · within 10 mi"), a featured new item, a grid of items **Near you**, and a separate **Ships to you** section for items from other cities. |
| **Listing** | Large product image, seller trust info (ID verified, rating, trades, reply time), a three-step "How it works", a delivery quote for bulky items, and **Make an offer** / **Reserve** buttons. |
| **Reserve** | Pickup or delivery, a time slot, a safe meeting spot and the payment breakdown. After the hold is paid you get a QR handoff code. Items that only ship go to a checkout instead. |
| **Make an offer** | Quick 95 / 90 / 80% amounts, ±$5 steps, and a minimum of 60% of the asking price. |
| **Sell** | "Take" three photos, then a pretend AI writes the title, category, condition, description and a price based on nearby sales. You edit it and post. |
| **Deals** | Things you're buying (offer sent, reserved, completed) and offers on your own items, which you can accept or decline. Tap an order to see its QR code, or simulate the seller scanning it. |
| **You** | Profile, stats, your listings, saved items, account settings. |

## Pricing used

- Selling is free.
- Buyers pay a protection fee of **$1 + 5%** of the first $500, plus 3% of anything above that.
- To reserve an item, the buyer pays a hold: **$5** under $100, **$10** under $500, **$20** otherwise. It counts toward the price, and the seller keeps it if the buyer doesn't show up.

All of it is in `src/data/fees.ts`.

## Look and feel

The brand is calm and premium: a warm off-white background, deep forest green for actions, **Newsreader** serif for headings and prices, and **Inter** for body text. Colors and fonts live in `src/theme.ts`. Shared components (text styles, buttons, chips, tabs, the seller row) are in `src/components/ui.tsx`.

There are no real photos yet. Each item is drawn as an icon on a soft colored background, like a product shot against a studio backdrop (`ItemImage`). Swap that for `expo-image` once listings have real photos.

## Code layout

```
src/
  app/                    Screens (Expo Router: each file is a route)
    (tabs)/               Browse, Sell, Deals, You
    listing/[id].tsx      Listing page
    reserve/[id].tsx      Reserve / checkout (modal)
    offer/[id].tsx        Make an offer (bottom sheet)
    order/[id].tsx        Order details and QR code
  components/             Shared UI
  data/                   Types, fake data, fee rules
  store.tsx               In-memory app state (React context)
  theme.ts                Colors, fonts, spacing
```

To connect a real backend, replace `src/data/mock.ts` and the functions in `src/store.tsx` with API calls. The screens shouldn't need to change.
