import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing, typography } from '../theme/theme';

type ScreenLayoutProps = PropsWithChildren<{
  description: string;
  title: string;
}>;

export function ScreenLayout({ children, description, title }: ScreenLayoutProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.content}>
        <Text accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
        <Text style={styles.description}>{description}</Text>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    color: colors.text,
    fontFamily: typography.bold,
    fontSize: 28,
    letterSpacing: -0.5,
  },
  description: {
    marginTop: spacing.sm,
    color: colors.textMuted,
    fontFamily: typography.regular,
    fontSize: 16,
    lineHeight: 24,
  },
});
