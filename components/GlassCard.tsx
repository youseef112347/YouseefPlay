import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '../constants/Colors';

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  borderRadius?: number;
}

export default function GlassCard({
  children,
  style,
  intensity = 45,
  borderRadius = 24,
}: GlassCardProps) {
  return (
    <View style={[styles.container, { borderRadius }, style]}>
      <BlurView
        intensity={intensity}
        tint="dark"
        style={StyleSheet.absoluteFill}
      />
      <View
        style={[
          styles.border,
          { borderRadius, borderColor: Colors.glassBorder },
        ]}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: Colors.surface,
  },
  border: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1,
  },
  content: {
    zIndex: 1,
  },
});
