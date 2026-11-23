import { StyleSheet } from 'react-native';

export const colors = {
  bg: '#F7F5F0',
  surface: '#FFFFFF',
  ink: '#1B1E1B',
  muted: '#6E726C',
  faint: '#A3A69F',
  line: '#E6E2DA',
  lineStrong: '#D3CEC4',
  forest: '#1F4D3A',
  forestSoft: '#E4ECE6',
  danger: '#A33B2B',
  amber: '#9A6B1F',
};

export const fonts = {
  serif: 'Newsreader_500Medium',
  serifItalic: 'Newsreader_400Regular_Italic',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemi: 'Inter_600SemiBold',
};

/** Seamless "studio backdrop" colors for placeholder product shots: [background, object]. */
export const backdrops = {
  sage: ['#DDE4D7', '#5E7257'],
  sand: ['#EEE5D5', '#8A7354'],
  clay: ['#EAD8CC', '#8E5D45'],
  stone: ['#E3E1DC', '#6B6A65'],
  mist: ['#DAE3E7', '#4F6873'],
  blush: ['#F0DFDC', '#94595A'],
  butter: ['#F2EACB', '#8A7A3A'],
} as const;

export type Backdrop = keyof typeof backdrops;

export const space = { gutter: 20 };

export const hairline = StyleSheet.hairlineWidth;
