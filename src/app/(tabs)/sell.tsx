import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Switch, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Chip, ItemImage, Row, Rule, T, tap } from '@/components/ui';
import { drafts } from '@/data/mock';
import { CATEGORIES, CONDITIONS, type Draft } from '@/data/types';
import { money } from '@/data/fees';
import { useStore } from '@/store';
import { colors, fonts, hairline, space } from '@/theme';

type Stage = 'capture' | 'reading' | 'review' | 'done';

export default function SellScreen() {
  const store = useStore();
  const insets = useSafeAreaInsets();
  const [stage, setStage] = useState<Stage>('capture');
  const [photos, setPhotos] = useState(0);
  const [index, setIndex] = useState(0);
  const [draft, setDraft] = useState<Draft>(drafts[0]);

  useEffect(() => {
    if (stage !== 'reading') return;
    const t = setTimeout(() => setStage('review'), 1600);
    return () => clearTimeout(t);
  }, [stage]);

  const update = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));
  const startOver = () => {
    const next = (index + 1) % drafts.length;
    setIndex(next);
    setDraft(drafts[next]);
    setPhotos(0);
    setStage('capture');
  };

  const pad = { paddingTop: insets.top + 18, paddingHorizontal: space.gutter, paddingBottom: 40 };

  if (stage === 'reading') {
    return (
      <View style={[styles.center, pad]}>
        <ActivityIndicator color={colors.forest} />
        <T variant="italic" style={{ marginTop: 18 }}>Reading your photos…</T>
        <T variant="small">Comparing with 214 recent sales nearby</T>
      </View>
    );
  }

  if (stage === 'done') {
    return (
      <View style={[styles.center, pad]}>
        <ItemImage icon={draft.icon} backdrop={draft.backdrop} iconSize={64} radius={22} style={{ width: 150, height: 150 }} />
        <T variant="label" color={colors.forest} style={{ marginTop: 24 }}>Listed</T>
        <T variant="display" style={{ marginTop: 6 }}>You’re live.</T>
        <T variant="body" style={{ textAlign: 'center', color: colors.muted, maxWidth: 290, marginTop: 8 }}>
          18 people nearby have a saved search for {draft.category.toLowerCase()}. We’ve let them know.
        </T>
        <View style={{ alignSelf: 'stretch', gap: 10, marginTop: 36 }}>
          <Button title="Sell something else" onPress={startOver} />
          <Button title="See your listings" variant="quiet" onPress={() => router.navigate('/profile')} />
        </View>
      </View>
    );
  }

  if (stage === 'capture') {
    return (
      <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={[pad, { flexGrow: 1 }]}>
        <T variant="label" color={colors.forest}>Sell · Free to list</T>
        <T variant="display" style={{ marginTop: 10 }}>Three photos.{'\n'}We’ll do the rest.</T>
        <T variant="body" style={{ color: colors.muted, marginTop: 10 }}>
          We write the title and description, pick the category, and suggest a price from what sold nearby.
        </T>

        <Row gap={10} style={{ marginTop: 30 }}>
          {[0, 1, 2].map((i) =>
            i < photos ? (
              <ItemImage key={i} icon={draft.icon} backdrop={draft.backdrop} iconSize={34} radius={16} style={styles.slot} />
            ) : (
              <Pressable key={i} onPress={() => { tap(); setPhotos((p) => Math.min(3, p + 1)); }} style={[styles.slot, styles.emptySlot]}>
                <Feather name={i === photos ? 'camera' : 'plus'} size={22} color={i === photos ? colors.forest : colors.faint} />
              </Pressable>
            ),
          )}
        </Row>
        <T variant="small" style={{ marginTop: 10 }}>
          {photos < 3 ? `${photos} of 3 · Front, back and any wear` : 'Looks good.'}
        </T>

        <View style={{ flex: 1, minHeight: 30 }} />

        <View style={{ gap: 14, marginBottom: 28 }}>
          {[
            ['tag', 'Selling is free. Buyers pay a small protection fee.'],
            ['shield', 'Buyers put down a hold, so they actually show up.'],
            ['truck', 'Offer delivery on big items with one switch.'],
          ].map(([icon, text]) => (
            <Row key={text} gap={12}>
              <Feather name={icon as 'tag'} size={16} color={colors.forest} />
              <T variant="small" style={{ flex: 1, color: colors.ink }}>{text}</T>
            </Row>
          ))}
        </View>

        {photos < 3 ? (
          <Button title="Take photo" icon="camera" onPress={() => setPhotos((p) => p + 1)} />
        ) : (
          <Button title="Write my listing" icon="feather" onPress={() => setStage('reading')} />
        )}
      </ScrollView>
    );
  }

  // Review
  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={pad} keyboardDismissMode="on-drag">
      <T variant="label" color={colors.forest}>Review</T>
      <T variant="title" style={{ marginTop: 8 }}>Here’s your listing.</T>
      <T variant="small" style={{ marginTop: 4 }}>Drafted from your photos. Change anything.</T>

      <ItemImage icon={draft.icon} backdrop={draft.backdrop} iconSize={90} radius={20} style={{ height: 220, marginTop: 22 }} />

      <Field label="Title">
        <TextInput value={draft.title} onChangeText={(title) => update({ title })} style={styles.input} />
      </Field>

      <Field label="Category">
        <View style={styles.wrap}>
          {CATEGORIES.map((c) => <Chip key={c} label={c} selected={c === draft.category} onPress={() => update({ category: c })} />)}
        </View>
      </Field>

      <Field label="Condition">
        <View style={styles.wrap}>
          {CONDITIONS.map((c) => <Chip key={c} label={c} selected={c === draft.condition} onPress={() => update({ condition: c })} />)}
        </View>
      </Field>

      <Field label="Price">
        <Row style={{ justifyContent: 'space-between' }}>
          <T style={styles.price}>{money(draft.price)}</T>
          <Row gap={10}>
            <Chip label="−  5" onPress={() => update({ price: Math.max(5, draft.price - 5) })} />
            <Chip label="+  5" onPress={() => update({ price: draft.price + 5 })} />
          </Row>
        </Row>
        <View style={styles.comps}>
          <Feather name="trending-up" size={15} color={colors.forest} />
          <T variant="small" style={{ flex: 1, color: colors.ink }}>
            Similar items near you sold for {money(draft.priceLow)}–{money(draft.priceHigh)} in the last 30 days.
          </T>
        </View>
      </Field>

      <Field label="Description">
        <TextInput
          value={draft.description}
          onChangeText={(description) => update({ description })}
          multiline
          style={[styles.input, { minHeight: 90, fontFamily: fonts.sans, fontSize: 15, lineHeight: 22 }]}
        />
      </Field>

      {draft.dimensions !== undefined ? (
        <Field label="Size">
          <TextInput value={draft.dimensions} onChangeText={(dimensions) => update({ dimensions })} style={styles.input} />
        </Field>
      ) : null}

      <View style={{ marginTop: 28, gap: 2 }}>
        <Toggle label="Offer delivery" note="For big items. The buyer pays the driver." value={draft.bulky} onChange={(bulky) => update({ bulky })} />
        <Rule />
        <Toggle label="Willing to ship" note="We send you a prepaid label." value={draft.ships} onChange={(ships) => update({ ships })} />
      </View>

      <Button title="Post listing" style={{ marginTop: 30 }} onPress={() => { store.publish(draft); setStage('done'); }} />
      <Button title="Start over" variant="quiet" style={{ marginTop: 4 }} onPress={startOver} />
    </ScrollView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: 26, gap: 10 }}>
      <T variant="label">{label}</T>
      {children}
    </View>
  );
}

function Toggle({ label, note, value, onChange }: { label: string; note: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <Row gap={12} style={{ paddingVertical: 12 }}>
      <View style={{ flex: 1 }}>
        <T variant="strong">{label}</T>
        <T variant="small">{note}</T>
      </View>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: colors.forest, false: colors.lineStrong }} />
    </Row>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  slot: { flex: 1, aspectRatio: 1 },
  emptySlot: {
    borderRadius: 16, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.lineStrong,
    alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface,
  },
  input: {
    fontFamily: fonts.serif, fontSize: 20, color: colors.ink, paddingVertical: 8,
    borderBottomWidth: hairline, borderBottomColor: colors.lineStrong,
  },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  price: { fontFamily: fonts.serif, fontSize: 40, lineHeight: 46, color: colors.ink, letterSpacing: -1 },
  comps: { flexDirection: 'row', gap: 10, backgroundColor: colors.forestSoft, borderRadius: 14, padding: 14, alignItems: 'center' },
});
