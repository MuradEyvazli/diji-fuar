import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Animated,
  Dimensions,
  StatusBar
} from 'react-native';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function NavigationScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  // Animation states
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideUpAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.9));
  const [floatingAnim] = useState(new Animated.Value(0));
  const [radarAnim] = useState(new Animated.Value(0));

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

    // Radar sweep animation
    const radarAnimation = Animated.loop(
      Animated.timing(radarAnim, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: true,
      })
    );
    radarAnimation.start();

    return () => {
      floatingAnimation.stop();
      radarAnimation.stop();
    };
  }, []);

  const floatingTranslateY = floatingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const radarRotation = radarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const stands = [
    { id: 'A1', company: 'TechCorp', category: 'Yazılım Geliştirme', floor: 1, icon: '💻', distance: '15m' },
    { id: 'A2', company: 'İnovaLab', category: 'AR/VR Teknolojileri', floor: 1, icon: '🥽', distance: '25m' },
    { id: 'B3', company: 'DataSoft', category: 'Veri Analizi', floor: 1, icon: '📊', distance: '40m' },
    { id: 'B4', company: 'AI Solutions', category: 'Yapay Zeka', floor: 1, icon: '🧠', distance: '60m' },
    { id: 'C1', company: 'RoboTech', category: 'Robotik Sistemler', floor: 2, icon: '🤖', distance: '80m' },
    { id: 'C2', company: 'CloudTech', category: 'Bulut Teknolojileri', floor: 2, icon: '☁️', distance: '95m' },
  ];

  const filteredStands = stands.filter(stand =>
    stand.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stand.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stand.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f1419" />

      {/* Space Background */}
      <View style={styles.spaceBackground} pointerEvents="none" />

      {/* Floating Stars */}
      <View style={styles.starsContainer} pointerEvents="none">
        {[...Array(20)].map((_, index) => (
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
        <Text style={styles.title}>🧭 AR Navigasyon</Text>
        <View style={styles.placeholder} />
      </Animated.View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Hero Section */}
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
            <Animated.View style={[styles.radarRing, { transform: [{ rotate: radarRotation }] }]}>
              <Text style={styles.heroIcon}>🛰️</Text>
            </Animated.View>
            <View style={styles.heroGlow} pointerEvents="none" />
          </View>
          <Text style={styles.heroTitle}>AR Navigasyon Sistemi</Text>
          <Text style={styles.heroSubtitle}>
            Gerçek zamanlı yön tarifi ve artırılmış gerçeklik rehberi
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statIconText}>🏢</Text>
              <Text style={styles.statNumber}>{stands.length}</Text>
              <Text style={styles.statLabel}>Stand</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIconText}>📍</Text>
              <Text style={styles.statNumber}>2</Text>
              <Text style={styles.statLabel}>Kat</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIconText}>🎯</Text>
              <Text style={styles.statNumber}>AR</Text>
              <Text style={styles.statLabel}>Aktif</Text>
            </View>
          </View>
        </Animated.View>

        {/* Search Section */}
        <Animated.View
          style={[
            styles.searchSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            }
          ]}
        >
          <View style={styles.searchContainer}>
            <View style={styles.searchGlow} pointerEvents="none" />
            <TextInput
              style={styles.searchInput}
              placeholder="Stand ara (şirket, kategori, kod)..."
              placeholderTextColor="#64748b"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </Animated.View>

        {/* Quick Navigation */}
        <Animated.View
          style={[
            styles.quickNavSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⚡ Hızlı Erişim</Text>
            <Text style={styles.sectionSubtitle}>Popüler konumlar</Text>
          </View>

          <View style={styles.quickNavGrid}>
            {[
              { icon: '🏢', text: '1. Kat', subtitle: 'Ana Salon', color: '#64ffda' },
              { icon: '🏗️', text: '2. Kat', subtitle: 'Teknoloji', color: '#ff6b6b' },
              { icon: '🍽️', text: 'Yemek', subtitle: 'Kafeterya', color: '#4ecdc4' },
              { icon: '🚻', text: 'WC', subtitle: 'Tuvalet', color: '#ffd93d' }
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.quickNavCard, { borderColor: item.color + '40' }]}
                activeOpacity={0.8}
              >
                <View style={styles.quickNavGlow} pointerEvents="none" />
                <View style={[styles.quickNavIconContainer, { backgroundColor: item.color + '20', borderColor: item.color }]}>
                  <Text style={styles.quickNavIcon}>{item.icon}</Text>
                </View>
                <Text style={styles.quickNavText}>{item.text}</Text>
                <Text style={styles.quickNavSubtext}>{item.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Stands List */}
        <Animated.View
          style={[
            styles.standsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🏪 Standlar</Text>
            <Text style={styles.sectionSubtitle}>{filteredStands.length} sonuç bulundu</Text>
          </View>

          {filteredStands.map((stand, index) => (
            <Animated.View
              key={stand.id}
              style={[
                styles.standCardWrapper,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: slideUpAnim.interpolate({
                        inputRange: [0, 50],
                        outputRange: [0, 50 + index * 5],
                      })
                    }
                  ],
                }
              ]}
            >
              <TouchableOpacity style={styles.standCard} activeOpacity={0.8}>
                <View style={styles.standGlow} pointerEvents="none" />

                <View style={styles.standHeader}>
                  <View style={styles.standIdContainer}>
                    <Text style={styles.standIdText}>{stand.id}</Text>
                  </View>
                  <View style={styles.standMeta}>
                    <Text style={styles.standIcon}>{stand.icon}</Text>
                    <View style={styles.distanceBadge}>
                      <Text style={styles.distanceText}>{stand.distance}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.standInfo}>
                  <Text style={styles.companyName}>{stand.company}</Text>
                  <Text style={styles.category}>{stand.category}</Text>
                  <Text style={styles.floorInfo}>{stand.floor}. Kat</Text>
                </View>

                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.navigateButton}>
                    <Text style={styles.navigateButtonText}>🧭 Yol Tarifi</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.arButton}
                    onPress={() => router.push(`/ar-view?standId=${stand.id}&standName=${encodeURIComponent(stand.company)}`)}
                  >
                    <Text style={styles.arButtonText}>🎯 AR Görünüm</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}

          {filteredStands.length === 0 && searchQuery && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>Sonuç bulunamadı</Text>
              <Text style={styles.emptyDescription}>
                "{searchQuery}" için eşleşen stand bulunamadı
              </Text>
            </View>
          )}
        </Animated.View>

        {/* AR Features */}
        <Animated.View
          style={[
            styles.arFeaturesSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🎯 AR Özellikler</Text>
            <Text style={styles.sectionSubtitle}>Artırılmış gerçeklik araçları</Text>
          </View>

          <View style={styles.arFeaturesGrid}>
            {[
              { icon: '📱', title: 'QR Tara', desc: 'Stand QR kodunu tara', color: '#64ffda' },
              { icon: '🧭', title: 'AR Navigasyon', desc: 'Gerçek zamanlı rehber', color: '#ff6b6b' },
              { icon: '📋', title: 'Ürün Bilgisi', desc: 'Detaylı stand bilgileri', color: '#4ecdc4' },
              { icon: '🎮', title: '3D Model', desc: 'İnteraktif görünüm', color: '#ffd93d' }
            ].map((feature, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.arFeatureCard, { borderColor: feature.color + '40' }]}
                activeOpacity={0.8}
              >
                <View style={styles.arFeatureGlow} pointerEvents="none" />
                <View style={[styles.arFeatureIconContainer, { backgroundColor: feature.color + '20', borderColor: feature.color }]}>
                  <Text style={styles.arFeatureIcon}>{feature.icon}</Text>
                </View>
                <Text style={styles.arFeatureTitle}>{feature.title}</Text>
                <Text style={styles.arFeatureDesc}>{feature.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
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
    backgroundColor: 'rgba(255, 217, 61, 0.1)',
    borderWidth: 2,
    borderColor: '#ffd93d',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  radarRing: {
    borderRadius: 35,
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
    backgroundColor: 'rgba(255, 217, 61, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 217, 61, 0.3)',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 217, 61, 0.5)',
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
    borderColor: 'rgba(255, 217, 61, 0.2)',
    minWidth: 70,
  },
  statIconText: {
    fontSize: 24,
    marginBottom: 5,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffd93d',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  searchSection: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  searchContainer: {
    position: 'relative',
  },
  searchGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    backgroundColor: 'transparent',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.1)',
    zIndex: -1,
  },
  searchInput: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderWidth: 2,
    borderColor: 'rgba(100, 255, 218, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#ffffff',
  },
  quickNavSection: {
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
    textShadowColor: 'rgba(255, 217, 61, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  quickNavGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickNavCard: {
    width: '48%',
    backgroundColor: 'rgba(31, 41, 55, 0.4)',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  quickNavGlow: {
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
  quickNavIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
  },
  quickNavIcon: {
    fontSize: 24,
  },
  quickNavText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 2,
  },
  quickNavSubtext: {
    fontSize: 11,
    color: '#94a3b8',
  },
  standsSection: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  standCardWrapper: {
    marginBottom: 15,
  },
  standCard: {
    backgroundColor: 'rgba(31, 41, 55, 0.4)',
    borderRadius: 15,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.2)',
    position: 'relative',
    overflow: 'hidden',
  },
  standGlow: {
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
  standHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  standIdContainer: {
    backgroundColor: '#64ffda',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  standIdText: {
    color: '#0f1419',
    fontWeight: 'bold',
    fontSize: 14,
  },
  standMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  standIcon: {
    fontSize: 24,
  },
  distanceBadge: {
    backgroundColor: 'rgba(255, 217, 61, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  distanceText: {
    color: '#ffd93d',
    fontSize: 10,
    fontWeight: '600',
  },
  standInfo: {
    marginBottom: 15,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#64ffda',
    marginBottom: 4,
  },
  floorInfo: {
    fontSize: 12,
    color: '#94a3b8',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  navigateButton: {
    flex: 1,
    backgroundColor: 'rgba(100, 255, 218, 0.2)',
    borderWidth: 1,
    borderColor: '#64ffda',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  navigateButtonText: {
    color: '#64ffda',
    fontWeight: '600',
    fontSize: 12,
  },
  arButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 217, 61, 0.2)',
    borderWidth: 1,
    borderColor: '#ffd93d',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  arButtonText: {
    color: '#ffd93d',
    fontWeight: '600',
    fontSize: 12,
  },
  arFeaturesSection: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  arFeaturesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  arFeatureCard: {
    width: '48%',
    backgroundColor: 'rgba(31, 41, 55, 0.4)',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  arFeatureGlow: {
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
  arFeatureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
  },
  arFeatureIcon: {
    fontSize: 24,
  },
  arFeatureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    textAlign: 'center',
  },
  arFeatureDesc: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 14,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'rgba(31, 41, 55, 0.4)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.2)',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  bottomPadding: {
    height: 30,
  },
});