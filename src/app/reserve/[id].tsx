import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Chip, IconButton, ItemImage, LineItem, Row, Rule, T, TextTabs } from '@/components/ui';
import { breakdown, money } from '@/data/fees';
import { pickupSlots, safeSpots } from '@/data/mock';
import type { Order } from '@/data/types';
import { shortName, useStore } from '@/store';
import { colors, hairline, space } from '@/theme';

const MODES = ['Pickup', 'Delivery'] as const;

export default function ReserveScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const store = useStore();
  const insets = useSafeAreaInsets();
  const listing = store.getListing(id);
  const [mode, setMode] = useState<(typeof MODES)[number]>('Pickup');
  const [slot, setSlot] = useState(pickupSlots[0]);
  const [spot, setSpot] = useState(safeSpots[0].name);
  const [order, setOrder] = useState<Order>();

  if (!listing) return null;

  const seller = store.getSeller(listing.sellerId);
  const fulfilment: Order['fulfilment'] = listing.shipsFrom ? 'shipping' : mode === 'Delivery' ? 'delivery' : 'pickup';
  const b = breakdown(listing, listing.price, fulfilment);

  const confirm = () => {
    if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setOrder(store.reserve(listing, fulfilment === 'shipping' ? 'Arrives in 3–5 days' : slot, fulfilment === 'pickup' ? spot : undefined, fulfilment));
  };

  if (order) {
    return (
      <View style={[styles.screen, { paddingBottom: insets.bottom + 20, justifyContent: 'space-between' }]}>
        <View />
        <View style={{ alignItems: 'center', gap: 10 }}>
          <T variant="label" color={colors.forest}>{fulfilment === 'shipping' ? 'Paid' : 'Reserved'}</T>
          <T variant="display" style={{ textAlign: 'center' }}>It’s yours.</T>
          <T variant="body" style={{ textAlign: 'center', color: colors.muted, maxWidth: 300 }}>
            {listing.title} · {order.slot}{order.spot ? ` · ${order.spot}` : ''}
          </T>
          {fulfilment === 'shipping' ? null : (
            <>
              <View style={styles.qr}>
                <QRCode value={`shop-handoff:${order.code}`} size={170} color={colors.ink} backgroundColor="#fff" />
              </View>
              <T variant="label">{order.code}</T>
              <T variant="small" style={{ textAlign: 'center', maxWidth: 260, marginTop: 4 }}>
                Show this at {fulfilment === 'delivery' ? 'delivery' : 'pickup'}. {shortName(seller.name)} scans it and gets paid.
              </T>
            </>
          )}
        </View>
        <Button
          title="View in Deals"
          onPress={() => {
            router.dismissAll();
            router.navigate('/deals');
          }}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={[styles.screen, { paddingBottom: 140 }]}>
        <Row style={{ justifyContent: 'space-between' }}>
          <T variant="title">{fulfilment === 'shipping' ? 'Checkout' : 'Reserve'}</T>
          <IconButton label="Close" onPress={() => router.back()} icon={<Feather name="x" size={22} color={colors.ink} />} />
        </Row>

        <Row gap={14} style={{ marginTop: 18 }}>
          <ItemImage icon={listing.icon} backdrop={listing.backdrop} iconSize={30} radius={12} style={{ width: 64, height: 64 }} />
          <View style={{ flex: 1, gap: 2 }}>
            <T variant="strong">{listing.title}</T>
            <T variant="small">from {shortName(seller.name)} · {seller.neighborhood}</T>
          </View>
          <T variant="price">{money(listing.price)}</T>
        </Row>

        {fulfilment === 'shipping' ? (
          <Section title="Shipping">
            <Row gap={12}>
              <Feather name="package" size={18} color={colors.forest} />
              <T variant="body" style={{ flex: 1 }}>Tracked, arrives in 3–5 days to your address</T>
            </Row>
          </Section>
        ) : (
          <>
            {listing.bulky ? (
              <View style={{ marginTop: 28 }}>
                <TextTabs items={MODES} value={mode} onChange={setMode} />
                <Rule style={{ marginTop: -1 }} />
              </View>
            ) : null}

            <Section title={mode === 'Delivery' ? 'Delivery window' : 'When'}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {pickupSlots.map((s) => <Chip key={s} label={s} selected={s === slot} onPress={() => setSlot(s)} />)}
              </View>
            </Section>

            {mode === 'Pickup' ? (
              <Section title="Where">
                {safeSpots.map((s, i) => (
                  <View key={s.name}>
                    {i > 0 ? <Rule /> : null}
                    <Pressable onPress={() => setSpot(s.name)} style={{ paddingVertical: 12 }}>
                      <Row gap={14}>
                        <Feather name="map-pin" size={17} color={spot === s.name ? colors.forest : colors.faint} />
                        <View style={{ flex: 1 }}>
                          <T variant="strong">{s.name}</T>
                          <T variant="small">{s.detail}</T>
                        </View>
                        <View style={[styles.radio, spot === s.name && styles.radioOn]}>
                          {spot === s.name ? <Feather name="check" size={13} color="#fff" /> : null}
                        </View>
                      </Row>
                    </Pressable>
                  </View>
                ))}
              </Section>
            ) : (
              <Section title="To">
                <Row gap={12}>
                  <Feather name="home" size={17} color={colors.forest} />
                  <T variant="body" style={{ flex: 1 }}>Your address · 18th St, Mission</T>
                </Row>
              </Section>
            )}
          </>
        )}

        <Section title="Payment">
          <View style={{ gap: 12 }}>
            <LineItem label="Item" value={money(b.price)} />
            <LineItem label="Buyer protection" value={money(b.fee)} note="Full refund if it isn't as described" />
            {b.extra ? <LineItem label={b.extraLabel} value={money(b.extra)} /> : null}
            <Rule />
            <LineItem label="Total" value={money(b.total)} bold />
            {fulfilment === 'shipping' ? null : (
              <>
                <LineItem label="Hold now" value={money(b.deposit)} note="Counts toward the total" />
                <LineItem label={fulfilment === 'delivery' ? 'Due at delivery' : 'Due at pickup'} value={money(b.dueLater)} />
              </>
            )}
          </View>
        </Section>

        {fulfilment === 'shipping' ? null : (
          <T variant="small" style={{ marginTop: 22 }}>
            If you don’t show up, the seller keeps the hold. If they cancel, you get it back right away.
          </T>
        )}
      </ScrollView>

      <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <Button
          title={fulfilment === 'shipping' ? `Pay ${money(b.total)}` : `Reserve with ${money(b.deposit)} hold`}
          onPress={confirm}
        />
      </View>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: 28, gap: 12 }}>
      <T variant="label">{title}</T>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flexGrow: 1, backgroundColor: colors.bg, padding: space.gutter, paddingTop: 24 },
  qr: {
    marginTop: 16, padding: 18, backgroundColor: '#fff', borderRadius: 22,
    borderWidth: hairline, borderColor: colors.lineStrong,
  },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: colors.lineStrong, alignItems: 'center', justifyContent: 'center' },
  radioOn: { backgroundColor: colors.forest, borderColor: colors.forest },
  bar: {
    position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: space.gutter, paddingTop: 12,
    backgroundColor: colors.bg, borderTopWidth: hairline, borderTopColor: colors.lineStrong,
  },
});
