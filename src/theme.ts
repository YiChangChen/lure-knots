import { Platform, useColorScheme } from 'react-native';

export type Theme = typeof light;

const light = {
  dark: false,
  bg: '#EBF0EE',
  surface: '#F7FAF9',
  panel: '#FFFFFF',
  panel2: '#E1E9E6',
  ink: '#14232A',
  ink2: '#3D5058',
  ink3: '#6E8288',
  rule: '#CFDAD7',
  main: '#1A6C8A',
  tag: '#DB561B',
  leader: '#7655C2',
  metal: '#5B6A70',
  lure: '#E4B23E',
  accent: '#C14C17',
  accentInk: '#FFFFFF',
  good: '#2F7D4F',
};

const dark: Theme = {
  dark: true,
  bg: '#0C1417',
  surface: '#121D21',
  panel: '#16242A',
  panel2: '#1F3239',
  ink: '#E3ECEA',
  ink2: '#B0C0BF',
  ink3: '#7D9295',
  rule: '#263A41',
  main: '#55B8DA',
  tag: '#FF8749',
  leader: '#B096F4',
  metal: '#9AABB0',
  lure: '#E2B54A',
  accent: '#FF8749',
  accentInk: '#1B0D05',
  good: '#6CCB91',
};

export function useTheme(): Theme {
  return useColorScheme() === 'dark' ? dark : light;
}

export const mono = Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' });
