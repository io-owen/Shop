import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import type { ComponentProps, ReactNode } from 'react';
import {
  Platform, Pressable, StyleSheet, Text, View,
  type StyleProp, type TextProps, type ViewStyle,
} from 'react-native';

import type { IconName, Seller } from '@/data/types';
import { backdrops, colors, fonts, hairline, type Backdrop } from '@/theme';

export type FeatherName = ComponentProps<typeof Feather>['name'];

export function tap() {
  if (Platform.OS !== 'web') Haptics.selectionAsync();
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

// ─── Product image placeholder ────────────────────────────────────────

/** A product on a seamless studio backdrop. Stands in for real photos. */
export function ItemImage({
  icon, backdrop, iconSize = 56, radius = 18, style,
}: { icon: IconName; backdrop: Backdrop; iconSize?: number; radius?: number; style?: StyleProp<ViewStyle> }) {
  const [bg, fg] = backdrops[backdrop];
  return (
    <View style={[{ backgroundColor: bg, borderRadius: radius, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }, style]}>
      <MaterialCommunityIcons name={icon} size={iconSize} color={fg} />
      <View style={{ width: iconSize * 0.8, height: Math.max(3, iconSize * 0.07), borderRadius: 99, backgroundColor: fg, opacity: 0.12, marginTop: iconSize * 0.04 }} />
    </View>
  );
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

export function Avatar({ name, size = 44 }: { name: string; size?: number }) {
  const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('');
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.forestSoft, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontFamily: fonts.serif, fontSize: size * 0.4, color: colors.forest }}>{initials}</Text>
    </View>
  );
}

export function Verified({ size = 14 }: { size?: number }) {
  return <MaterialCommunityIcons name="check-decagram" size={size} color={colors.forest} accessibilityLabel="ID verified" />;
}

export function SellerRow({ seller }: { seller: Seller }) {
  return (
    <Row gap={14}>
      <Avatar name={seller.name} />
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
  chip: {
    height: 38, paddingHorizontal: 15, borderRadius: 999, borderWidth: 1, borderColor: colors.lineStrong,
    backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center',
  },
  chipText: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.ink },
  tabText: { fontFamily: fonts.sansMedium, fontSize: 15, color: colors.faint, paddingBottom: 7 },
  tabUnderline: { height: 2, borderRadius: 1, backgroundColor: 'transparent' },
});
