import { useState, useEffect, useCallback } from 'react';
import * as MediaLibrary from 'expo-media-library';

export interface Song {
  id: string;
  uri: string;
  filename: string;
  duration: number;
  title: string;
  artist: string;
}

export function useMusicLibrary() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [permission, setPermission] =
    useState<MediaLibrary.PermissionStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const loadSongs = useCallback(async () => {
    try {
      setLoading(true);
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setPermission(status);

      if (status !== 'granted') {
        setLoading(false);
        return;
      }

      const media = await MediaLibrary.getAssetsAsync({
        mediaType: MediaLibrary.MediaType.audio,
        first: 1000,
        sortBy: [MediaLibrary.SortBy.creationTime],
      });

      const formatted: Song[] = media.assets.map((asset) => {
        const name = asset.filename.replace(/\.[^/.]+$/, '');
        return {
          id: asset.id,
          uri: asset.uri,
          filename: asset.filename,
          duration: asset.duration * 1000,
          title: name || 'Unknown Title',
          artist: 'Unknown Artist',
        };
      });

      setSongs(formatted);
    } catch (error) {
      console.error('Error loading songs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSongs();
  }, [loadSongs]);

  return { songs, permission, loading, reload: loadSongs };
}
