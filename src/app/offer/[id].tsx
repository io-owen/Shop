import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button, Chip, Row, T, tap } from '@/components/ui';
import { money } from '@/data/fees';
import { useStore } from '@/store';
import { colors, fonts, space } from '@/theme';

export default function OfferScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const store = useStore();
  const listing = store.getListing(id);
  const [amount, setAmount] = useState(() => (listing ? Math.round((listing.price * 0.9) / 5) * 5 : 0));
  const [sent, setSent] = useState(false);

  if (!listing) return null;

  const seller = store.getSeller(listing.sellerId);
  const floor = Math.ceil((listing.price * 0.6) / 5) * 5;
  const step = (d: number) => { tap(); setAmount((a) => Math.min(listing.price, Math.max(floor, a + d))); };

  if (sent) {
    return (
      <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center', gap: 10 }]}>
        <T variant="label" color={colors.forest}>Offer sent</T>
        <T variant="display">{money(amount)}</T>
        <T variant="body" style={{ textAlign: 'center', color: colors.muted, maxWidth: 280 }}>
          {seller.name.split(' ')[0]} usually replies in {seller.replies}. We’ll let you know.
        </T>
        <Button title="Done" style={{ alignSelf: 'stretch', marginTop: 24 }} onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <T variant="label">Make an offer</T>
      <T variant="heading" style={{ marginTop: 6 }} numberOfLines={1}>{listing.title}</T>
      <T variant="small">Asking {money(listing.price)}</T>

      <Row style={{ justifyContent: 'center', marginTop: 28 }} gap={22}>
        <Stepper icon="minus" onPress={() => step(-5)} />
        <T style={styles.amount}>{money(amount)}</T>
        <Stepper icon="plus" onPress={() => step(5)} />
      </Row>

      <Row gap={8} style={{ justifyContent: 'center', marginTop: 20 }}>
        {[0.95, 0.9, 0.8].map((pct) => {
          const v = Math.round((listing.price * pct) / 5) * 5;
          return <Chip key={pct} label={money(v)} selected={v === amount} onPress={() => setAmount(v)} />;
        })}
      </Row>

      <T variant="small" style={{ textAlign: 'center', marginTop: 16 }}>
        Offers below {money(floor)} aren’t allowed, so sellers don’t get lowballed.
      </T>

      <View style={{ flex: 1 }} />
      <Button
        title={`Send ${money(amount)} offer`}
        onPress={() => { store.sendOffer(listing, amount); setSent(true); }}
      />
    </View>
  );
}

function Stepper({ icon, onPress }: { icon: 'minus' | 'plus'; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} hitSlop={10} style={({ pressed }) => [styles.stepper, pressed && { opacity: 0.6 }]}>
      <Feather name={icon} size={20} color={colors.ink} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, padding: space.gutter, paddingTop: 30, paddingBottom: 40 },
  amount: { fontFamily: fonts.serif, fontSize: 60, lineHeight: 68, letterSpacing: -1.5, color: colors.ink, fontVariant: ['tabular-nums'], minWidth: 150, textAlign: 'center' },
  stepper: {
    width: 46, height: 46, borderRadius: 23, borderWidth: 1, borderColor: colors.lineStrong,
    backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center',
  },
});
