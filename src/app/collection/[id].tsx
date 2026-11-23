import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ListingCard } from '@/components/listing-card';
import { Avatar, IconButton, LiveDot, Reveal, Row, Rule, T, Verified } from '@/components/ui';
import { money } from '@/data/fees';
import type { Listing } from '@/data/types';
import { useStore } from '@/store';
import { colors, hairline, space } from '@/theme';

export default function CollectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const store = useStore();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const collection = store.getCollection(id);

  if (!collection) return null;

  const items = collection.listingIds.map((i) => store.getListing(i)).filter((l): l is Listing => !!l);
  const seller = collection.sellerId ? store.getSeller(collection.sellerId) : undefined;
  const total = items.reduce((s, l) => s + l.price, 0);
  const contentWidth = Math.min(width, 720) - space.gutter * 2;
  const cardWidth = (contentWidth - 14) / 2;
  const watching = items.reduce((s, l) => s + l.watchers, 0);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 64, paddingBottom: 48, alignItems: 'center' }}>
        <View style={{ width: contentWidth, gap: 10 }}>
          <T variant="label" color={colors.forest}>{collection.kind === 'moving' ? `Moving sale · ${collection.badge}` : collection.badge}</T>
          <T variant="display">{collection.title}</T>
          <T variant="body" style={{ color: colors.muted }}>{collection.subtitle}</T>

          {seller ? (
            <Row gap={12} style={styles.seller}>
              <Avatar seller={seller} size={44} />
              <View style={{ flex: 1 }}>
                <Row gap={5}>
                  <T variant="strong">{seller.name}</T>
                  {seller.verified ? <Verified /> : null}
                </Row>
                <T variant="small">{seller.trades} trades · Replies in {seller.replies}</T>
              </View>
            </Row>
          ) : null}

          <Row gap={8} style={{ marginTop: 4 }}>
            <LiveDot />
            <T variant="small" color={colors.forest}>{watching} people are watching these {items.length} items</T>
          </Row>

          {collection.bundlePrice ? (
            <View style={styles.bundle}>
              <T variant="strong">All three for {money(collection.bundlePrice)}</T>
              <T variant="small">That’s {money(total - collection.bundlePrice)} less than buying separately. Reserve each one and the discount is applied at pickup.</T>
            </View>
          ) : null}

          <Rule style={{ marginTop: 14, marginBottom: 10 }} />
        </View>

        <View style={{ width: contentWidth, flexDirection: 'row', flexWrap: 'wrap', columnGap: 14, rowGap: 28 }}>
          {items.map((l, i) => (
            <Reveal key={l.id} delay={Math.min(i, 6) * 70}>
              <ListingCard listing={l} width={cardWidth} />
            </Reveal>
          ))}
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', top: insets.top + 6, left: 14 }}>
        <IconButton label="Back" filled onPress={() => router.back()} icon={<Feather name="chevron-left" size={22} color={colors.ink} />} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  seller: { marginTop: 10, padding: 14, borderRadius: 16, backgroundColor: colors.surface, borderWidth: hairline, borderColor: colors.lineStrong },
  bundle: { marginTop: 6, padding: 16, borderRadius: 16, backgroundColor: colors.forestSoft, gap: 4 },
});
