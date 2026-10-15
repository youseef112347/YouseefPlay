import React, { useState, useMemo } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMusicLibrary } from '../../hooks/useMusicLibrary';
import GlassCard from '../../components/GlassCard';
import { Colors } from '../../constants/Colors';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { songs, permission, loading } = useMusicLibrary();
  const [search, setSearch] = useState('');
  const router = useRouter();

  const filteredSongs = useMemo(() => {
    if (!search.trim()) return songs;
    const q = search.toLowerCase();
    return songs.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.filename.toLowerCase().includes(q)
    );
  }, [songs, search]);

  if (loading) {
    return (
      <LinearGradient
        colors={[Colors.backgroundSecondary, Colors.background]}
        style={styles.center}
      >
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>جاري تحميل الأغاني...</Text>
      </LinearGradient>
    );
  }

  if (permission !== 'granted') {
    return (
      <LinearGradient
        colors={[Colors.backgroundSecondary, Colors.background]}
        style={styles.center}
      >
        <Text style={styles.permissionEmoji}>🔒</Text>
        <Text style={styles.permissionTitle}>مطلوب إذن الوصول</Text>
        <Text style={styles.permissionText}>
          يرجى السماح للتطبيق بالوصول إلى ملفات الصوت المخزنة على هاتفك
        </Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[Colors.backgroundSecondary, Colors.background]}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>YOUSEEF PLAY</Text>
        <Text style={styles.subtitle}>
          {songs.length} أغنية متاحة
        </Text>
      </View>

      {/* Search */}
      <GlassCard style={styles.searchBox} intensity={50}>
        <TextInput
          placeholder="ابحث عن أغنية..."
          placeholderTextColor={Colors.textMuted}
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          textAlign="right"
        />
      </GlassCard>

      {/* Songs List */}
      <FlatList
        data={filteredSongs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🎵</Text>
            <Text style={styles.emptyText}>لا توجد أغاني</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() =>
              router.push({
                pathname: '/player',
                params: {
                  id: item.id,
                  uri: item.uri,
                  title: item.title,
                  artist: item.artist,
                  duration: String(item.duration),
                },
              })
            }
          >
            <GlassCard style={styles.songCard} intensity={35}>
              <View style={styles.songRow}>
                <View style={styles.cover}>
                  <Text style={styles.coverEmoji}>🎵</Text>
                </View>
                <View style={styles.songInfo}>
                  <Text style={styles.songTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.songArtist} numberOfLines={1}>
                    {item.artist}
                  </Text>
                </View>
                <Text style={styles.playIcon}>▶</Text>
              </View>
            </GlassCard>
          </TouchableOpacity>
        )}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 55,
    paddingHorizontal: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  searchBox: {
    marginBottom: 18,
    paddingHorizontal: 16,
  },
  searchInput: {
    color: Colors.text,
    fontSize: 16,
    height: 50,
  },
  list: {
    paddingBottom: 100,
  },
  songCard: {
    marginBottom: 10,
    padding: 12,
  },
  songRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cover: {
    width: 54,
    height: 54,
    borderRadius: 16,
    backgroundColor: 'rgba(124, 58, 237, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  coverEmoji: {
    fontSize: 22,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'right',
  },
  songArtist: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 3,
    textAlign: 'right',
  },
  playIcon: {
    color: Colors.primary,
    fontSize: 16,
    marginLeft: 10,
  },
  loadingText: {
    color: Colors.textSecondary,
    marginTop: 16,
    fontSize: 16,
  },
  permissionEmoji: {
    fontSize: 50,
    marginBottom: 16,
  },
  permissionTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
  },
  permissionText: {
    color: Colors.textSecondary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 24,
  },
  empty: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyEmoji: {
    fontSize: 50,
    marginBottom: 12,
  },
  emptyText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
});
