import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';

interface VideoPlayerProps {
  title: string;
  isLive?: boolean;
  viewers?: number;
  duration?: string;
}

export function VideoPlayer({ title, isLive = false, viewers, duration }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const screenWidth = Dimensions.get('window').width;
  const playerHeight = screenWidth * 0.56; // 16:9 aspect ratio

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <View style={styles.container}>
      {/* Video Area */}
      <View style={[styles.videoArea, { height: playerHeight }]}>
        {/* Live Indicator */}
        {isLive && (
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>CANLI</Text>
          </View>
        )}

        {/* Viewer Count */}
        {viewers && (
          <View style={styles.viewerCount}>
            <Text style={styles.viewerText}>👥 {viewers}</Text>
          </View>
        )}

        {/* Play Button Overlay */}
        <TouchableOpacity
          style={styles.playOverlay}
          onPress={handlePlayPause}
        >
          <View style={styles.playButton}>
            <Text style={styles.playIcon}>
              {isPlaying ? '⏸️' : '▶️'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Video Background */}
        <View style={styles.videoBackground}>
          <Text style={styles.videoPlaceholder}>
            {isPlaying ? '🎬 Video Oynatılıyor...' : '📺 Video Hazır'}
          </Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: isPlaying ? '30%' : '0%' }]} />
          </View>
          {!isLive && duration && (
            <Text style={styles.durationText}>{duration}</Text>
          )}
        </View>

        {/* Control Buttons */}
        <View style={styles.controlButtons}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={handlePlayPause}
          >
            <Text style={styles.controlIcon}>
              {isPlaying ? '⏸️' : '▶️'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.controlButton}>
            <Text style={styles.controlIcon}>🔊</Text>
          </TouchableOpacity>

          <View style={styles.spacer} />

          <TouchableOpacity style={styles.controlButton}>
            <Text style={styles.controlIcon}>⚙️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleFullscreen}
          >
            <Text style={styles.controlIcon}>
              {isFullscreen ? '🔲' : '⛶'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Video Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.videoTitle}>{title}</Text>
        {isLive && (
          <View style={styles.liveChip}>
            <Text style={styles.liveChipText}>Canlı Yayın</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  videoArea: {
    position: 'relative',
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveIndicator: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 2,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    marginRight: 6,
  },
  liveText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  viewerCount: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 2,
  },
  viewerText: {
    color: '#ffffff',
    fontSize: 12,
  },
  playOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(52, 152, 219, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 24,
    color: '#ffffff',
  },
  videoBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
  videoPlaceholder: {
    color: '#bdc3c7',
    fontSize: 16,
    fontWeight: '500',
  },
  controls: {
    backgroundColor: '#000000',
    padding: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#34495e',
    borderRadius: 2,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3498db',
    borderRadius: 2,
  },
  durationText: {
    color: '#ffffff',
    fontSize: 12,
    minWidth: 40,
  },
  controlButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    padding: 8,
    marginRight: 8,
  },
  controlIcon: {
    fontSize: 18,
    color: '#ffffff',
  },
  spacer: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#000000',
  },
  videoTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  liveChip: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 12,
  },
  liveChipText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});