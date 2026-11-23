import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Share, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, IconButton, ItemImage, LineItem, Row, Rule, SellerRow, T } from '@/components/ui';
import { deliveryQuote, holdDeposit, money } from '@/data/fees';
import { distanceText, postedText, useStore } from '@/store';
import { colors, hairline, space } from '@/theme';

export default function ListingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const store = useStore();
  const insets = useSafeAreaInsets();
  const listing = store.getListing(id);

  if (!listing) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <T variant="italic">This listing is gone.</T>
      </View>
    );
  }

  const seller = store.getSeller(listing.sellerId);
  const saved = store.isSaved(listing.id);
  const isMine = listing.sellerId === 'me';
  const shipping = !!listing.shipsFrom;
  const deposit = holdDeposit(listing.price);

  const steps = shipping
    ? [
        ['Pay in the app', `Your money is held safely, not sent to ${seller.name.split(' ')[0]} yet.`],
        ['Tracked shipping', 'A prepaid label goes to the seller. Most items arrive in 3–5 days.'],
        ['Confirm it arrived', "The seller is paid once you've checked it's as described."],
      ]
    : [
        ['Reserve it', `A ${money(deposit)} hold keeps it for you. It counts toward the price.`],
        ['Meet or get delivery', 'Pick a safe public spot, or have it brought to your door.'],
        ['Show your code', 'The seller scans it at handoff and gets paid. No cash, no haggling.'],
      ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 130 }}>
        <ItemImage icon={listing.icon} backdrop={listing.backdrop} iconSize={150} radius={0} style={{ height: 460 }} />

        <View style={{ padding: space.gutter, gap: 22 }}>
          <View style={{ gap: 8 }}>
            <T variant="label">{listing.category} · {listing.condition}</T>
            <T variant="title">{listing.title}</T>
            <T variant="title" color={colors.forest}>{money(listing.price)}</T>
            <T variant="small">
              {distanceText(listing)} · Listed {postedText(listing)}
              {listing.watchers ? ` · ${listing.watchers} watching` : ''}
            </T>
          </View>

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
            <LineItem label={shipping ? 'Ships from' : 'Pickup'} value={shipping ? listing.shipsFrom! : seller.neighborhood} />
            <Rule />
          </View>
        </View>
      </ScrollView>

      {/* Floating controls over the image */}
      <Row style={{ position: 'absolute', top: insets.top + 6, left: 14, right: 14, justifyContent: 'space-between' }}>
        <IconButton label="Back" filled onPress={() => router.back()} icon={<Feather name="chevron-left" size={22} color={colors.ink} />} />
        <Row gap={10}>
          <IconButton
            label="Share"
            filled
            onPress={() => Share.share({ message: `${listing.title}, ${money(listing.price)}` })}
            icon={<Feather name="share" size={18} color={colors.ink} />}
          />
          <IconButton
            label={saved ? 'Remove from saved' : 'Save'}
            filled
            onPress={() => store.toggleSave(listing.id)}
            icon={<MaterialCommunityIcons name={saved ? 'heart' : 'heart-outline'} size={20} color={saved ? colors.danger : colors.ink} />}
          />
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
  note: { backgroundColor: colors.forestSoft, borderRadius: 16, padding: 16 },
  bar: {
    position: 'absolute', left: 0, right: 0, bottom: 0,
    flexDirection: 'row', gap: 10, paddingHorizontal: space.gutter, paddingTop: 12,
    backgroundColor: colors.bg, borderTopWidth: hairline, borderTopColor: colors.lineStrong,
  },
});
