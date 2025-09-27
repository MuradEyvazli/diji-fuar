import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
  Animated,
  Dimensions,
  StatusBar
} from 'react-native';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function NotificationsScreen() {
  const [enablePush, setEnablePush] = useState(true);
  const [enableEmail, setEnableEmail] = useState(false);
  const [enableEvents, setEnableEvents] = useState(true);
  const [enableStands, setEnableStands] = useState(true);
  const [filterType, setFilterType] = useState('all');

  // Animation states
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideUpAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.9));
  const [floatingAnim] = useState(new Animated.Value(0));
  const [bellAnim] = useState(new Animated.Value(0));

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

    // Bell shake animation
    const bellAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bellAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(bellAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ])
    );
    bellAnimation.start();

    return () => {
      floatingAnimation.stop();
      bellAnimation.stop();
    };
  }, []);

  const floatingTranslateY = floatingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const bellRotation = bellAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '15deg'],
  });

  const notifications = [
    {
      id: 1,
      type: 'live',
      title: 'Canlı Yayın Başladı',
      message: '"Dijital Dönüşümün Geleceği" paneli şimdi canlı yayında!',
      time: '2 dk önce',
      isRead: false,
      icon: '🔴',
      priority: 'high',
      color: '#ff6b6b'
    },
    {
      id: 2,
      type: 'event',
      title: 'Panel Yakında Başlıyor',
      message: '"Startup Ekosistemi" paneli 15 dakika sonra başlıyor.',
      time: '5 dk önce',
      isRead: false,
      icon: '🎤',
      priority: 'high',
      color: '#ff6b6b'
    },
    {
      id: 3,
      type: 'networking',
      title: 'Yeni Eşleşme',
      message: 'Can Özkan ile ortak ilgi alanlarınız bulundu!',
      time: '15 dk önce',
      isRead: false,
      icon: '🤝',
      priority: 'medium',
      color: '#4ecdc4'
    },
    {
      id: 4,
      type: 'stand',
      title: 'Stand Tanıtımı',
      message: 'İnovaLab AR/VR demo sunumu şimdi başlıyor.',
      time: '30 dk önce',
      isRead: false,
      icon: '🎯',
      priority: 'medium',
      color: '#ffd93d'
    },
    {
      id: 5,
      type: 'message',
      title: 'Yeni Mesaj',
      message: 'Zeynep Kaya size bir mesaj gönderdi.',
      time: '45 dk önce',
      isRead: true,
      icon: '💬',
      priority: 'low',
      color: '#64ffda'
    },
    {
      id: 6,
      type: 'achievement',
      title: 'Başarı Kazanıldı',
      message: 'Tebrikler! "Sosyal Bağlantı" rozetini kazandınız!',
      time: '1 sa önce',
      isRead: true,
      icon: '🏆',
      priority: 'low',
      color: '#ffd93d'
    }
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = notifications.filter(notification => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !notification.isRead;
    if (filterType === 'high') return notification.priority === 'high';
    return notification.type === filterType;
  });

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
        <Text style={styles.title}>🔔 Bildirimler</Text>
        <TouchableOpacity style={styles.markAllButton}>
          <Text style={styles.markAllText}>Tümünü Okundu</Text>
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
            <Animated.View style={[styles.bellIcon, { transform: [{ rotate: bellRotation }] }]}>
              <Text style={styles.heroIcon}>🔔</Text>
            </Animated.View>
            <View style={styles.heroGlow} pointerEvents="none" />
          </View>
          <Text style={styles.heroTitle}>Bildirim Merkezi</Text>
          <Text style={styles.heroSubtitle}>
            {unreadCount} okunmamış • {notifications.length} toplam bildirim
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statIconText}>🔴</Text>
              <Text style={styles.statNumber}>{unreadCount}</Text>
              <Text style={styles.statLabel}>Okunmamış</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIconText}>📱</Text>
              <Text style={styles.statNumber}>{notifications.filter(n => n.priority === 'high').length}</Text>
              <Text style={styles.statLabel}>Acil</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIconText}>📧</Text>
              <Text style={styles.statNumber}>{notifications.length}</Text>
              <Text style={styles.statLabel}>Toplam</Text>
            </View>
          </View>
        </Animated.View>

        {/* Settings Section */}
        <Animated.View
          style={[
            styles.settingsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⚙️ Bildirim Ayarları</Text>
            <Text style={styles.sectionSubtitle}>Tercihlerinizi özelleştirin</Text>
          </View>

          <View style={styles.settingsGrid}>
            {[
              { key: 'push', label: 'Push Bildirimleri', desc: 'Anında bildirimler', value: enablePush, setValue: setEnablePush },
              { key: 'email', label: 'E-posta', desc: 'Önemli güncellemeler', value: enableEmail, setValue: setEnableEmail },
              { key: 'events', label: 'Etkinlik', desc: 'Program hatırlatmaları', value: enableEvents, setValue: setEnableEvents },
              { key: 'stands', label: 'Stand', desc: 'Stand güncellemeleri', value: enableStands, setValue: setEnableStands }
            ].map((setting, index) => (
              <View key={setting.key} style={styles.settingCard}>
                <View style={styles.settingGlow} pointerEvents="none" />
                <View style={styles.settingContent}>
                  <Text style={styles.settingLabel}>{setting.label}</Text>
                  <Text style={styles.settingDesc}>{setting.desc}</Text>
                </View>
                <Switch
                  value={setting.value}
                  onValueChange={setting.setValue}
                  trackColor={{ false: 'rgba(107, 114, 128, 0.3)', true: 'rgba(100, 255, 218, 0.3)' }}
                  thumbColor={setting.value ? '#64ffda' : '#6b7280'}
                />
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Filters Section */}
        <Animated.View
          style={[
            styles.filtersSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🎯 Filtreler</Text>
            <Text style={styles.sectionSubtitle}>Bildirimleri kategoriye göre filtrele</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {[
              { key: 'all', label: 'Tümü', icon: '🌐' },
              { key: 'unread', label: 'Okunmamış', icon: '🔴' },
              { key: 'high', label: 'Acil', icon: '⚠️' },
              { key: 'live', label: 'Canlı', icon: '📺' },
              { key: 'networking', label: 'Network', icon: '🤝' },
              { key: 'event', label: 'Etkinlik', icon: '🎤' }
            ].map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterChip,
                  filterType === filter.key && styles.filterChipActive
                ]}
                onPress={() => setFilterType(filter.key)}
              >
                <Text style={styles.filterIcon}>{filter.icon}</Text>
                <Text style={[
                  styles.filterChipText,
                  filterType === filter.key && styles.filterChipTextActive
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Notifications List */}
        <Animated.View
          style={[
            styles.notificationsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }],
            }
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📋 Bildirimler</Text>
            <Text style={styles.sectionSubtitle}>{filteredNotifications.length} bildirim gösteriliyor</Text>
          </View>

          {filteredNotifications.map((notification, index) => (
            <Animated.View
              key={notification.id}
              style={[
                styles.notificationWrapper,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: slideUpAnim.interpolate({
                        inputRange: [0, 50],
                        outputRange: [0, 50 + index * 3],
                      })
                    }
                  ],
                }
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.notificationCard,
                  !notification.isRead && styles.unreadNotification
                ]}
                activeOpacity={0.8}
              >
                <View style={styles.notificationGlow} pointerEvents="none" />

                <View style={styles.notificationHeader}>
                  <View style={[styles.notificationIconContainer, { backgroundColor: notification.color + '20', borderColor: notification.color }]}>
                    <Text style={styles.notificationIcon}>{notification.icon}</Text>
                  </View>

                  <View style={styles.notificationContent}>
                    <View style={styles.notificationTop}>
                      <Text style={styles.notificationTitle}>{notification.title}</Text>
                      <Text style={styles.notificationTime}>{notification.time}</Text>
                    </View>
                    <Text style={styles.notificationMessage}>{notification.message}</Text>
                    <View style={[styles.priorityBar, { backgroundColor: notification.color }]} />
                  </View>

                  {!notification.isRead && (
                    <View style={styles.unreadDot} />
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}

          {filteredNotifications.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>Bildirim bulunamadı</Text>
              <Text style={styles.emptyDescription}>
                Seçilen filtre için bildirim bulunmuyor
              </Text>
            </View>
          )}
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
  markAllButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
  },
  markAllText: {
    fontSize: 12,
    color: '#64ffda',
    fontWeight: '600',
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
  bellIcon: {
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
  statIconText: {
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
  settingsSection: {
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
  settingsGrid: {
    gap: 12,
  },
  settingCard: {
    backgroundColor: 'rgba(31, 41, 55, 0.4)',
    borderRadius: 15,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.2)',
    position: 'relative',
    overflow: 'hidden',
  },
  settingGlow: {
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
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 12,
    color: '#94a3b8',
  },
  filtersSection: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterChip: {
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
  filterChipActive: {
    backgroundColor: 'rgba(100, 255, 218, 0.2)',
    borderColor: '#64ffda',
  },
  filterIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  filterChipText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#64ffda',
  },
  notificationsSection: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  notificationWrapper: {
    marginBottom: 12,
  },
  notificationCard: {
    backgroundColor: 'rgba(31, 41, 55, 0.4)',
    borderRadius: 15,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.2)',
    position: 'relative',
    overflow: 'hidden',
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#64ffda',
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
  },
  notificationGlow: {
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
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
  },
  notificationIcon: {
    fontSize: 20,
  },
  notificationContent: {
    flex: 1,
    position: 'relative',
  },
  notificationTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
  },
  notificationTime: {
    fontSize: 12,
    color: '#94a3b8',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 20,
    marginBottom: 8,
  },
  priorityBar: {
    height: 2,
    borderRadius: 1,
    width: '100%',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#64ffda',
    marginLeft: 8,
    marginTop: 8,
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