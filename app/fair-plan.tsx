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

export default function FairPlanScreen() {
  // Animation states
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideUpAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.9));
  const [floatingAnim] = useState(new Animated.Value(0));

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

    return () => floatingAnimation.stop();
  }, []);

  const floatingTranslateY = floatingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const fairData = {
    halls: [
      {
        id: 1,
        name: 'A Salonu',
        description: 'Teknoloji ve Yazılım',
        icon: '💻',
        color: '#64ffda',
        standCount: 12,
        stands: [
          { id: 'A1', company: 'TechCorp', category: 'Yazılım Geliştirme', description: 'Kurumsal yazılım çözümleri ve danışmanlık hizmetleri', icon: '⚡' },
          { id: 'A2', company: 'İnovaLab', category: 'AR/VR Teknolojileri', description: 'Sanal ve artırılmış gerçeklik uygulamaları', icon: '🥽' },
          { id: 'A3', company: 'DataSoft', category: 'Veri Analizi', description: 'Büyük veri analizi ve iş zekası çözümleri', icon: '📊' },
          { id: 'A4', company: 'CloudTech', category: 'Bulut Teknolojileri', description: 'Bulut altyapı ve güvenlik hizmetleri', icon: '☁️' }
        ]
      },
      {
        id: 2,
        name: 'B Salonu',
        description: 'Yapay Zeka ve Robotik',
        icon: '🤖',
        color: '#ff6b6b',
        standCount: 10,
        stands: [
          { id: 'B1', company: 'AI Solutions', category: 'Yapay Zeka', description: 'Makine öğrenmesi ve derin öğrenme platformları', icon: '🧠' },
          { id: 'B2', company: 'RoboTech', category: 'Robotik Sistemler', description: 'Endüstriyel ve hizmet robotları üretimi', icon: '🦾' },
          { id: 'B3', company: 'SmartVision', category: 'Görüntü İşleme', description: 'Bilgisayarlı görü ve görüntü tanıma sistemleri', icon: '👁️' },
          { id: 'B4', company: 'AutoMate', category: 'Otomasyon', description: 'Akıllı otomasyon ve IoT çözümleri', icon: '🏭' }
        ]
      },
      {
        id: 3,
        name: 'C Salonu',
        description: 'Fintech ve E-ticaret',
        icon: '💰',
        color: '#4ecdc4',
        standCount: 8,
        stands: [
          { id: 'C1', company: 'PayTech', category: 'Ödeme Sistemleri', description: 'Dijital ödeme ve blockchain çözümleri', icon: '💳' },
          { id: 'C2', company: 'EcomPlus', category: 'E-ticaret Platformu', description: 'Kapsamlı e-ticaret altyapısı ve entegrasyonları', icon: '🛒' },
          { id: 'C3', company: 'CryptoBase', category: 'Kripto Teknolojileri', description: 'Cryptocurrency ve DeFi uygulamaları', icon: '₿' }
        ]
      }
    ]
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f1419" />

      {/* Space Background */}
      <View style={styles.spaceBackground} pointerEvents="none" />

      {/* Floating Stars */}
      <View style={styles.starsContainer} pointerEvents="none">
        {[...Array(25)].map((_, index) => (
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
        <Text style={styles.title}>🗺️ Fuar Planı</Text>
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
            <Text style={styles.heroIcon}>🌌</Text>
            <View style={styles.heroGlow} pointerEvents="none" />
          </View>
          <Text style={styles.heroTitle}>Diji Fuar 2024</Text>
          <Text style={styles.heroSubtitle}>
            {fairData.halls.length} salon • {fairData.halls.reduce((sum, hall) => sum + hall.standCount, 0)} teknoloji standı
          </Text>

          <View style={styles.statsContainer}>
            {fairData.halls.map((hall, index) => (
              <Animated.View
                key={hall.id}
                style={[
                  styles.statCard,
                  {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideUpAnim }],
                  }
                ]}
              >
                <Text style={styles.statIcon}>{hall.icon}</Text>
                <Text style={styles.statNumber}>{hall.stands.length}</Text>
                <Text style={styles.statLabel}>Stand</Text>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Halls Section */}
        {fairData.halls.map((hall, hallIndex) => (
          <Animated.View
            key={hall.id}
            style={[
              styles.hallSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }],
              }
            ]}
          >
            <View style={styles.hallHeader}>
              <View style={styles.hallTitleContainer}>
                <View style={[styles.hallIconContainer, { backgroundColor: hall.color + '20', borderColor: hall.color }]}>
                  <Text style={styles.hallIcon}>{hall.icon}</Text>
                </View>
                <View style={styles.hallTitleText}>
                  <Text style={styles.hallName}>{hall.name}</Text>
                  <Text style={styles.hallDescription}>{hall.description}</Text>
                </View>
              </View>
              <View style={[styles.hallBadge, { backgroundColor: hall.color + '20' }]}>
                <Text style={[styles.hallBadgeText, { color: hall.color }]}>{hall.stands.length} Stand</Text>
              </View>
            </View>

            <View style={styles.standsGrid}>
              {hall.stands.map((stand, standIndex) => (
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
                            outputRange: [0, 50 + standIndex * 10],
                          })
                        }
                      ],
                    }
                  ]}
                >
                  <TouchableOpacity
                    style={styles.standCard}
                    onPress={() => router.push({
                      pathname: '/stand-detail',
                      params: {
                        standId: stand.id,
                        company: stand.company,
                        category: stand.category,
                        description: stand.description,
                        hall: hall.name
                      }
                    })}
                    activeOpacity={0.8}
                  >
                    <View style={styles.standGlow} pointerEvents="none" />
                    <View style={styles.standHeader}>
                      <View style={[styles.standId, { backgroundColor: hall.color }]}>
                        <Text style={styles.standIdText}>{stand.id}</Text>
                      </View>
                      <Text style={styles.standIcon}>{stand.icon}</Text>
                    </View>
                    <Text style={styles.standCompany}>{stand.company}</Text>
                    <Text style={styles.standCategory}>{stand.category}</Text>
                    <Text style={styles.standDescription} numberOfLines={2}>
                      {stand.description}
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </Animated.View>
        ))}

        {/* Interactive Map Section */}
        <Animated.View
          style={[
            styles.mapSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🗺️ İnteraktif Harita</Text>
            <Text style={styles.sectionSubtitle}>Standları keşfedin ve navigasyon yapın</Text>
          </View>

          <TouchableOpacity
            style={styles.mapCard}
            onPress={() => router.push('/navigation')}
            activeOpacity={0.8}
          >
            <View style={styles.mapGlow} pointerEvents="none" />
            <View style={styles.mapIconContainer}>
              <Text style={styles.mapIcon}>🛰️</Text>
              <View style={styles.mapOrbit} pointerEvents="none" />
            </View>
            <Text style={styles.mapTitle}>AR Navigasyon Sistemi</Text>
            <Text style={styles.mapDescription}>
              Artırılmış gerçeklik ile standları bul{'\n'}Gerçek zamanlı yön tarifi al
            </Text>
            <View style={styles.mapButton}>
              <Text style={styles.mapButtonText}>Haritayı Aç →</Text>
            </View>
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
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    borderWidth: 2,
    borderColor: '#64ffda',
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
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.3)',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(100, 255, 218, 0.5)',
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
    borderColor: 'rgba(100, 255, 218, 0.2)',
    minWidth: 70,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#64ffda',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  hallSection: {
    marginHorizontal: 20,
    marginBottom: 25,
    backgroundColor: 'rgba(31, 41, 55, 0.4)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.2)',
  },
  hallHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  hallTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  hallIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 2,
  },
  hallIcon: {
    fontSize: 24,
  },
  hallTitleText: {
    flex: 1,
  },
  hallName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  hallDescription: {
    fontSize: 14,
    color: '#94a3b8',
  },
  hallBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  hallBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  standsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  standCardWrapper: {
    width: '48%',
  },
  standCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 15,
    padding: 16,
    borderWidth: 2,
    borderColor: 'rgba(100, 255, 218, 0.3)',
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
    marginBottom: 10,
  },
  standId: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  standIdText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  standIcon: {
    fontSize: 20,
  },
  standCompany: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  standCategory: {
    fontSize: 12,
    color: '#64ffda',
    marginBottom: 6,
    fontWeight: '600',
  },
  standDescription: {
    fontSize: 11,
    color: '#94a3b8',
    lineHeight: 15,
  },
  mapSection: {
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
    textShadowColor: 'rgba(100, 255, 218, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  mapCard: {
    backgroundColor: 'rgba(31, 41, 55, 0.4)',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.2)',
    position: 'relative',
    overflow: 'hidden',
  },
  mapGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    backgroundColor: 'transparent',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.1)',
    zIndex: -1,
  },
  mapIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    borderWidth: 2,
    borderColor: '#64ffda',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  mapIcon: {
    fontSize: 32,
  },
  mapOrbit: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.3)',
    borderStyle: 'dashed',
  },
  mapTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
  },
  mapDescription: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  mapButton: {
    backgroundColor: 'rgba(100, 255, 218, 0.15)',
    borderWidth: 2,
    borderColor: '#64ffda',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  mapButtonText: {
    color: '#64ffda',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 30,
  },
});