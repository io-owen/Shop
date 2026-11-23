import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, ItemImage, Row, Rule, T, TextTabs } from '@/components/ui';
import { money } from '@/data/fees';
import { shortName, statusText, useStore } from '@/store';
import { colors, space } from '@/theme';

const TABS = ['Buying', 'Selling'] as const;

export default function DealsScreen() {
  const store = useStore();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<(typeof TABS)[number]>('Buying');

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ paddingTop: insets.top + 18, paddingBottom: 40 }}>
      <View style={{ paddingHorizontal: space.gutter }}>
        <T variant="display">Deals</T>
        <View style={{ marginTop: 18 }}>
          <TextTabs items={TABS} value={tab} onChange={setTab} />
        </View>
      </View>
      <Rule style={{ marginTop: -1 }} />

      <View style={{ paddingHorizontal: space.gutter }}>
        {tab === 'Buying'
          ? store.orders.map((order, i) => {
              const listing = store.getListing(order.listingId);
              if (!listing) return null;
              const status = statusText[order.status];
              return (
                <View key={order.id}>
                  {i > 0 ? <Rule /> : null}
                  <Pressable
                    onPress={() => router.push({ pathname: '/order/[id]', params: { id: order.id } })}
                    style={({ pressed }) => [{ paddingVertical: 16 }, pressed && { opacity: 0.6 }]}>
                    <Row gap={14}>
                      <ItemImage icon={listing.icon} backdrop={listing.backdrop} iconSize={28} radius={12} style={{ width: 64, height: 64 }} />
                      <View style={{ flex: 1, gap: 3 }}>
                        <T variant="label" color={status.color}>{status.label}</T>
                        <T variant="strong" numberOfLines={1}>{listing.title}</T>
                        <T variant="small" numberOfLines={1}>{money(order.price)} · {order.slot}</T>
                      </View>
                      <Feather name="chevron-right" size={18} color={colors.faint} />
                    </Row>
                  </Pressable>
                </View>
              );
            })
          : store.offers.map((offer, i) => {
              const listing = store.getListing(offer.listingId);
              if (!listing) return null;
              return (
                <View key={offer.id}>
                  {i > 0 ? <Rule /> : null}
                  <View style={{ paddingVertical: 18, gap: 14 }}>
                    <Row gap={14}>
                      <ItemImage icon={listing.icon} backdrop={listing.backdrop} iconSize={28} radius={12} style={{ width: 64, height: 64 }} />
                      <View style={{ flex: 1, gap: 3 }}>
                        <T variant="label">Offer on {listing.title}</T>
                        <T variant="heading">{money(offer.amount)}</T>
                        <T variant="small">
                          From {shortName(offer.buyer)} · {offer.buyerTrades} trades · You asked {money(listing.price)}
                        </T>
                      </View>
                    </Row>
                    {offer.state === 'pending' ? (
                      <Row gap={10}>
                        <Button title="Decline" variant="secondary" size="sm" style={{ flex: 1 }} onPress={() => store.respondToOffer(offer.id, false)} />
                        <Button title={`Accept ${money(offer.amount)}`} size="sm" style={{ flex: 1.4 }} onPress={() => store.respondToOffer(offer.id, true)} />
                      </Row>
                    ) : (
                      <T variant="small" color={offer.state === 'accepted' ? colors.forest : colors.faint}>
                        {offer.state === 'accepted' ? 'Accepted. Waiting for the buyer to pick a time.' : 'Declined'}
                      </T>
                    )}
                  </View>
                </View>
              );
            })}
      </View>
    </ScrollView>
  );
}
