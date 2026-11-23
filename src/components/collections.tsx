import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';

import { money } from '@/data/fees';
import { tickerLines } from '@/data/mock';
import type { Collection, Listing } from '@/data/types';
import { useStore } from '@/store';
import { colors, hairline } from '@/theme';
import { Avatar, LiveDot, Photo, PressScale, Row, T } from './ui';

/** A one-line, rotating feed of what's happening nearby. */
export function Ticker({ override }: { override?: string }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % tickerLines.length), 3400);
    return () => clearInterval(t);
  }, []);
  const line = override ?? tickerLines[i];
  return (
    <Row gap={8} style={{ height: 20, overflow: 'hidden' }}>
      <LiveDot />
      <Animated.View key={line} entering={FadeInDown.duration(380)} exiting={FadeOutUp.duration(240)} style={{ flex: 1 }}>
        <T variant="small" numberOfLines={1} style={{ color: colors.ink }}>{line}</T>
      </Animated.View>
    </Row>
  );
}

function useItems(c: Collection) {
  const store = useStore();
  return c.listingIds.map((id) => store.getListing(id)).filter((l): l is Listing => !!l);
}

/** A moving sale: one seller's whole home, shown as a photo collage. */
export function MovingSaleCard({ collection, width }: { collection: Collection; width: number }) {
  const store = useStore();
  const items = useItems(collection);
  const seller = store.getSeller(collection.sellerId ?? '');
  const from = Math.min(...items.map((l) => l.price));
  const big = Math.round(width * 0.62);
  const small = width - big - 6;
  const h = 236;

  return (
    <PressScale onPress={() => router.push({ pathname: '/collection/[id]', params: { id: collection.id } })}>
      <Row gap={10} style={{ marginBottom: 12 }}>
        <Avatar seller={seller} size={34} />
        <View style={{ flex: 1 }}>
          <T variant="label" color={colors.forest}>Moving sale · {collection.badge}</T>
          <T variant="heading" style={{ marginTop: 2 }}>{collection.title}</T>
          <T variant="small">{collection.subtitle}</T>
        </View>
      </Row>
      <Row gap={6} style={{ alignItems: 'stretch' }}>
        <Photo id={items[0].photo} backdrop={items[0].backdrop} width={big} height={h} radius={18} />
        <View style={{ gap: 6 }}>
          <Photo id={items[1].photo} backdrop={items[1].backdrop} width={small} height={(h - 6) / 2} radius={14} />
          <View>
            <Photo id={items[2].photo} backdrop={items[2].backdrop} width={small} height={(h - 6) / 2} radius={14} />
            <View style={styles.more}>
              <T variant="strong" color="#fff">+{items.length - 3}</T>
            </View>
          </View>
        </View>
      </Row>
      <Row style={{ justifyContent: 'space-between', marginTop: 10 }}>
        <Row gap={6}>
          <LiveDot />
          <T variant="small" color={colors.ink}>{items.reduce((s, l) => s + l.watchers, 0)} neighbors watching</T>
        </Row>
        <Row gap={4}>
          <T variant="small" color={colors.forest}>{items.length} items from {money(from)}</T>
          <Feather name="arrow-right" size={14} color={colors.forest} />
        </Row>
      </Row>
    </PressScale>
  );
}

/** A curated set of items from different sellers that work together. */
export function EditCard({ collection, width }: { collection: Collection; width: number }) {
  const items = useItems(collection);
  const total = items.reduce((s, l) => s + l.price, 0);
  const thumb = (width - 36 - 16) / 3;

  return (
    <PressScale onPress={() => router.push({ pathname: '/collection/[id]', params: { id: collection.id } })}>
      <View style={styles.edit}>
        <T variant="label" color={colors.forest}>{collection.badge}</T>
        <T variant="title" style={{ marginTop: 6 }}>{collection.title}</T>
        <T variant="small" style={{ marginTop: 4 }}>{collection.subtitle}</T>
        <Row gap={8} style={{ marginTop: 16 }}>
          {items.map((l) => (
            <View key={l.id} style={{ gap: 6 }}>
              <Photo id={l.photo} backdrop={l.backdrop} width={thumb} height={thumb * 1.15} radius={12} />
              <T variant="small" style={{ color: colors.ink }}>{money(l.price)}</T>
            </View>
          ))}
        </Row>
        <View style={styles.editFooter}>
          <View>
            <T variant="strong">All three for {money(collection.bundlePrice ?? total)}</T>
            {collection.bundlePrice ? <T variant="small">Save {money(total - collection.bundlePrice)} reserving together</T> : null}
          </View>
          <Feather name="arrow-right" size={18} color={colors.forest} />
        </View>
      </View>
    </PressScale>
  );
}

const styles = StyleSheet.create({
  more: {
    ...StyleSheet.absoluteFill, borderRadius: 14, backgroundColor: 'rgba(27,30,27,0.38)',
    alignItems: 'center', justifyContent: 'center',
  },
  edit: { backgroundColor: colors.forestSoft, borderRadius: 24, padding: 18 },
  editFooter: {
    marginTop: 16, paddingTop: 14, borderTopWidth: hairline, borderTopColor: 'rgba(31,77,58,0.25)',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
});
