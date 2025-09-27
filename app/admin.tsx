import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  RefreshControl
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminScreen() {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

  // Generate random data for demo
  const [adminData, setAdminData] = useState({
    totalVisitors: Math.floor(Math.random() * 1000) + 500,
    activeUsers: Math.floor(Math.random() * 150) + 50,
    totalConnections: Math.floor(Math.random() * 500) + 200,
    totalFeedbacks: Math.floor(Math.random() * 100) + 30,
    engagementRate: (Math.random() * 40 + 60).toFixed(1),
    popularStand: ['TechCorp (A1)', 'İnovaLab (A2)', 'DataSoft (B3)', 'AI Solutions (B4)', 'RoboTech (C1)', 'CloudNet (C2)'][Math.floor(Math.random() * 6)],
    liveStreamViewers: Math.floor(Math.random() * 300) + 100,
    arSessionsToday: Math.floor(Math.random() * 80) + 20
  });

  const generateNewData = () => {
    setAdminData({
      totalVisitors: Math.floor(Math.random() * 1000) + 500,
      activeUsers: Math.floor(Math.random() * 150) + 50,
      totalConnections: Math.floor(Math.random() * 500) + 200,
      totalFeedbacks: Math.floor(Math.random() * 100) + 30,
      engagementRate: (Math.random() * 40 + 60).toFixed(1),
      popularStand: ['TechCorp (A1)', 'İnovaLab (A2)', 'DataSoft (B3)', 'AI Solutions (B4)', 'RoboTech (C1)', 'CloudNet (C2)'][Math.floor(Math.random() * 6)],
      liveStreamViewers: Math.floor(Math.random() * 300) + 100,
      arSessionsToday: Math.floor(Math.random() * 80) + 20
    });
    setLastUpdateTime(new Date());
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      generateNewData();
      setRefreshing(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Auto-refresh data every 30 seconds
      if (Math.random() > 0.7) { // 30% chance to update
        generateNewData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const statisticsCards = [
    {
      title: 'Toplam Ziyaretçi',
      value: adminData.totalVisitors.toLocaleString(),
      icon: '👥',
      color: '#3498db',
      trend: '+12%'
    },
    {
      title: 'Aktif Kullanıcı',
      value: adminData.activeUsers.toLocaleString(),
      icon: '🟢',
      color: '#27ae60',
      trend: '+8%'
    },
    {
      title: 'Network Bağlantısı',
      value: adminData.totalConnections.toLocaleString(),
      icon: '🤝',
      color: '#9b59b6',
      trend: '+25%'
    },
    {
      title: 'Geri Bildirim',
      value: adminData.totalFeedbacks.toLocaleString(),
      icon: '💬',
      color: '#e67e22',
      trend: '+15%'
    }
  ];

  const engagementMetrics = [
    {
      label: 'Etkileşim Oranı',
      value: `${adminData.engagementRate}%`,
      icon: '📊'
    },
    {
      label: 'En Popüler Stand',
      value: adminData.popularStand,
      icon: '🏆'
    },
    {
      label: 'Canlı Yayın İzleyici',
      value: adminData.liveStreamViewers.toLocaleString(),
      icon: '📺'
    },
    {
      label: 'AR Oturumu (Bugün)',
      value: adminData.arSessionsToday.toLocaleString(),
      icon: '🎯'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'user_join',
      message: 'Yeni kullanıcı kaydı: Dr. Ahmet Yılmaz',
      time: '2 dakika önce',
      icon: '👤'
    },
    {
      id: 2,
      type: 'networking',
      message: '15 yeni networking bağlantısı kuruldu',
      time: '5 dakika önce',
      icon: '🤝'
    },
    {
      id: 3,
      type: 'livestream',
      message: 'Ana sahne canlı yayını başladı',
      time: '10 dakika önce',
      icon: '🔴'
    },
    {
      id: 4,
      type: 'feedback',
      message: '5 yeni geri bildirim alındı',
      time: '15 dakika önce',
      icon: '💬'
    },
    {
      id: 5,
      type: 'ar_session',
      message: '25 yeni AR oturumu başlatıldı',
      time: '20 dakika önce',
      icon: '🎯'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Admin Panel</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Text style={styles.refreshButtonText}>🔄</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Admin Info */}
        <View style={styles.adminInfo}>
          <Text style={styles.welcomeText}>Hoş geldiniz, {user?.username}!</Text>
          <Text style={styles.lastUpdateText}>
            Son güncelleme: {lastUpdateTime.toLocaleTimeString('tr-TR')}
          </Text>
        </View>

        {/* Statistics Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Temel İstatistikler</Text>
          <View style={styles.statsGrid}>
            {statisticsCards.map((stat, index) => (
              <View key={index} style={[styles.statCard, { borderLeftColor: stat.color }]}>
                <View style={styles.statHeader}>
                  <Text style={styles.statIcon}>{stat.icon}</Text>
                  <Text style={styles.statTrend}>{stat.trend}</Text>
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statTitle}>{stat.title}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Engagement Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🎯 Detaylı Metrikler</Text>
          {engagementMetrics.map((metric, index) => (
            <View key={index} style={styles.metricCard}>
              <View style={styles.metricLeft}>
                <Text style={styles.metricIcon}>{metric.icon}</Text>
                <Text style={styles.metricLabel}>{metric.label}</Text>
              </View>
              <Text style={styles.metricValue}>{metric.value}</Text>
            </View>
          ))}
        </View>

        {/* Real-time Activities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔄 Canlı Aktiviteler</Text>
          {recentActivities.map((activity) => (
            <View key={activity.id} style={styles.activityCard}>
              <Text style={styles.activityIcon}>{activity.icon}</Text>
              <View style={styles.activityContent}>
                <Text style={styles.activityMessage}>{activity.message}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ Yönetim İşlemleri</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📨</Text>
              <Text style={styles.actionText}>Toplu Bildirim Gönder</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={styles.actionText}>Detaylı Rapor</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>⚙️</Text>
              <Text style={styles.actionText}>Sistem Ayarları</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>👥</Text>
              <Text style={styles.actionText}>Kullanıcı Yönetimi</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* System Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔧 Sistem Durumu</Text>
          <View style={styles.systemStatus}>
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, { backgroundColor: '#27ae60' }]} />
              <Text style={styles.statusText}>Veritabanı: Çevrimiçi</Text>
            </View>
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, { backgroundColor: '#27ae60' }]} />
              <Text style={styles.statusText}>API Servisleri: Aktif</Text>
            </View>
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, { backgroundColor: '#f39c12' }]} />
              <Text style={styles.statusText}>Backup Sistemi: Uyarı</Text>
            </View>
            <View style={styles.statusItem}>
              <View style={[styles.statusDot, { backgroundColor: '#27ae60' }]} />
              <Text style={styles.statusText}>Canlı Yayın: Çalışıyor</Text>
            </View>
          </View>
        </View>

        <View style={styles.emptySpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#2c3e50',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  refreshButton: {
    padding: 8,
  },
  refreshButtonText: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  adminInfo: {
    backgroundColor: '#34495e',
    padding: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  lastUpdateText: {
    fontSize: 14,
    color: '#bdc3c7',
  },
  section: {
    padding: 20,
    backgroundColor: '#ffffff',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 24,
  },
  statTrend: {
    fontSize: 12,
    color: '#27ae60',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'left',
  },
  metricCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  metricLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metricIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  metricLabel: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: 'bold',
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  activityIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityMessage: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#2c3e50',
    textAlign: 'center',
    fontWeight: '500',
  },
  systemStatus: {
    gap: 12,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  statusText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  emptySpace: {
    height: 20,
  },
});