import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, TextInput, useWindowDimensions, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Chip, LiveDot, Photo, Reveal, Row, Rule, T, tap, thump, type Focus } from '@/components/ui';
import { money } from '@/data/fees';
import { drafts } from '@/data/mock';
import { CATEGORIES, CONDITIONS, type Draft } from '@/data/types';
import { useStore } from '@/store';
import { colors, fonts, hairline, space } from '@/theme';

type Stage = 'capture' | 'writing' | 'review' | 'done';

/** The three "photos" you take: the whole item, then two close-ups. */
const SHOTS: (Focus | undefined)[] = [undefined, { x: 0.35, y: 0.6, zoom: 2 }, { x: 0.42, y: 0.72, zoom: 3 }];

/** Ticks of the writing animation (one tick ≈ 22 ms). */
function writingPlan(d: Draft) {
  const title = d.title.length;
  const category = title + 12;
  const condition = category + 10;
  const priceStart = condition + 8;
  const priceEnd = priceStart + 28;
  const descStart = priceEnd + 6;
  const end = descStart + Math.ceil(d.description.length / 2) + 10;
  return { title, category, condition, priceStart, priceEnd, descStart, end };
}

export default function SellScreen() {
  const store = useStore();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [stage, setStage] = useState<Stage>('capture');
  const [photos, setPhotos] = useState(0);
  const [index, setIndex] = useState(0);
  const [draft, setDraft] = useState<Draft>(drafts[0]);
  const [tick, setTick] = useState(0);

  const plan = writingPlan(draft);
  // Once the writing animation has run its course, the listing is ready to review.
  const current: Stage = stage === 'writing' && tick >= plan.end ? 'review' : stage;

  // Drive the "writing your listing" animation.
  useEffect(() => {
    if (current !== 'writing') return;
    const t = setInterval(() => setTick((n) => n + 1), 22);
    return () => clearInterval(t);
  }, [current]);

  const update = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));
  const startOver = () => {
    const next = (index + 1) % drafts.length;
    setIndex(next);
    setDraft(drafts[next]);
    setPhotos(0);
    setTick(0);
    setStage('capture');
  };

  const pad = { paddingTop: insets.top + 18, paddingHorizontal: space.gutter, paddingBottom: 48 };
  const contentWidth = width - space.gutter * 2;
  const slot = (contentWidth - 20) / 3;

  if (current === 'done') return <Posted draft={draft} pad={pad} onAgain={startOver} />;

  if (current === 'capture') {
    return (
      <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={[pad, { flexGrow: 1 }]}>
        <T variant="label" color={colors.forest}>Sell · Free to list</T>
        <T variant="display" style={{ marginTop: 10 }}>Three photos.{'\n'}We’ll do the rest.</T>
        <T variant="body" style={{ color: colors.muted, marginTop: 10 }}>
          We write the title and description, pick the category, and suggest a price from what sold nearby.
        </T>

        <Row gap={10} style={{ marginTop: 30 }}>
          {SHOTS.map((focus, i) =>
            i < photos ? (
              <Animated.View key={i} entering={ZoomIn.springify().damping(14)}>
                <Photo id={draft.photo} backdrop={draft.backdrop} width={slot} height={slot} radius={16} focus={focus} />
              </Animated.View>
            ) : (
              <Pressable key={i} onPress={() => { thump(); setPhotos((p) => Math.min(3, p + 1)); }}
                style={[styles.emptySlot, { width: slot, height: slot }]}>
                <Feather name={i === photos ? 'camera' : 'plus'} size={22} color={i === photos ? colors.forest : colors.faint} />
              </Pressable>
            ),
          )}
        </Row>
        <T variant="small" style={{ marginTop: 10 }}>
          {photos < 3 ? `${photos} of 3 · The whole thing, then any details or wear` : 'Looks great.'}
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
          <Button title="Take photo" icon="camera" onPress={() => { thump(); setPhotos((p) => p + 1); }} />
        ) : (
          <Button title="Write my listing" icon="feather" onPress={() => { setTick(0); setStage('writing'); }} />
        )}
      </ScrollView>
    );
  }

  // Writing (animated, read-only) and review (editable) share one layout.
  const writing = current === 'writing';
  const shown = writing
    ? {
        title: draft.title.slice(0, Math.min(tick, plan.title)),
        category: tick >= plan.category ? draft.category : undefined,
        condition: tick >= plan.condition ? draft.condition : undefined,
        price: tick < plan.priceStart ? undefined
          : Math.round(draft.priceLow + (draft.price - draft.priceLow) * Math.min(1, (tick - plan.priceStart) / (plan.priceEnd - plan.priceStart))),
        description: draft.description.slice(0, Math.max(0, (tick - plan.descStart) * 2)),
      }
    : { title: draft.title, category: draft.category, condition: draft.condition, price: draft.price, description: draft.description };

  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={pad} keyboardDismissMode="on-drag">
      <Row gap={8}>
        {writing ? <LiveDot /> : <Feather name="check-circle" size={14} color={colors.forest} />}
        <T variant="label" color={colors.forest}>{writing ? 'Writing your listing' : 'Ready to post'}</T>
      </Row>
      <T variant="title" style={{ marginTop: 8 }}>{writing ? 'Reading your photos…' : 'Here’s your listing.'}</T>
      <T variant="small" style={{ marginTop: 4 }}>
        {writing ? 'Comparing with 214 recent sales near you' : 'Drafted from your photos. Change anything.'}
      </T>

      <Row gap={8} style={{ marginTop: 22 }}>
        <Photo id={draft.photo} backdrop={draft.backdrop} width={contentWidth * 0.62} height={210} radius={18} />
        <View style={{ gap: 8 }}>
          <Photo id={draft.photo} backdrop={draft.backdrop} width={contentWidth * 0.38 - 8} height={101} radius={14} focus={SHOTS[1]} />
          <Photo id={draft.photo} backdrop={draft.backdrop} width={contentWidth * 0.38 - 8} height={101} radius={14} focus={SHOTS[2]} />
        </View>
      </Row>

      <Field label="Title">
        {writing ? (
          <T style={styles.input}>{shown.title}<T style={{ color: colors.forest }}>{tick < plan.title ? '▍' : ''}</T></T>
        ) : (
          <TextInput value={draft.title} onChangeText={(title) => update({ title })} style={styles.input} />
        )}
      </Field>

      <Field label="Category">
        <View style={styles.wrap}>
          {CATEGORIES.map((c) => (
            <Chip key={c} label={c} selected={c === shown.category} onPress={() => !writing && update({ category: c })} />
          ))}
        </View>
      </Field>

      <Field label="Condition">
        <View style={styles.wrap}>
          {CONDITIONS.map((c) => (
            <Chip key={c} label={c} selected={c === shown.condition} onPress={() => !writing && update({ condition: c })} />
          ))}
        </View>
      </Field>

      <Field label="Price">
        <Row style={{ justifyContent: 'space-between' }}>
          <T style={[styles.price, shown.price === undefined && { color: colors.faint }]}>
            {shown.price === undefined ? '$—' : money(shown.price)}
          </T>
          {writing ? null : (
            <Row gap={10}>
              <Chip label="−  5" onPress={() => update({ price: Math.max(5, draft.price - 5) })} />
              <Chip label="+  5" onPress={() => update({ price: draft.price + 5 })} />
            </Row>
          )}
        </Row>
        <PriceRange low={draft.priceLow} high={draft.priceHigh} value={shown.price} width={contentWidth} />
      </Field>

      <Field label="Description">
        {writing ? (
          <T style={[styles.input, styles.desc]}>{shown.description}</T>
        ) : (
          <TextInput value={draft.description} onChangeText={(description) => update({ description })} multiline style={[styles.input, styles.desc]} />
        )}
      </Field>

      {!writing ? (
        <Reveal>
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
        </Reveal>
      ) : null}
    </ScrollView>
  );
}

/** Where the price sits within the range of recent nearby sales. */
function PriceRange({ low, high, value, width }: { low: number; high: number; value?: number; width: number }) {
  const span = high - low;
  const pad = span * 0.25;
  const min = low - pad;
  const max = high + pad;
  const pos = (v: number) => ((Math.min(max, Math.max(min, v)) - min) / (max - min)) * width;
  return (
    <View style={{ marginTop: 6 }}>
      <View style={{ height: 22, justifyContent: 'center' }}>
        <View style={{ height: 6, borderRadius: 3, backgroundColor: colors.line }} />
        <View style={{ position: 'absolute', left: pos(low), width: pos(high) - pos(low), height: 6, borderRadius: 3, backgroundColor: colors.forestSoft }} />
        {value !== undefined ? (
          <View style={[styles.marker, { left: pos(value) - 9 }]} />
        ) : null}
      </View>
      <Row style={{ justifyContent: 'space-between', marginTop: 4 }}>
        <T variant="small">Sold nearby: {money(low)}–{money(high)}</T>
        <T variant="small" color={colors.forest}>Usually sells in 2 days</T>
      </Row>
    </View>
  );
}

function Posted({ draft, pad, onAgain }: { draft: Draft; pad: object; onAgain: () => void }) {
  const [notified, setNotified] = useState(0);
  const [saves, setSaves] = useState(0);
  const [viewing, setViewing] = useState(0);

  useEffect(() => {
    const a = setInterval(() => setNotified((n) => (n < 18 ? n + 1 : n)), 90);
    const b = setTimeout(() => { setViewing(2); thump(); }, 1500);
    const c = setTimeout(() => { setSaves(1); setViewing(4); thump(); }, 2600);
    const d = setTimeout(() => { setSaves(3); }, 3800);
    return () => { clearInterval(a); clearTimeout(b); clearTimeout(c); clearTimeout(d); };
  }, []);

  return (
    <View style={[styles.center, pad]}>
      <Animated.View entering={ZoomIn.springify().damping(12)}>
        <Photo id={draft.photo} backdrop={draft.backdrop} width={164} height={164} radius={24} />
      </Animated.View>
      <Reveal delay={150} style={{ alignItems: 'center' }}>
        <T variant="label" color={colors.forest} style={{ marginTop: 24 }}>Listed</T>
        <T variant="display" style={{ marginTop: 6 }}>You’re live.</T>
      </Reveal>

      <Reveal delay={350} style={styles.stats}>
        <Stat value={notified} label={`neighbors with a saved search for ${draft.category.toLowerCase()} notified`} />
        <Rule />
        <Stat value={viewing} label="looking at it right now" live />
        <Rule />
        <Stat value={saves} label="saved it" />
      </Reveal>

      <View style={{ alignSelf: 'stretch', gap: 10, marginTop: 28 }}>
        <Button title="Sell something else" onPress={onAgain} />
        <Button title="See your listings" variant="quiet" onPress={() => router.navigate('/profile')} />
      </View>
    </View>
  );
}

function Stat({ value, label, live }: { value: number; label: string; live?: boolean }) {
  return (
    <Row gap={14} style={{ paddingVertical: 12 }}>
      <T variant="heading" style={{ width: 36, fontVariant: ['tabular-nums'] }}>{value}</T>
      <T variant="small" style={{ flex: 1, color: colors.ink }}>{label}</T>
      {live && value > 0 ? <LiveDot /> : null}
    </Row>
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
      <Switch value={value} onValueChange={(v) => { tap(); onChange(v); }} trackColor={{ true: colors.forest, false: colors.lineStrong }} />
    </Row>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  emptySlot: {
    borderRadius: 16, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.lineStrong,
    alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface,
  },
  input: {
    fontFamily: fonts.serif, fontSize: 20, lineHeight: 26, color: colors.ink, paddingVertical: 8, minHeight: 44,
    borderBottomWidth: hairline, borderBottomColor: colors.lineStrong,
  },
  desc: { minHeight: 96, fontFamily: fonts.sans, fontSize: 15, lineHeight: 22 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  price: { fontFamily: fonts.serif, fontSize: 40, lineHeight: 46, color: colors.ink, letterSpacing: -1, fontVariant: ['tabular-nums'] },
  marker: { position: 'absolute', width: 18, height: 18, borderRadius: 9, backgroundColor: colors.forest, borderWidth: 3, borderColor: colors.bg },
  stats: { alignSelf: 'stretch', marginTop: 26, paddingHorizontal: 4 },
});
