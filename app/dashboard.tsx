import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Animated
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useNetworking } from '@/contexts/NetworkingContext';

export default function DashboardScreen() {
  const { user, logout } = useAuth();
  const { people, matches } = useNetworking();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    // Animasyonları başlat
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Saati güncelle
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      // AuthContext logout işlemi tamamlandıktan sonra otomatik olarak ana sayfaya yönlendirilecek
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    {
      title: 'Fuar Planı',
      description: 'Fuar haritasını görüntüle',
      icon: '🗺️',
      route: '/fair-plan',
      color: '#3498db',
      gradient: ['#3498db', '#2980b9']
    },
    {
      title: 'Canlı Yayın',
      description: 'Anlık yayınları izle',
      icon: '📺',
      route: '/live-stream',
      color: '#e74c3c',
      gradient: ['#e74c3c', '#c0392b']
    },
    {
      title: 'Networking',
      description: 'Profesyonel bağlantılar',
      icon: '🤝',
      route: '/networking',
      color: '#27ae60',
      gradient: ['#27ae60', '#229954'],
      isLive: true
    },
    {
      title: 'Stand Yönlendirme',
      description: 'AR navigasyon sistemi',
      icon: '🧭',
      route: '/navigation',
      color: '#9b59b6',
      gradient: ['#9b59b6', '#8e44ad']
    },
    {
      title: 'Bildirimler',
      description: 'Anlık bildirimler',
      icon: '🔔',
      route: '/notifications',
      color: '#f39c12',
      gradient: ['#f39c12', '#e67e22']
    },
    {
      title: 'Profil',
      description: 'Profil ve geri bildirim',
      icon: '👤',
      route: '/profile',
      color: '#34495e',
      gradient: ['#34495e', '#2c3e50']
    }
  ];

  const adminMenuItem = {
    title: 'Admin Panel',
    description: 'Yönetici kontrol paneli',
    icon: '⚙️',
    route: '/admin',
    color: '#e67e22',
    gradient: ['#e67e22', '#d35400']
  };

  const liveActivities = [
    {
      id: 1,
      title: 'Networking Hub Aktif',
      subtitle: `${people.filter(p => p.status === 'online').length} kişi çevrimiçi`,
      icon: '🟢',
      color: '#27ae60'
    },
    {
      id: 2,
      title: 'Canlı Yayın',
      subtitle: 'Ana sahne - Dr. Mehmet Yılmaz',
      icon: '🔴',
      color: '#e74c3c'
    },
    {
      id: 3,
      title: 'Yeni Eşleşmeler',
      subtitle: `${matches.length} yeni bağlantı`,
      icon: '⚡',
      color: '#f39c12'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Modern Header with Gradient */}
        <Animated.View style={[styles.modernHeader, { opacity: fadeAnim }]}>
          <View style={styles.headerTop}>
            <View style={styles.userSection}>
              <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>
                  {user?.fullName?.charAt(0) || user?.username?.charAt(0) || '?'}
                </Text>
                <View style={styles.onlineIndicator} />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.welcomeText}>Hoş geldin,</Text>
                <Text style={styles.userName}>{user?.fullName || user?.username}</Text>
                {user?.company && (
                  <Text style={styles.companyText}>{user.company}</Text>
                )}
              </View>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutIcon}>⏻</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.timeSection}>
            <Text style={styles.currentTime}>
              {currentTime.toLocaleTimeString('tr-TR', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
            <Text style={styles.currentDate}>
              {currentTime.toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </Text>
          </View>
        </Animated.View>

        {/* Live Activities Section */}
        <Animated.View style={[styles.liveSection, {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }]}>
          <Text style={styles.sectionTitle}>🔴 Canlı Aktiviteler</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.liveScroll}>
            {liveActivities.map((activity) => (
              <TouchableOpacity key={activity.id} style={styles.liveCard}>
                <View style={[styles.liveIndicator, { backgroundColor: activity.color }]}>
                  <Text style={styles.liveIcon}>{activity.icon}</Text>
                </View>
                <Text style={styles.liveTitle}>{activity.title}</Text>
                <Text style={styles.liveSubtitle}>{activity.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Quick Stats */}
        <Animated.View style={[styles.statsContainer, {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }]}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>👥</Text>
            <Text style={styles.statNumber}>{people.length}</Text>
            <Text style={styles.statLabel}>Network</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>⚡</Text>
            <Text style={styles.statNumber}>{matches.length}</Text>
            <Text style={styles.statLabel}>Eşleşme</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🏢</Text>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Stand</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🎯</Text>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Etkinlik</Text>
          </View>
        </Animated.View>

        {/* Main Menu */}
        <Animated.View style={[styles.menuSection, {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }]}>
          <Text style={styles.sectionTitle}>🚀 Ana Menü</Text>
          <View style={styles.menuGrid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.menuItem, { backgroundColor: item.color }]}
                onPress={() => router.push(item.route)}
                activeOpacity={0.8}
              >
                {item.isLive && (
                  <View style={styles.liveBadge}>
                    <Text style={styles.liveBadgeText}>LIVE</Text>
                  </View>
                )}
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
                <View style={styles.menuArrow}>
                  <Text style={styles.arrowText}>→</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Admin Panel (if needed) */}
        {user?.username === 'admin' && (
          <Animated.View style={[styles.adminSection, {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }]}>
            <Text style={styles.sectionTitle}>⚙️ Yönetim</Text>
            <TouchableOpacity
              style={[styles.adminItem, { backgroundColor: adminMenuItem.color }]}
              onPress={() => router.push(adminMenuItem.route)}
              activeOpacity={0.8}
            >
              <Text style={styles.menuIcon}>{adminMenuItem.icon}</Text>
              <Text style={styles.menuTitle}>{adminMenuItem.title}</Text>
              <Text style={styles.menuDescription}>{adminMenuItem.description}</Text>
              <View style={styles.menuArrow}>
                <Text style={styles.arrowText}>→</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1419',
  },
  modernHeader: {
    backgroundColor: '#1a1f2e',
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatarText: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3498db',
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 50,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#27ae60',
    borderWidth: 2,
    borderColor: '#1a1f2e',
  },
  userInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: '#8892b0',
    marginBottom: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ccd6f6',
    marginBottom: 2,
  },
  companyText: {
    fontSize: 14,
    color: '#64ffda',
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutIcon: {
    fontSize: 20,
    color: '#e74c3c',
  },
  timeSection: {
    alignItems: 'center',
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    padding: 15,
    borderRadius: 15,
  },
  currentTime: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#64ffda',
    marginBottom: 5,
  },
  currentDate: {
    fontSize: 14,
    color: '#8892b0',
  },
  liveSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ccd6f6',
    marginBottom: 15,
  },
  liveScroll: {
    flexDirection: 'row',
  },
  liveCard: {
    backgroundColor: '#1a1f2e',
    padding: 15,
    borderRadius: 15,
    marginRight: 15,
    minWidth: 180,
    borderWidth: 1,
    borderColor: '#233554',
  },
  liveIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  liveIcon: {
    fontSize: 18,
  },
  liveTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ccd6f6',
    marginBottom: 5,
  },
  liveSubtitle: {
    fontSize: 12,
    color: '#8892b0',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1f2e',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#233554',
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#64ffda',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#8892b0',
    textAlign: 'center',
  },
  menuSection: {
    padding: 20,
  },
  menuGrid: {
    gap: 15,
  },
  menuItem: {
    padding: 20,
    borderRadius: 20,
    position: 'relative',
    minHeight: 100,
    justifyContent: 'space-between',
  },
  liveBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#e74c3c',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  liveBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  menuIcon: {
    fontSize: 28,
    marginBottom: 10,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  menuDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 10,
  },
  menuArrow: {
    position: 'absolute',
    bottom: 15,
    right: 20,
  },
  arrowText: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  adminSection: {
    padding: 20,
  },
  adminItem: {
    padding: 20,
    borderRadius: 20,
    position: 'relative',
    minHeight: 100,
    justifyContent: 'space-between',
  },
  bottomSpace: {
    height: 30,
  },
});