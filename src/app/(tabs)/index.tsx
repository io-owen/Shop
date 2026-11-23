import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, TextInput, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EditCard, MovingSaleCard, Ticker } from '@/components/collections';
import { ListingCard } from '@/components/listing-card';
import { Reveal, Row, Rule, T, TextTabs, tap } from '@/components/ui';
import { CATEGORIES, type Listing } from '@/data/types';
import { useStore } from '@/store';
import { colors, fonts, space } from '@/theme';

const FILTERS = ['All', ...CATEGORIES] as const;
type Filter = (typeof FILTERS)[number];
const RADII = [2, 5, 10, 25];

export default function BrowseScreen() {
  const { listings, collections } = useStore();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('All');
  const [radius, setRadius] = useState(10);
  const [refreshing, setRefreshing] = useState(false);
  const [tickerOverride, setTickerOverride] = useState<string>();

  const contentWidth = Math.min(width, 720) - space.gutter * 2;
  const cardWidth = (contentWidth - 14) / 2;

  const matches = listings
    .filter((l) => filter === 'All' || l.category === filter)
    .filter((l) => !query || l.title.toLowerCase().includes(query.toLowerCase()));
  const local = matches.filter((l) => !l.shipsFrom && l.distance <= radius).sort((a, b) => a.minutesAgo - b.minutesAgo);
  const shipped = matches.filter((l) => l.shipsFrom);

  const home = !query && filter === 'All';
  const moving = collections.find((c) => c.kind === 'moving');
  const edit = collections.find((c) => c.kind === 'edit');

  // On the home view the moving sale has its own card, so leave its items out of the grid.
  const featured = home ? local[0] : undefined;
  const grid = home ? local.slice(1).filter((l) => l.collection !== moving?.id) : local;
  const firstRows = home ? grid.slice(0, 4) : grid;
  const rest = home ? grid.slice(4) : [];

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setTickerOverride('You’re up to date · 3 new in the last hour');
      setTimeout(() => setTickerOverride(undefined), 4000);
    }, 900);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentContainerStyle={{ paddingTop: insets.top + 18, paddingBottom: 48, alignItems: 'center' }}
      keyboardDismissMode="on-drag"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.forest} />}>
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
        <View style={{ marginTop: 12 }}>
          <Ticker override={tickerOverride} />
        </View>

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

      <View style={{ width: contentWidth, marginTop: 24, gap: 40 }}>
        {featured ? (
          <Reveal>
            <ListingCard listing={featured} width={contentWidth} featured />
          </Reveal>
        ) : null}

        {home && moving ? (
          <Reveal delay={120}>
            <MovingSaleCard collection={moving} width={contentWidth} />
          </Reveal>
        ) : null}

        {firstRows.length > 0 ? (
          <Section title="Near you" meta={`${local.length} within ${radius} mi`} listings={firstRows} cardWidth={cardWidth} />
        ) : null}

        {home && edit ? <EditCard collection={edit} width={contentWidth} /> : null}

        {rest.length > 0 ? <Section title="More nearby" listings={rest} cardWidth={cardWidth} /> : null}

        {shipped.length > 0 ? (
          <Section title="Ships to you" meta="Protected until it arrives" listings={shipped} cardWidth={cardWidth} />
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

function Section({ title, meta, listings, cardWidth }: { title: string; meta?: string; listings: Listing[]; cardWidth: number }) {
  return (
    <View>
      <Row style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <T variant="heading">{title}</T>
        {meta ? <T variant="small">{meta}</T> : null}
      </Row>
      <Rule style={{ marginTop: 10, marginBottom: 18 }} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: 14, rowGap: 28 }}>
        {listings.map((l, i) => (
          <Reveal key={l.id} delay={Math.min(i, 6) * 70}>
            <ListingCard listing={l} width={cardWidth} />
          </Reveal>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  search: {
    marginTop: 18, height: 50, borderRadius: 14, paddingHorizontal: 16,
    backgroundColor: colors.surface, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.lineStrong,
    flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  searchInput: { flex: 1, fontFamily: fonts.sans, fontSize: 16, color: colors.ink, height: '100%' },
});
