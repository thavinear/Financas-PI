import { PropsWithChildren } from 'react';
import { Pressable, StyleProp, StyleSheet, Text, TextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';
import { useFinzyTheme } from '@/hooks/useFinzyTheme';
import { KpiTone } from '@/types';

export const toneColor = (tone: KpiTone, colors: ReturnType<typeof useFinzyTheme>['colors']) => {
  const map = {
    green: colors.green,
    blue: colors.blue,
    red: colors.red,
    amber: colors.amber,
    accent: colors.accent,
  };
  return map[tone];
};

export const toneBackground = (tone: KpiTone, colors: ReturnType<typeof useFinzyTheme>['colors']) => {
  const map = {
    green: colors.greenD,
    blue: colors.blueD,
    red: colors.redD,
    amber: colors.amberD,
    accent: colors.accentD,
  };
  return map[tone];
};

export function FinzyText({
  children,
  style,
  variant = 'body',
}: PropsWithChildren<{ style?: StyleProp<TextStyle>; variant?: 'logo' | 'title' | 'section' | 'body' | 'small' | 'label' }>) {
  const { colors } = useFinzyTheme();
  return <Text style={[{ color: colors.text }, textStyles[variant], style]}>{children}</Text>;
}

export function Card({
  children,
  style,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  const { colors } = useFinzyTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: '#000',
        },
        style,
      ]}>
      {children}
    </View>
  );
}

export function PrimaryButton({
  children,
  onPress,
  variant = 'primary',
  style,
}: PropsWithChildren<{ onPress: () => void; variant?: 'primary' | 'secondary' | 'ghost'; style?: StyleProp<ViewStyle> }>) {
  const { colors } = useFinzyTheme();
  const buttonStyle =
    variant === 'primary'
      ? { backgroundColor: colors.accent, borderColor: colors.accent }
      : variant === 'ghost'
        ? { backgroundColor: 'transparent', borderColor: 'transparent' }
        : { backgroundColor: colors.surface2, borderColor: colors.border };

  return (
    <Pressable onPress={onPress} style={[styles.button, buttonStyle, style]}>
      <FinzyText style={[styles.buttonText, variant === 'primary' && { color: '#fff' }]}>{children}</FinzyText>
    </Pressable>
  );
}

export function ProgressBar({ pct, color }: { pct: number; color: string }) {
  const { colors } = useFinzyTheme();
  return (
    <View style={[styles.track, { backgroundColor: colors.surface2 }]}>
      <View style={[styles.fill, { width: `${Math.max(0, Math.min(pct, 100))}%`, backgroundColor: color }]} />
    </View>
  );
}

export function TextField({
  label,
  error,
  style,
  ...inputProps
}: TextInputProps & { label?: string; error?: string; style?: StyleProp<ViewStyle> }) {
  const { colors } = useFinzyTheme();
  return (
    <View style={[styles.fieldWrap, style]}>
      {label && (
        <FinzyText variant="label" style={{ color: colors.muted, marginBottom: 6 }}>
          {label}
        </FinzyText>
      )}
      <TextInput
        placeholderTextColor={colors.muted}
        style={[
          styles.input,
          { backgroundColor: colors.surface2, borderColor: error ? colors.red : colors.border, color: colors.text },
        ]}
        {...inputProps}
      />
      {error && (
        <FinzyText variant="small" style={{ color: colors.red, marginTop: 4 }}>
          {error}
        </FinzyText>
      )}
    </View>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  const { colors } = useFinzyTheme();
  return (
    <View style={[styles.segmented, { backgroundColor: colors.surface2, borderColor: colors.border }]}>
      {options.map((option) => (
        <Pressable
          key={option.value}
          onPress={() => onChange(option.value)}
          style={[styles.segmentItem, value === option.value && { backgroundColor: colors.accent }]}>
          <FinzyText style={{ color: value === option.value ? '#fff' : colors.muted, fontWeight: '700' }}>{option.label}</FinzyText>
        </Pressable>
      ))}
    </View>
  );
}

export function Skeleton({ width = '100%', height = 16, style }: { width?: number | string; height?: number; style?: StyleProp<ViewStyle> }) {
  const { colors } = useFinzyTheme();
  return (
    <View style={[{ width: width as any, height, backgroundColor: colors.surface2, borderRadius: 4, overflow: 'hidden' }, style]}>
      <View style={{ width: '100%', height: '100%', backgroundColor: colors.border, opacity: 0.3 }} />
    </View>
  );
}

export function LoadingSpinner({ size = 24 }: { size?: number }) {
  const { colors } = useFinzyTheme();
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <View style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 2, borderColor: colors.accent, borderTopColor: 'transparent' }} />
    </View>
  );
}

const textStyles = StyleSheet.create({
  logo: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0,
  },
  section: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0,
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
  },
  small: {
    fontSize: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0,
  },
});

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 22,
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
    elevation: 2,
  },
  button: {
    minHeight: 42,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  track: {
    height: 6,
    borderRadius: 99,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 99,
  },
  fieldWrap: {
    gap: 0,
  },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  segmented: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    padding: 3,
    gap: 3,
  },
  segmentItem: {
    flex: 1,
    minHeight: 40,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
