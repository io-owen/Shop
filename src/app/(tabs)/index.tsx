import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ListingCard } from '@/components/listing-card';
import { Row, Rule, T, TextTabs, tap } from '@/components/ui';
import { CATEGORIES, type Listing } from '@/data/types';
import { useStore } from '@/store';
import { colors, fonts, space } from '@/theme';

const FILTERS = ['All', ...CATEGORIES] as const;
type Filter = (typeof FILTERS)[number];
const RADII = [2, 5, 10, 25];

export default function BrowseScreen() {
  const { listings } = useStore();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('All');
  const [radius, setRadius] = useState(10);

  const contentWidth = Math.min(width, 720) - space.gutter * 2;
  const cardWidth = (contentWidth - 14) / 2;

  const matches = listings
    .filter((l) => filter === 'All' || l.category === filter)
    .filter((l) => !query || l.title.toLowerCase().includes(query.toLowerCase()));
  const local = matches.filter((l) => !l.shipsFrom && l.distance <= radius).sort((a, b) => a.hoursAgo - b.hoursAgo);
  const shipped = matches.filter((l) => l.shipsFrom);

  const showFeatured = !query && filter === 'All' && local.length > 0;
  const featured = showFeatured ? local[0] : undefined;
  const grid = showFeatured ? local.slice(1) : local;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingTop: insets.top + 18, paddingBottom: 40, alignItems: 'center' }}
      keyboardDismissMode="on-drag">
      <View style={{ width: contentWidth }}>
        <Pressable
          onPress={() => { tap(); setRadius(RADII[(RADII.indexOf(radius) + 1) % RADII.length]); }}
          hitSlop={8}>
          <Row gap={6}>
            <Feather name="map-pin" size={12} color={colors.forest} />
            <T variant="label" color={colors.forest}>Mission · within {radius} mi</T>
            <Feather name="chevron-down" size={12} color={colors.forest} />
          </Row>
        </Pressable>

        <T variant="display" style={{ marginTop: 10 }}>Good things,{'\n'}close to home.</T>

        <View style={styles.search}>
          <Feather name="search" size={17} color={colors.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Sofas, bikes, lamps…"
            placeholderTextColor={colors.faint}
            style={styles.searchInput}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 22, alignSelf: 'stretch' }}
        contentContainerStyle={{ paddingHorizontal: (width - contentWidth) / 2 }}>
        <TextTabs items={FILTERS} value={filter} onChange={setFilter} />
      </ScrollView>
      <Rule style={{ alignSelf: 'stretch', marginTop: -1 }} />

      <View style={{ width: contentWidth, marginTop: 24, gap: 36 }}>
        {featured ? <ListingCard listing={featured} width={contentWidth} featured /> : null}

        {grid.length > 0 ? (
          <Section title="Near you" meta={`${local.length} within ${radius} mi`} listings={grid} cardWidth={cardWidth} />
        ) : null}

        {shipped.length > 0 ? (
          <Section
            title="Ships to you"
            meta="Protected until it arrives"
            listings={shipped}
            cardWidth={cardWidth}
          />
        ) : null}

        {local.length === 0 && shipped.length === 0 ? (
          <View style={{ paddingVertical: 60, alignItems: 'center', gap: 6 }}>
            <T variant="italic">Nothing here yet.</T>
            <T variant="small">Try a wider radius or another category.</T>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

function Section({ title, meta, listings, cardWidth }: { title: string; meta: string; listings: Listing[]; cardWidth: number }) {
  return (
    <View>
      <Row style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <T variant="heading">{title}</T>
        <T variant="small">{meta}</T>
      </Row>
      <Rule style={{ marginTop: 10, marginBottom: 18 }} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 14, rowGap: 28 }}>
        {listings.map((l) => <ListingCard key={l.id} listing={l} width={cardWidth} />)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  search: {
    marginTop: 22, height: 50, borderRadius: 14, paddingHorizontal: 16,
    backgroundColor: colors.surface, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.lineStrong,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  searchInput: { flex: 1, fontFamily: fonts.sans, fontSize: 16, color: colors.ink, height: '100%' },
});
