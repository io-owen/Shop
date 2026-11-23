import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { useEffect, type ComponentProps, type ReactNode } from 'react';
import {
  PixelRatio, Platform, Pressable, StyleSheet, Text, View,
  type StyleProp, type TextProps, type ViewStyle,
} from 'react-native';
import Animated, {
  Easing, type SharedValue, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withSpring, withTiming,
} from 'react-native-reanimated';

import type { PhotoId, Seller } from '@/data/types';
import { backdrops, colors, fonts, hairline, type Backdrop } from '@/theme';

export type FeatherName = ComponentProps<typeof Feather>['name'];

const native = Platform.OS !== 'web';

export function tap() {
  if (native) Haptics.selectionAsync();
}

export function thump() {
  if (native) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

// ─── Type ──────────────────────────────────────────────────────────────

const type = StyleSheet.create({
  display: { fontFamily: fonts.serif, fontSize: 38, lineHeight: 42, letterSpacing: -0.8, color: colors.ink },
  title: { fontFamily: fonts.serif, fontSize: 30, lineHeight: 35, letterSpacing: -0.5, color: colors.ink },
  heading: { fontFamily: fonts.serif, fontSize: 22, lineHeight: 27, letterSpacing: -0.2, color: colors.ink },
  price: { fontFamily: fonts.serif, fontSize: 19, lineHeight: 23, color: colors.ink },
  body: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 22, color: colors.ink },
  strong: { fontFamily: fonts.sansSemi, fontSize: 15, lineHeight: 21, color: colors.ink },
  item: { fontFamily: fonts.sansMedium, fontSize: 14, lineHeight: 19, color: colors.ink },
  small: { fontFamily: fonts.sans, fontSize: 13, lineHeight: 18, color: colors.muted },
  label: { fontFamily: fonts.sansSemi, fontSize: 11, lineHeight: 14, letterSpacing: 1.3, textTransform: 'uppercase', color: colors.muted },
  italic: { fontFamily: fonts.serifItalic, fontSize: 18, lineHeight: 24, color: colors.ink },
});

export type TextVariant = keyof typeof type;

export function T({ variant = 'body', color, style, ...rest }: TextProps & { variant?: TextVariant; color?: string }) {
  return <Text {...rest} style={[type[variant], color ? { color } : null, style]} />;
}

// ─── Layout bits ───────────────────────────────────────────────────────

export function Rule({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[{ height: hairline, backgroundColor: colors.lineStrong }, style]} />;
}

export function Row({ children, gap = 8, style }: { children: ReactNode; gap?: number; style?: StyleProp<ViewStyle> }) {
  return <View style={[{ flexDirection: 'row', alignItems: 'center', gap }, style]}>{children}</View>;
}

// ─── Photos ────────────────────────────────────────────────────────────

export interface Focus { x: number; y: number; zoom: number }

/** Builds an Unsplash image URL sized for the screen. `focus` zooms into part of the photo. */
export function photoUrl(id: PhotoId, width: number, height?: number, focus?: Focus) {
  const scale = Math.min(PixelRatio.get(), 3);
  const w = Math.min(Math.round(width * scale), 1400);
  let url = `https://images.unsplash.com/photo-${id}?auto=format&q=72&w=${w}`;
  if (height) url += `&h=${Math.min(Math.round(height * scale), 1800)}&fit=crop`;
  if (focus) url += `&crop=focalpoint&fp-x=${focus.x}&fp-y=${focus.y}&fp-z=${focus.zoom}`;
  return url;
}

export function Photo({
  id, width, height, backdrop = 'stone', radius = 0, focus, style,
}: {
  id: PhotoId; width: number; height: number; backdrop?: Backdrop; radius?: number;
  focus?: Focus; style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[{ width, height, borderRadius: radius, overflow: 'hidden', backgroundColor: backdrops[backdrop][0] }, style]}>
      <Image
        source={{ uri: photoUrl(id, width, height, focus) }}
        // A tiny version loads almost instantly and is swapped for the sharp one.
        placeholder={{ uri: photoUrl(id, 40, height ? (40 * height) / width : undefined, focus) }}
        placeholderContentFit="cover"
        style={{ width: '100%', height: '100%' }}
        contentFit="cover"
        transition={280}
        cachePolicy="memory-disk"
      />
    </View>
  );
}

// ─── Motion bits ───────────────────────────────────────────────────────

/** A small dot that gently pulses, for "happening now" signals. */
export function LiveDot({ color = colors.forest, size = 7 }: { color?: string; size?: number }) {
  const pulse = useSharedValue(0);
  useEffect(() => {
    pulse.set(withRepeat(withTiming(1, { duration: 1400, easing: Easing.out(Easing.quad) }), -1, false));
  }, [pulse]);
  const ring = useAnimatedStyle(() => ({ opacity: 0.45 * (1 - pulse.value), transform: [{ scale: 1 + pulse.value * 1.6 }] }));
  return (
    <View style={{ width: size, height: size }}>
      <Animated.View style={[{ position: 'absolute', width: size, height: size, borderRadius: size, backgroundColor: color }, ring]} />
      <View style={{ width: size, height: size, borderRadius: size, backgroundColor: color }} />
    </View>
  );
}

/** Frosted pill used on photos: "New · 4 min", "6 looking now". */
export function LivePill({ text, style }: { text: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.livePill, style]}>
      <LiveDot />
      <Text style={styles.livePillText}>{text}</Text>
    </View>
  );
}

const BURST = [0, 60, 120, 180, 240, 300];

/** Heart toggle that pops and bursts when you save. */
export function HeartButton({ saved, onToggle, size = 40 }: { saved: boolean; onToggle: () => void; size?: number }) {
  const scale = useSharedValue(1);
  const burst = useSharedValue(0);

  const press = () => {
    if (!saved) {
      thump();
      scale.set(withSequence(withTiming(0.7, { duration: 90 }), withSpring(1, { damping: 6, stiffness: 260 })));
      burst.set(0);
      burst.set(withTiming(1, { duration: 520, easing: Easing.out(Easing.cubic) }));
    } else {
      tap();
      scale.set(withSequence(withTiming(0.85, { duration: 80 }), withSpring(1)));
    }
    onToggle();
  };

  const heartStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable onPress={press} hitSlop={8} accessibilityLabel={saved ? 'Remove from saved' : 'Save'}
      style={[styles.heart, { width: size, height: size, borderRadius: size / 2 }]}>
      {BURST.map((deg) => <BurstDot key={deg} angle={deg} progress={burst} />)}
      <Animated.View style={heartStyle}>
        <MaterialCommunityIcons name={saved ? 'heart' : 'heart-outline'} size={size * 0.48} color={saved ? colors.danger : colors.ink} />
      </Animated.View>
    </Pressable>
  );
}

function BurstDot({ angle, progress }: { angle: number; progress: SharedValue<number> }) {
  const rad = (angle * Math.PI) / 180;
  const style = useAnimatedStyle(() => {
    const d = 6 + progress.value * 20;
    return {
      opacity: progress.value > 0 && progress.value < 1 ? 1 - progress.value : 0,
      transform: [{ translateX: Math.cos(rad) * d }, { translateY: Math.sin(rad) * d }, { scale: 1 - progress.value * 0.5 }],
    };
  });
  return <Animated.View pointerEvents="none" style={[styles.burstDot, style]} />;
}

/** A pressable that eases down slightly while held. Accepts onPress from Link asChild. */
export function PressScale({ children, onPress, style }: { children: ReactNode; onPress?: () => void; style?: StyleProp<ViewStyle> }) {
  const s = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => { s.set(withTiming(0.97, { duration: 120 })); }}
      onPressOut={() => { s.set(withSpring(1, { damping: 14, stiffness: 220 })); }}>
      <Animated.View style={[anim, style]}>{children}</Animated.View>
    </Pressable>
  );
}

/** Fades and lifts its children in after `delay` ms. */
export function Reveal({ children, delay = 0, style }: { children: ReactNode; delay?: number; style?: StyleProp<ViewStyle> }) {
  const p = useSharedValue(0);
  useEffect(() => {
    p.set(withDelay(delay, withTiming(1, { duration: 520, easing: Easing.out(Easing.cubic) })));
  }, [p, delay]);
  const anim = useAnimatedStyle(() => ({ opacity: p.value, transform: [{ translateY: (1 - p.value) * 14 }] }));
  return <Animated.View style={[anim, style]}>{children}</Animated.View>;
}

// ─── Buttons ───────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'quiet' | 'danger';

export function Button({
  title, onPress, variant = 'primary', size = 'md', icon, style, disabled,
}: {
  title: string; onPress: () => void; variant?: ButtonVariant; size?: 'md' | 'sm';
  icon?: FeatherName; style?: StyleProp<ViewStyle>; disabled?: boolean;
}) {
  const fg = variant === 'primary' ? '#fff' : variant === 'danger' ? colors.danger : variant === 'quiet' ? colors.forest : colors.ink;
  return (
    <Pressable
      disabled={disabled}
      onPress={() => { tap(); onPress(); }}
      style={({ pressed }) => [
        styles.button,
        size === 'sm' && styles.buttonSm,
        variant === 'primary' && { backgroundColor: colors.forest },
        variant === 'secondary' && { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.lineStrong },
        pressed && { opacity: 0.82, transform: [{ scale: 0.985 }] },
        disabled && { opacity: 0.4 },
        style,
      ]}>
      {icon ? <Feather name={icon} size={size === 'sm' ? 15 : 18} color={fg} /> : null}
      <Text style={[styles.buttonText, size === 'sm' && { fontSize: 14 }, { color: fg }]}>{title}</Text>
    </Pressable>
  );
}

export function IconButton({ icon, onPress, label, filled }: { icon: ReactNode; onPress: () => void; label: string; filled?: boolean }) {
  return (
    <Pressable
      accessibilityLabel={label}
      onPress={() => { tap(); onPress(); }}
      hitSlop={8}
      style={({ pressed }) => [styles.iconButton, filled && { backgroundColor: 'rgba(255,255,255,0.92)' }, pressed && { opacity: 0.7 }]}>
      {icon}
    </Pressable>
  );
}

export function Chip({ label, selected, onPress }: { label: string; selected?: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={() => { tap(); onPress(); }}
      style={[styles.chip, selected ? { backgroundColor: colors.forest, borderColor: colors.forest } : null]}>
      <Text style={[styles.chipText, selected ? { color: '#fff' } : null]}>{label}</Text>
    </Pressable>
  );
}

/** Text tabs with an underline, used for categories and Buying/Selling. */
export function TextTabs<K extends string>({ items, value, onChange }: { items: readonly K[]; value: K; onChange: (k: K) => void }) {
  return (
    <Row gap={22}>
      {items.map((item) => {
        const active = item === value;
        return (
          <Pressable key={item} onPress={() => { tap(); onChange(item); }} hitSlop={6}>
            <Text style={[styles.tabText, active && { color: colors.ink }]}>{item}</Text>
            <View style={[styles.tabUnderline, active && { backgroundColor: colors.forest }]} />
          </Pressable>
        );
      })}
    </Row>
  );
}

// ─── Domain bits ───────────────────────────────────────────────────────

export function Avatar({ seller, size = 44, ring }: { seller: Pick<Seller, 'name' | 'photo'>; size?: number; ring?: boolean }) {
  return (
    <View style={[{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.forestSoft, overflow: 'hidden' },
      ring && { borderWidth: 2, borderColor: colors.bg }]}>
      <Image source={{ uri: `${photoUrl(seller.photo, size, size)}&crop=faces` }} style={{ width: '100%', height: '100%' }} transition={200} />
    </View>
  );
}

export function Verified({ size = 14 }: { size?: number }) {
  return <MaterialCommunityIcons name="check-decagram" size={size} color={colors.forest} accessibilityLabel="ID verified" />;
}

export function SellerRow({ seller }: { seller: Seller }) {
  return (
    <Row gap={14}>
      <Avatar seller={seller} size={48} />
      <View style={{ flex: 1, gap: 2 }}>
        <Row gap={5}>
          <T variant="strong">{seller.name}</T>
          {seller.verified ? <Verified /> : null}
        </Row>
        <T variant="small">
          {seller.rating.toFixed(1)} rating · {seller.trades} trades · Replies in {seller.replies}
        </T>
        <T variant="small">{seller.neighborhood}{seller.verified ? ' · ID verified' : ''}</T>
      </View>
    </Row>
  );
}

export function LineItem({ label, value, note, bold }: { label: string; value: string; note?: string; bold?: boolean }) {
  return (
    <Row style={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <View style={{ flex: 1 }}>
        <T variant={bold ? 'strong' : 'body'}>{label}</T>
        {note ? <T variant="small">{note}</T> : null}
      </View>
      <T variant={bold ? 'strong' : 'body'} style={{ fontVariant: ['tabular-nums'] }}>{value}</T>
    </Row>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 54, borderRadius: 16, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  buttonSm: { height: 38, borderRadius: 12, paddingHorizontal: 16 },
  buttonText: { fontFamily: fonts.sansSemi, fontSize: 16, letterSpacing: -0.1 },
  iconButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  heart: { backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center' },
  burstDot: { position: 'absolute', width: 5, height: 5, borderRadius: 3, backgroundColor: colors.danger },
  livePill: {
    flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6,
  },
  livePillText: { fontFamily: fonts.sansSemi, fontSize: 12, color: colors.ink },
  chip: {
    height: 38, paddingHorizontal: 15, borderRadius: 999, borderWidth: 1, borderColor: colors.lineStrong,
    backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center',
  },
  chipText: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.ink },
  tabText: { fontFamily: fonts.sansMedium, fontSize: 15, color: colors.faint, paddingBottom: 7 },
  tabUnderline: { height: 2, borderRadius: 1, backgroundColor: 'transparent' },
});
