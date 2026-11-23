import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar, Photo, Row, Rule, T, Verified, type FeatherName } from '@/components/ui';
import { money } from '@/data/fees';
import type { Listing } from '@/data/types';
import { postedText, useStore } from '@/store';
import { colors, hairline, space } from '@/theme';

export default function ProfileScreen() {
  const store = useStore();
  const insets = useSafeAreaInsets();
  const { me } = store;
  const savedListings = store.saved.map((id) => store.getListing(id)).filter((l): l is Listing => !!l);

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ paddingTop: insets.top + 24, paddingBottom: 48 }}>
      <View style={{ paddingHorizontal: space.gutter, alignItems: 'center', gap: 8 }}>
        <Avatar seller={me} size={88} />
        <Row gap={6} style={{ marginTop: 8 }}>
          <T variant="title">{me.name}</T>
          <Verified size={18} />
        </Row>
        <T variant="small">{me.neighborhood} · Member since {me.since}</T>
      </View>

      <Row gap={0} style={{ marginTop: 26, marginHorizontal: space.gutter, borderTopWidth: hairline, borderBottomWidth: hairline, borderColor: colors.lineStrong }}>
        <Stat value={`${me.trades}`} label="Trades" />
        <View style={{ width: hairline, alignSelf: 'stretch', backgroundColor: colors.lineStrong }} />
        <Stat value={me.rating.toFixed(1)} label="Rating" />
        <View style={{ width: hairline, alignSelf: 'stretch', backgroundColor: colors.lineStrong }} />
        <Stat value={me.replies} label="Replies" />
      </Row>

      <SectionHeader title="Your listings" action="Sell" onAction={() => router.navigate('/sell')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: space.gutter, gap: 14 }}>
        {store.mine.map((l) => (
          <Pressable key={l.id} onPress={() => router.push({ pathname: '/listing/[id]', params: { id: l.id } })} style={{ width: 150, gap: 4 }}>
            <Photo id={l.photo} backdrop={l.backdrop} width={150} height={160} radius={16} />
            <T variant="item" numberOfLines={1} style={{ marginTop: 6 }}>{l.title}</T>
            <T variant="small">{money(l.price)} · {l.watchers} watching</T>
            <T variant="small">{postedText(l)}</T>
          </Pressable>
        ))}
      </ScrollView>

      <SectionHeader title="Saved" />
      <View style={{ paddingHorizontal: space.gutter }}>
        {savedListings.length === 0 ? (
          <T variant="small">Tap the heart on anything to keep it here.</T>
        ) : (
          savedListings.map((l, i) => (
            <View key={l.id}>
              {i > 0 ? <Rule /> : null}
              <Pressable onPress={() => router.push({ pathname: '/listing/[id]', params: { id: l.id } })} style={{ paddingVertical: 12 }}>
                <Row gap={14}>
                  <Photo id={l.photo} backdrop={l.backdrop} width={52} height={52} radius={10} />
                  <T variant="item" style={{ flex: 1 }} numberOfLines={1}>{l.title}</T>
                  <T variant="price">{money(l.price)}</T>
                </Row>
              </Pressable>
            </View>
          ))
        )}
      </View>

      <SectionHeader title="Account" />
      <View style={{ paddingHorizontal: space.gutter }}>
        {([
          ['shield', 'ID verification', 'Verified'],
          ['credit-card', 'Payout account', 'Ending 4021'],
          ['bell', 'Saved searches', '3 active'],
          ['help-circle', 'Help and safety', ''],
        ] as [FeatherName, string, string][]).map(([icon, label, value], i) => (
          <View key={label}>
            {i > 0 ? <Rule /> : null}
            <Row gap={14} style={{ paddingVertical: 15 }}>
              <Feather name={icon} size={18} color={colors.forest} />
              <T variant="body" style={{ flex: 1 }}>{label}</T>
              {value ? <T variant="small">{value}</T> : null}
              <Feather name="chevron-right" size={17} color={colors.faint} />
            </Row>
          </View>
        ))}
      </View>

      <T variant="small" style={{ textAlign: 'center', marginTop: 36, color: colors.faint }}>
        Prototype · fake data · no real payments
      </T>
    </ScrollView>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', paddingVertical: 16, gap: 2 }}>
      <T variant="heading">{value}</T>
      <T variant="label">{label}</T>
    </View>
  );
}

function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <Row style={{ justifyContent: 'space-between', paddingHorizontal: space.gutter, marginTop: 34, marginBottom: 14 }}>
      <T variant="heading">{title}</T>
      {action ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <T variant="label" color={colors.forest}>{action}</T>
        </Pressable>
      ) : null}
    </Row>
  );
}
