import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';
import GlassCard from '../../components/GlassCard';

export default function FavoritesScreen() {
  return (
    <LinearGradient
      colors={[Colors.backgroundSecondary, Colors.background]}
      style={styles.container}
    >
      <Text style={styles.title}>المفضلة</Text>

      <GlassCard style={styles.card} intensity={40}>
        <Text style={styles.emoji}>💜</Text>
        <Text style={styles.message}>
          قائمة المفضلة قيد التطوير
        </Text>
        <Text style={styles.sub}>
          قريبًا هتقدر تضيف أغانيك المفضلة هنا
        </Text>
      </GlassCard>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 40,
  },
  card: {
    width: '100%',
    paddingVertical: 50,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  message: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sub: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
});
