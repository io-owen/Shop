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
| **Browse** | A rotating line of what's happening nearby, search, category tabs, a radius you can change (tap "Mission · within 10 mi"), the newest listing as a large featured card, **Maya's moving sale** (one seller's whole apartment), a **Near you** grid with live badges ("New · 4 min", "6 looking now"), a curated **Furnish a studio for $400** pick, and **Ships to you** for items from other cities. Pull down to refresh. |
| **Collection** | A moving sale or curated pick: the seller, how many people are watching, any bundle discount, and the items. |
| **Listing** | Swipeable photo gallery (main shot plus two close-ups), "people looking now", a personal note from the seller, a link to the moving sale it's part of, seller trust info, a three-step "How it works", a delivery quote for bulky items, and **Make an offer** / **Reserve** buttons. |
| **Reserve** | Pickup or delivery, a time slot, a safe meeting spot and the payment breakdown. After the hold is paid you get a QR handoff code. Items that only ship go to a checkout instead. |
| **Make an offer** | Quick 95 / 90 / 80% amounts, ±$5 steps, and a minimum of 60% of the asking price. |
| **Sell** | "Take" three photos, then watch a pretend AI write the listing live: the title types itself, the category and condition get picked, the price counts up on a bar of recent nearby sales, and the description types out. You edit it and post, then see neighbors being notified and saving it. |
| **Deals** | Things you're buying (offer sent, reserved, completed) and offers on your own items, which you can accept or decline. Tap an order to see its QR code, or simulate the seller scanning it. |
| **You** | Profile, stats, your listings, saved items, account settings. |

## Pricing used

- Selling is free.
- Buyers pay a protection fee of **$1 + 5%** of the first $500, plus 3% of anything above that.
- To reserve an item, the buyer pays a hold: **$5** under $100, **$10** under $500, **$20** otherwise. It counts toward the price, and the seller keeps it if the buyer doesn't show up.

All of it is in `src/data/fees.ts`.

## Look and feel

The brand is calm and premium: a warm off-white background, deep forest green for actions, **Newsreader** serif for headings and prices, and **Inter** for body text. Colors and fonts live in `src/theme.ts`. Shared components (text styles, buttons, chips, tabs, the seller row) are in `src/components/ui.tsx`.

### Photos

Listing photos and seller portraits are free-license images from [Unsplash](https://unsplash.com/license), loaded by id with `expo-image` (see `Photo` and `photoUrl` in `src/components/ui.tsx`). The gallery's close-ups are crops of the same photo, made by Unsplash's image service. A tiny version of each photo loads first so nothing flashes blank.

### Motion

- **Card to listing:** on iOS 18+, the photo zooms into the listing page (`Link.AppleZoom` / `Link.AppleZoomTarget`), and a long press shows a preview of the page (`Link.Preview`).
- **Saving:** the heart pops and bursts, with a light haptic.
- **Cards:** they ease down slightly while pressed and fade up in sequence as the feed loads.
- **Live signals:** pulsing dots for "happening now".
- **Reserving:** the "It's yours." confirmation springs in, then the QR code.

## Code layout

```
src/
  app/                    Screens (Expo Router: each file is a route)
    (tabs)/               Browse, Sell, Deals, You
    listing/[id].tsx      Listing page
    reserve/[id].tsx      Reserve / checkout (modal)
    offer/[id].tsx        Make an offer (bottom sheet)
    order/[id].tsx        Order details and QR code
    collection/[id].tsx   Moving sale or curated pick
  components/             Shared UI
  data/                   Types, fake data, fee rules
  store.tsx               In-memory app state (React context)
  theme.ts                Colors, fonts, spacing
```

To connect a real backend, replace `src/data/mock.ts` and the functions in `src/store.tsx` with API calls. The screens shouldn't need to change.
