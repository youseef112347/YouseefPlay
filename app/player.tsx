import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import GlassCard from '../components/GlassCard';
import { Colors } from '../constants/Colors';

const { width } = Dimensions.get('window');

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function PlayerScreen() {
  const params = useLocalSearchParams<{
    id: string;
    uri: string;
    title: string;
    artist: string;
    duration: string;
  }>();
  const router = useRouter();
  const {
    playSong,
    togglePlayPause,
    seekTo,
    isPlaying,
    position,
    duration,
    currentSong,
    isLoading,
  } = useAudioPlayer();

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (params.uri && params.id) {
      playSong({
        id: params.id,
        uri: params.uri,
        filename: params.title || 'Unknown',
        title: params.title || 'Unknown Title',
        artist: params.artist || 'Unknown Artist',
        duration: Number(params.duration) || 0,
      });
    }
  }, [params.id]);

  useEffect(() => {
    if (duration > 0) {
      setProgress(position / duration);
    }
  }, [position, duration]);

  const handleSeek = (value: number) => {
    const newPosition = value * duration;
    seekTo(newPosition);
  };

  return (
    <LinearGradient
      colors={['#2E1065', '#1A0A2E', '#0F0F0F']}
      style={styles.container}
    >
      {/* Close Button */}
      <TouchableOpacity
        style={styles.closeBtn}
        onPress={() => router.back()}
      >
        <Text style={styles.closeText}>✕</Text>
      </TouchableOpacity>

      {/* Album Art */}
      <View style={styles.artContainer}>
        <GlassCard style={styles.artCard} intensity={60} borderRadius={32}>
          <View style={styles.artInner}>
            <Text style={styles.artEmoji}>🎧</Text>
          </View>
        </GlassCard>
      </View>

      {/* Song Info */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {currentSong?.title || params.title || 'Unknown Title'}
        </Text>
        <Text style={styles.artist}>
          {currentSong?.artist || params.artist || 'Unknown Artist'}
        </Text>
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
          />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.time}>{formatTime(position)}</Text>
          <Text style={styles.time}>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.sideBtn}>
          <Text style={styles.sideIcon}>⏮</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playBtn}
          onPress={togglePlayPause}
          disabled={isLoading}
        >
          <GlassCard
            style={styles.playBtnInner}
            intensity={50}
            borderRadius={50}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="large" />
            ) : (
              <Text style={styles.playIcon}>
                {isPlaying ? '⏸' : '▶'}
              </Text>
            )}
          </GlassCard>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sideBtn}>
          <Text style={styles.sideIcon}>⏭</Text>
        </TouchableOpacity>
      </View>

      {/* Extra Controls */}
      <View style={styles.extra}>
        <TouchableOpacity>
          <Text style={styles.extraIcon}>🔁</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.extraIcon}>🔀</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.extraIcon}>💜</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 50,
    right: 24,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  artContainer: {
    marginTop: 40,
    marginBottom: 30,
  },
  artCard: {
    width: width * 0.7,
    height: width * 0.7,
  },
  artInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
  },
  artEmoji: {
    fontSize: 80,
  },
  info: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  title: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  artist: {
    color: Colors.textSecondary,
    fontSize: 15,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 30,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  time: {
    color: Colors.textMuted,
    fontSize: 12,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
    marginBottom: 40,
  },
  sideBtn: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sideIcon: {
    fontSize: 28,
    color: Colors.text,
  },
  playBtn: {
    width: 80,
    height: 80,
  },
  playBtnInner: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(124, 58, 237, 0.35)',
  },
  playIcon: {
    fontSize: 32,
    color: '#fff',
  },
  extra: {
    flexDirection: 'row',
    gap: 50,
  },
  extraIcon: {
    fontSize: 24,
    opacity: 0.8,
  },
});
