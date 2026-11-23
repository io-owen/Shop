import { Feather } from '@expo/vector-icons';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Avatar, Button, HeartButton, IconButton, LineItem, LiveDot, Photo, Reveal, Row, Rule, SellerRow, T, type Focus,
} from '@/components/ui';
import { deliveryQuote, holdDeposit, money } from '@/data/fees';
import { distanceText, postedText, useStore } from '@/store';
import { colors, hairline, space } from '@/theme';

/** The main photo, then two close-ups cropped from it. */
const SHOTS: (Focus | undefined)[] = [undefined, { x: 0.35, y: 0.55, zoom: 2 }, { x: 0.68, y: 0.42, zoom: 2.6 }];
const HERO_HEIGHT = 470;

export default function ListingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const store = useStore();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [page, setPage] = useState(0);
  const listing = store.getListing(id);

  if (!listing) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <T variant="italic">This listing is gone.</T>
      </View>
    );
  }

  const seller = store.getSeller(listing.sellerId);
  const collection = listing.collection ? store.getCollection(listing.collection) : undefined;
  const isMine = listing.sellerId === 'me';
  const shipping = !!listing.shipsFrom;
  const deposit = holdDeposit(listing.price);
  const first = seller.name.split(' ')[0];

  const steps = shipping
    ? [
        ['Pay in the app', `Your money is held safely, not sent to ${first} yet.`],
        ['Tracked shipping', 'A prepaid label goes to the seller. Most items arrive in 3–5 days.'],
        ['Confirm it arrived', 'The seller is paid once you’ve checked it’s as described.'],
      ]
    : [
        ['Reserve it', `A ${money(deposit)} hold keeps it for you. It counts toward the price.`],
        ['Meet or get delivery', 'Pick a safe public spot, or have it brought to your door.'],
        ['Show your code', 'The seller scans it at handoff and gets paid. No cash, no haggling.'],
      ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 130 }}>
        <View style={{ width, height: HERO_HEIGHT }}>
          <Link.AppleZoomTarget>
            <View collapsable={false} style={{ width, height: HERO_HEIGHT }}>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e) => setPage(Math.round(e.nativeEvent.contentOffset.x / width))}>
                {SHOTS.map((focus, i) => (
                  <Photo key={i} id={listing.photo} backdrop={listing.backdrop} width={width} height={HERO_HEIGHT} focus={focus} />
                ))}
              </ScrollView>
            </View>
          </Link.AppleZoomTarget>
          <Row gap={6} style={styles.dots}>
            {SHOTS.map((_, i) => <View key={i} style={[styles.dot, i === page && styles.dotOn]} />)}
          </Row>
        </View>

        <View style={{ padding: space.gutter, gap: 22 }}>
          <Reveal style={{ gap: 8 }}>
            <T variant="label">{listing.category} · {listing.condition}</T>
            <T variant="title">{listing.title}</T>
            <T variant="title" color={colors.forest}>{money(listing.price)}</T>
            <T variant="small">{distanceText(listing)} · Listed {postedText(listing)}</T>
            {listing.lookingNow || listing.watchers ? (
              <Row gap={8} style={{ marginTop: 2 }}>
                <LiveDot />
                <T variant="small" color={colors.forest}>
                  {listing.lookingNow ? `${listing.lookingNow} people looking now` : ''}
                  {listing.lookingNow && listing.watchers ? ' · ' : ''}
                  {listing.watchers ? `${listing.watchers} saved it` : ''}
                </T>
              </Row>
            ) : null}
          </Reveal>

          {listing.note ? (
            <Reveal delay={80}>
              <Row gap={14} style={{ alignItems: 'flex-start' }}>
                <Avatar seller={seller} size={36} />
                <View style={{ flex: 1, gap: 4 }}>
                  <T variant="italic" style={{ fontSize: 19, lineHeight: 26 }}>“{listing.note}”</T>
                  <T variant="small">{first}, the seller</T>
                </View>
              </Row>
            </Reveal>
          ) : null}

          {collection ? (
            <Pressable onPress={() => router.push({ pathname: '/collection/[id]', params: { id: collection.id } })}>
              <Row gap={12} style={styles.collection}>
                <Feather name="package" size={18} color={colors.forest} />
                <View style={{ flex: 1 }}>
                  <T variant="strong">{collection.title}</T>
                  <T variant="small">This is one of {collection.listingIds.length} items · {collection.badge}</T>
                </View>
                <Feather name="chevron-right" size={18} color={colors.forest} />
              </Row>
            </Pressable>
          ) : null}

          <Rule />
          <SellerRow seller={seller} />
          <Rule />

          <View style={{ gap: 16 }}>
            <T variant="heading">How it works</T>
            {steps.map(([title, text], i) => (
              <Row key={title} gap={16} style={{ alignItems: 'flex-start' }}>
                <T variant="heading" color={colors.forest} style={{ width: 18 }}>{i + 1}</T>
                <View style={{ flex: 1, gap: 2 }}>
                  <T variant="strong">{title}</T>
                  <T variant="small">{text}</T>
                </View>
              </Row>
            ))}
          </View>

          {listing.bulky && !shipping ? (
            <Row gap={14} style={styles.note}>
              <Feather name="truck" size={20} color={colors.forest} />
              <View style={{ flex: 1 }}>
                <T variant="strong">Delivery available</T>
                <T variant="small">Brought to your door for about {money(deliveryQuote(listing))}.</T>
              </View>
            </Row>
          ) : null}

          <View style={{ gap: 8 }}>
            <T variant="heading">About this item</T>
            <T variant="body">{listing.description}</T>
          </View>

          <View style={{ gap: 12 }}>
            <Rule />
            <LineItem label="Condition" value={listing.condition} />
            <Rule />
            {listing.dimensions ? (
              <>
                <LineItem label="Size" value={listing.dimensions} />
                <Rule />
              </>
            ) : null}
            <LineItem label={shipping ? 'Ships from' : 'Pickup'} value={shipping ? listing.shipsFrom! : `${seller.neighborhood}${listing.street ? `, near ${listing.street}` : ''}`} />
            <Rule />
          </View>
        </View>
      </ScrollView>

      {/* Floating controls over the photo */}
      <Row style={{ position: 'absolute', top: insets.top + 6, left: 14, right: 14, justifyContent: 'space-between' }}>
        <IconButton label="Back" filled onPress={() => router.back()} icon={<Feather name="chevron-left" size={22} color={colors.ink} />} />
        <Row gap={10}>
          <IconButton
            label="Share"
            filled
            onPress={() => Share.share({ message: `${listing.title}, ${money(listing.price)}` })}
            icon={<Feather name="share" size={18} color={colors.ink} />}
          />
          <HeartButton saved={store.isSaved(listing.id)} onToggle={() => store.toggleSave(listing.id)} />
        </Row>
      </Row>

      <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        {isMine ? (
          <T variant="small" style={{ flex: 1, textAlign: 'center' }}>This is your listing.</T>
        ) : (
          <>
            <Button
              title="Make an offer"
              variant="secondary"
              style={{ flex: 1 }}
              onPress={() => router.push({ pathname: '/offer/[id]', params: { id: listing.id } })}
            />
            <Button
              title={shipping ? 'Buy now' : `Reserve · ${money(deposit)} hold`}
              style={{ flex: 1.35 }}
              onPress={() => router.push({ pathname: '/reserve/[id]', params: { id: listing.id } })}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dots: { position: 'absolute', bottom: 16, left: 0, right: 0, justifyContent: 'center', zIndex: 2 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.55)' },
  dotOn: { backgroundColor: '#fff', width: 18 },
  note: { backgroundColor: colors.forestSoft, borderRadius: 16, padding: 16 },
  collection: { borderRadius: 16, padding: 16, borderWidth: hairline, borderColor: colors.lineStrong, backgroundColor: colors.surface },
  bar: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    flexDirection: 'row', gap: 10, paddingHorizontal: space.gutter, paddingTop: 12,
    backgroundColor: colors.bg, borderTopWidth: hairline, borderTopColor: colors.lineStrong,
  },
});
