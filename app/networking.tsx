import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  Animated,
  Dimensions,
  StatusBar
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useNetworking } from '@/contexts/NetworkingContext';

const { width, height } = Dimensions.get('window');

export default function NetworkingScreen() {
  const { user } = useAuth();
  const { people, matches, connectWithPerson, sendMessage, scanQRCode, shareQRCode, isConnected } = useNetworking();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

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

    // Connection pulse animation
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
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

  const filteredConnections = people.filter(connection => {
    const matchesSearch = connection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         connection.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         connection.expertise.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = selectedFilter === 'all' || connection.connectionType === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const handleConnect = (person: any) => {
    Alert.alert(
      'Bağlantı İsteği',
      `${person.name} ile bağlantı kurmak istiyor musunuz?`,
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Bağlan', onPress: () => {
          connectWithPerson(person.id);
          Alert.alert('Başarılı', `${person.name} ile bağlandınız!`);
        }}
      ]
    );
  };

  const handleMessage = (person: any) => {
    router.push(`/chat?personId=${person.id}&name=${encodeURIComponent(person.name)}`);
  };

  const handleScanQR = () => {
    Alert.alert(
      'QR Kod Tarama',
      'QR kod tarandı! Yeni bağlantı eklendi.',
      [
        { text: 'Tamam', onPress: () => {
          scanQRCode();
        }}
      ]
    );
  };

  const handleShareQR = () => {
    Alert.alert(
      'QR Kod Paylaşımı',
      'QR kodunuz paylaşıldı!',
      [
        { text: 'Tamam', onPress: () => {
          shareQRCode();
        }}
      ]
    );
  };

  const handleBusinessCard = () => {
    router.push('/profile');
  };

  const handleGetSuggestions = () => {
    Alert.alert(
      'Akıllı Öneriler',
      'Size uygun yeni bağlantı önerileri geldi!',
      [{ text: 'Tamam' }]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return '#64ffda';
      case 'away': return '#ff9500';
      case 'offline': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getConnectionTypeLabel = (type: string) => {
    switch (type) {
      case 'connected': return 'Bağlı';
      case 'mutual': return 'Ortak Bağlantı';
      case 'suggested': return 'Önerilen';
      default: return '';
    }
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
        <Text style={styles.title}>🌐 Networking</Text>
        <TouchableOpacity
          style={styles.qrButton}
          onPress={() => router.push('/profile')}
        >
          <Text style={styles.qrButtonText}>🆔</Text>
        </TouchableOpacity>
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
            <Animated.View style={[styles.connectionRing, { transform: [{ scale: pulseAnim }] }]}>
              <Text style={styles.heroIcon}>🤝</Text>
            </Animated.View>
            <View style={styles.heroGlow} pointerEvents="none" />
          </View>
          <Text style={styles.heroTitle}>Networking Hub</Text>
          <Text style={styles.heroSubtitle}>
            {people.filter(p => p.connectionType === 'connected').length} bağlantı • {matches.length} eşleşme
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statIconText}>🔗</Text>
              <Text style={styles.statNumber}>{people.filter(p => p.connectionType === 'connected').length}</Text>
              <Text style={styles.statLabel}>Bağlantı</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIconText}>🎯</Text>
              <Text style={styles.statNumber}>{matches.length}</Text>
              <Text style={styles.statLabel}>Eşleşme</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIconText}>👥</Text>
              <Text style={styles.statNumber}>{people.filter(p => p.connectionType === 'mutual').length}</Text>
              <Text style={styles.statLabel}>Ortak</Text>
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
              placeholder="Kişi, şirket veya uzmanlık alanı ara..."
              placeholderTextColor="#64748b"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
            {[
              { key: 'all', label: 'Tümü', icon: '🌐' },
              { key: 'connected', label: 'Bağlı', icon: '🔗' },
              { key: 'mutual', label: 'Ortak', icon: '👥' },
              { key: 'suggested', label: 'Önerilen', icon: '✨' }
            ].map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterButton,
                  selectedFilter === filter.key && styles.filterButtonActive
                ]}
                onPress={() => setSelectedFilter(filter.key)}
              >
                <Text style={styles.filterIcon}>{filter.icon}</Text>
                <Text style={[
                  styles.filterButtonText,
                  selectedFilter === filter.key && styles.filterButtonTextActive
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Connections List */}
        <Animated.View
          style={[
            styles.connectionsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🤝 Bağlantılar</Text>
            <Text style={styles.sectionSubtitle}>{filteredConnections.length} kişi bulundu</Text>
          </View>

          {filteredConnections.map((person, index) => (
            <Animated.View
              key={person.id}
              style={[
                styles.personCardWrapper,
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
              <TouchableOpacity style={styles.personCard} activeOpacity={0.8}>
                <View style={styles.personGlow} pointerEvents="none" />

                <View style={styles.personHeader}>
                  <View style={styles.avatarContainer}>
                    <Text style={styles.avatar}>{person.avatar}</Text>
                    <Animated.View style={[
                      styles.statusIndicator,
                      {
                        backgroundColor: getStatusColor(person.status),
                        transform: [{ scale: person.status === 'online' ? pulseAnim : 1 }]
                      }
                    ]} />
                  </View>

                  <View style={styles.personInfo}>
                    <Text style={styles.personName}>{person.name}</Text>
                    <Text style={styles.personPosition}>
                      {person.position} • {person.company}
                    </Text>
                    <Text style={styles.personExpertise}>{person.expertise}</Text>
                    <Text style={styles.lastSeen}>Son görülme: {person.lastSeen}</Text>
                  </View>

                  <View style={styles.connectionBadge}>
                    <Text style={styles.connectionBadgeText}>
                      {getConnectionTypeLabel(person.connectionType)}
                    </Text>
                  </View>
                </View>

                <View style={styles.personActions}>
                  {person.connectionType === 'suggested' ? (
                    <TouchableOpacity
                      style={styles.connectButton}
                      onPress={() => handleConnect(person)}
                    >
                      <Text style={styles.connectButtonText}>🤝 Bağlan</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.messageButton}
                      onPress={() => handleMessage(person)}
                    >
                      <Text style={styles.messageButtonText}>💬 Mesaj</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity style={styles.viewProfileButton}>
                    <Text style={styles.viewProfileButtonText}>👤 Profil</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}

          {filteredConnections.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>Sonuç bulunamadı</Text>
              <Text style={styles.emptyDescription}>
                Arama kriterlerinizi değiştirmeyi deneyin
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View
          style={[
            styles.quickActionsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⚡ Hızlı İşlemler</Text>
            <Text style={styles.sectionSubtitle}>Anında networking araçları</Text>
          </View>

          <View style={styles.quickActions}>
            {[
              { icon: '📱', text: 'QR Kod Tara', action: handleScanQR, color: '#64ffda' },
              { icon: '📤', text: 'QR Paylaş', action: handleShareQR, color: '#ff6b6b' },
              { icon: '📋', text: 'Kartvizit', action: handleBusinessCard, color: '#4ecdc4' },
              { icon: '🎯', text: 'Öneri Al', action: handleGetSuggestions, color: '#ffd93d' }
            ].map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.quickActionButton, { borderColor: action.color + '40' }]}
                onPress={action.action}
                activeOpacity={0.8}
              >
                <View style={styles.quickActionGlow} pointerEvents="none" />
                <View style={[styles.quickActionIconContainer, { backgroundColor: action.color + '20', borderColor: action.color }]}>
                  <Text style={styles.quickActionIcon}>{action.icon}</Text>
                </View>
                <Text style={styles.quickActionText}>{action.text}</Text>
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
  qrButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
  },
  qrButtonText: {
    fontSize: 20,
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
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderWidth: 2,
    borderColor: '#4ecdc4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  connectionRing: {
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
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.3)',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(78, 205, 196, 0.5)',
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
    borderColor: 'rgba(78, 205, 196, 0.2)',
    minWidth: 70,
  },
  statIconText: {
    fontSize: 24,
    marginBottom: 5,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4ecdc4',
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
    marginBottom: 15,
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
  filterContainer: {
    flexDirection: 'row',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(31, 41, 55, 0.4)',
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.2)',
  },
  filterButtonActive: {
    backgroundColor: 'rgba(100, 255, 218, 0.2)',
    borderColor: '#64ffda',
  },
  filterIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#64ffda',
  },
  connectionsSection: {
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
    textShadowColor: 'rgba(78, 205, 196, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  personCardWrapper: {
    marginBottom: 15,
  },
  personCard: {
    backgroundColor: 'rgba(31, 41, 55, 0.4)',
    borderRadius: 15,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.2)',
    position: 'relative',
    overflow: 'hidden',
  },
  personGlow: {
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
  personHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    fontSize: 40,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#0f1419',
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  personPosition: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
  },
  personExpertise: {
    fontSize: 12,
    color: '#64ffda',
    marginBottom: 4,
  },
  lastSeen: {
    fontSize: 11,
    color: '#6b7280',
  },
  connectionBadge: {
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  connectionBadgeText: {
    fontSize: 10,
    color: '#4ecdc4',
    fontWeight: '600',
  },
  personActions: {
    flexDirection: 'row',
    gap: 8,
  },
  connectButton: {
    flex: 1,
    backgroundColor: 'rgba(100, 255, 218, 0.2)',
    borderWidth: 1,
    borderColor: '#64ffda',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  connectButtonText: {
    color: '#64ffda',
    fontSize: 12,
    fontWeight: '600',
  },
  messageButton: {
    flex: 1,
    backgroundColor: 'rgba(78, 205, 196, 0.2)',
    borderWidth: 1,
    borderColor: '#4ecdc4',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  messageButtonText: {
    color: '#4ecdc4',
    fontSize: 12,
    fontWeight: '600',
  },
  viewProfileButton: {
    flex: 1,
    backgroundColor: 'rgba(107, 114, 128, 0.2)',
    borderWidth: 1,
    borderColor: '#6b7280',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewProfileButtonText: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: '600',
  },
  quickActionsSection: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionButton: {
    width: '48%',
    backgroundColor: 'rgba(31, 41, 55, 0.4)',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  quickActionGlow: {
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
  quickActionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 2,
  },
  quickActionIcon: {
    fontSize: 24,
  },
  quickActionText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
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