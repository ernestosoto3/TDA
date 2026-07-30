import { DefaultTheme, type Theme as NavigationTheme } from '@react-navigation/native';

export const colors = {
  background: '#F5F6F8',
  border: '#D9DDE3',
  card: '#FFFFFF',
  primary: '#C8102E',
  text: '#17191C',
  textMuted: '#68707A',
  white: '#FFFFFF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const typography = {
  regular: 'Inter_400Regular',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const navigationTheme: NavigationTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    background: colors.background,
    card: colors.card,
    text: colors.text,
    border: colors.border,
    notification: colors.primary,
  },
};
