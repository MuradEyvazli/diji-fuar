import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  Dimensions,
  StatusBar
} from 'react-native';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function LiveStreamScreen() {
  // Animation states
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideUpAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.9));
  const [floatingAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Animation sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous floating animation
    const floatingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );
    floatingAnimation.start();

    // Live pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => {
      floatingAnimation.stop();
      pulseAnimation.stop();
    };
  }, []);

  const floatingTranslateY = floatingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const liveStreams = [
    {
      id: 1,
      title: 'Teknoloji Fuarı Ana Sahne',
      presenter: 'Dr. Mehmet Yılmaz',
      viewers: 1247,
      isLive: true,
      topic: 'Dijital Dönüşüm ve Gelecek',
      duration: '2:15:30',
      icon: '🚀',
      category: 'Keynote'
    },
    {
      id: 2,
      title: 'Startup Tanıtım Sunumu',
      presenter: 'İnovaTech Ekibi',
      viewers: 568,
      isLive: true,
      topic: 'AI Destekli Çözümler',
      duration: '45:12',
      icon: '💡',
      category: 'Demo'
    },
    {
      id: 3,
      title: 'Panel: Geleceğin Teknolojileri',
      presenter: 'Uzman Panel',
      viewers: 892,
      isLive: false,
      topic: 'Blockchain ve Web3',
      duration: '1:32:45',
      icon: '🌐',
      category: 'Panel'
    },
    {
      id: 4,
      title: 'AR/VR Workshop',
      presenter: 'MetaVerse Labs',
      viewers: 423,
      isLive: true,
      topic: 'Metaverse Geliştirme',
      duration: '1:05:20',
      icon: '🥽',
      category: 'Workshop'
    }
  ];

  const liveStreamCount = liveStreams.filter(stream => stream.isLive).length;
  const totalViewers = liveStreams.reduce((sum, stream) => sum + stream.viewers, 0);

  const VideoPlayerPlaceholder = ({ stream, featured = false }) => (
    <View style={[styles.videoContainer, featured && styles.featuredVideo]}>
      <View style={styles.videoPlaceholder}>
        <View style={styles.videoIcon}>
          <Text style={styles.videoIconText}>{stream.icon}</Text>
        </View>
        {stream.isLive && (
          <Animated.View style={[styles.liveIndicator, { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>CANLI</Text>
          </Animated.View>
        )}
        <View style={styles.viewersBadge}>
          <Text style={styles.viewersText}>👁️ {stream.viewers.toLocaleString()}</Text>
        </View>
      </View>
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle}>{stream.title}</Text>
        <Text style={styles.videoPresenter}>{stream.presenter}</Text>
        <Text style={styles.videoTopic}>{stream.topic}</Text>
        <View style={styles.videoMeta}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{stream.category}</Text>
          </View>
          <Text style={styles.durationText}>{stream.duration}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f1419" />

      {/* Space Background */}
      <View style={styles.spaceBackground} pointerEvents="none" />

      {/* Floating Stars */}
      <View style={styles.starsContainer} pointerEvents="none">
        {[...Array(30)].map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.star,
              {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: fadeAnim,
                transform: [{ translateY: floatingTranslateY }],
              },
            ]}
            pointerEvents="none"
          />
        ))}
      </View>

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideUpAnim }],
          }
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>📺 Canlı Yayın</Text>
        <View style={styles.placeholder} />
      </Animated.View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Hero Stats Section */}
        <Animated.View
          style={[
            styles.heroSection,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideUpAnim },
                { scale: scaleAnim },
                { translateY: floatingTranslateY }
              ],
            }
          ]}
        >
          <View style={styles.heroLogo}>
            <Text style={styles.heroIcon}>📡</Text>
            <View style={styles.heroGlow} pointerEvents="none" />
          </View>
          <Text style={styles.heroTitle}>Canlı Yayın Merkezi</Text>
          <Text style={styles.heroSubtitle}>
            {liveStreamCount} canlı yayın • {totalViewers.toLocaleString()} izleyici
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Animated.View style={[styles.statIcon, { transform: [{ scale: pulseAnim }] }]}>
                <Text style={styles.statIconText}>🔴</Text>
              </Animated.View>
              <Text style={styles.statNumber}>{liveStreamCount}</Text>
              <Text style={styles.statLabel}>Canlı</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIconText}>👥</Text>
              <Text style={styles.statNumber}>{totalViewers.toLocaleString()}</Text>
              <Text style={styles.statLabel}>İzleyici</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIconText}>📹</Text>
              <Text style={styles.statNumber}>{liveStreams.length - liveStreamCount}</Text>
              <Text style={styles.statLabel}>Kayıt</Text>
            </View>
          </View>
        </Animated.View>

        {/* Featured Live Stream */}
        <Animated.View
          style={[
            styles.featuredSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🌟 Öne Çıkan Yayın</Text>
            <Text style={styles.sectionSubtitle}>Ana sahne canlı yayını</Text>
          </View>

          <TouchableOpacity
            style={styles.featuredCard}
            activeOpacity={0.8}
          >
            <View style={styles.featuredGlow} pointerEvents="none" />
            <VideoPlayerPlaceholder stream={liveStreams[0]} featured={true} />
          </TouchableOpacity>
        </Animated.View>

        {/* Live Streams Section */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔴 Canlı Yayınlar</Text>
            <Text style={styles.sectionSubtitle}>Şu anda yayında</Text>
          </View>

          <View style={styles.streamsGrid}>
            {liveStreams.filter(stream => stream.isLive).slice(1).map((stream, index) => (
              <Animated.View
                key={stream.id}
                style={[
                  styles.streamCardWrapper,
                  {
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateY: slideUpAnim.interpolate({
                          inputRange: [0, 50],
                          outputRange: [0, 50 + index * 10],
                        })
                      }
                    ],
                  }
                ]}
              >
                <TouchableOpacity
                  style={styles.streamCard}
                  activeOpacity={0.8}
                >
                  <View style={styles.streamGlow} pointerEvents="none" />
                  <VideoPlayerPlaceholder stream={stream} />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Recorded Streams Section */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📚 Kayıtlı Yayınlar</Text>
            <Text style={styles.sectionSubtitle}>Geçmiş sunumları izleyin</Text>
          </View>

          <View style={styles.streamsGrid}>
            {liveStreams.filter(stream => !stream.isLive).map((stream, index) => (
              <Animated.View
                key={stream.id}
                style={[
                  styles.streamCardWrapper,
                  {
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateY: slideUpAnim.interpolate({
                          inputRange: [0, 50],
                          outputRange: [0, 50 + index * 10],
                        })
                      }
                    ],
                  }
                ]}
              >
                <TouchableOpacity
                  style={styles.streamCard}
                  activeOpacity={0.8}
                >
                  <View style={styles.streamGlow} pointerEvents="none" />
                  <VideoPlayerPlaceholder stream={stream} />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Networking Section */}
        <Animated.View
          style={[
            styles.networkingSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            }
          ]}
        >
          <View style={styles.networkingHeader}>
            <Text style={styles.networkingTitle}>🤝 Networking Modülü</Text>
            <Text style={styles.networkingSubtitle}>Yayınlarda tanıştığınız kişilerle bağlantı kurun</Text>
          </View>

          <TouchableOpacity
            style={styles.networkingButton}
            onPress={() => router.push('/networking')}
            activeOpacity={0.8}
          >
            <View style={styles.networkingGlow} pointerEvents="none" />
            <View style={styles.networkingIconContainer}>
              <Text style={styles.networkingIcon}>🌐</Text>
            </View>
            <Text style={styles.networkingButtonText}>Networking Başlat</Text>
            <Text style={styles.networkingButtonSubtext}>Profesyonel bağlantılar kurun →</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1419',
  },
  spaceBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0f1419',
  },
  starsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  star: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: '#64ffda',
    borderRadius: 1,
    shadowColor: '#64ffda',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    zIndex: 2,
    backgroundColor: 'rgba(15, 20, 25, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(100, 255, 218, 0.2)',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
  },
  backButtonText: {
    fontSize: 16,
    color: '#64ffda',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(100, 255, 218, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  placeholder: {
    width: 50,
  },
  content: {
    flex: 1,
    zIndex: 2,
  },
  heroSection: {
    alignItems: 'center',
    padding: 30,
    marginBottom: 20,
  },
  heroLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 2,
    borderColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  heroIcon: {
    fontSize: 32,
    textAlign: 'center',
  },
  heroGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 107, 107, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 25,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  statCard: {
    backgroundColor: 'rgba(31, 41, 55, 0.4)',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.2)',
    minWidth: 70,
  },
  statIcon: {
    marginBottom: 5,
  },
  statIconText: {
    fontSize: 24,
    marginBottom: 5,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  featuredSection: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  sectionHeader: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
    textShadowColor: 'rgba(255, 107, 107, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  featuredCard: {
    backgroundColor: 'rgba(31, 41, 55, 0.4)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.2)',
    position: 'relative',
    overflow: 'hidden',
  },
  featuredGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    backgroundColor: 'transparent',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.1)',
    zIndex: -1,
  },
  streamsGrid: {
    gap: 15,
  },
  streamCardWrapper: {
    width: '100%',
  },
  streamCard: {
    backgroundColor: 'rgba(31, 41, 55, 0.4)',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.2)',
    position: 'relative',
    overflow: 'hidden',
  },
  streamGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    backgroundColor: 'transparent',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.1)',
    zIndex: -1,
  },
  videoContainer: {
    width: '100%',
  },
  featuredVideo: {
    marginBottom: 10,
  },
  videoPlaceholder: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 12,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.3)',
    marginBottom: 15,
  },
  videoIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(100, 255, 218, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoIconText: {
    fontSize: 28,
  },
  liveIndicator: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
    marginRight: 4,
  },
  liveText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  viewersBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  viewersText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  videoInfo: {
    gap: 6,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  videoPresenter: {
    fontSize: 14,
    color: '#64ffda',
    fontWeight: '600',
  },
  videoTopic: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 8,
  },
  videoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    backgroundColor: 'rgba(100, 255, 218, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    color: '#64ffda',
    fontSize: 10,
    fontWeight: '600',
  },
  durationText: {
    fontSize: 11,
    color: '#94a3b8',
  },
  networkingSection: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  networkingHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  networkingTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
    textAlign: 'center',
    textShadowColor: 'rgba(78, 205, 196, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  networkingSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  networkingButton: {
    backgroundColor: 'rgba(31, 41, 55, 0.4)',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.2)',
    position: 'relative',
    overflow: 'hidden',
  },
  networkingGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    backgroundColor: 'transparent',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.1)',
    zIndex: -1,
  },
  networkingIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderWidth: 2,
    borderColor: '#4ecdc4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  networkingIcon: {
    fontSize: 30,
  },
  networkingButtonText: {
    color: '#4ecdc4',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  networkingButtonSubtext: {
    color: '#94a3b8',
    fontSize: 14,
  },
  bottomPadding: {
    height: 30,
  },
});