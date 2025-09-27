import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function StandDetailScreen() {
  const params = useLocalSearchParams();
  const { standId, company, category, description, hall } = params;

  const handleVisitStand = () => {
    Alert.alert(
      'Stand Ziyareti',
      `${company} standını ziyaret etmek üzeresiniz. Yol tarifi için navigasyon başlatılsın mı?`,
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Navigasyon Başlat', onPress: () => {
          // Navigasyon ekranına yönlendir
          router.push('/navigation');
        }}
      ]
    );
  };

  const handleAddToFavorites = () => {
    Alert.alert('Favorilere Eklendi', `${company} favorilerinize eklendi.`);
  };

  const handleContactStand = () => {
    Alert.alert(
      'İletişim',
      `${company} ile iletişim kurmak için QR kodunuzu paylaşabilir veya networking modülünü kullanabilirsiniz.`,
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Networking', onPress: () => router.push('/networking') }
      ]
    );
  };

  const standInfo = {
    products: [
      'Kurumsal yazılım çözümleri',
      'Mobil uygulama geliştirme',
      'Cloud services entegrasyonu',
      'Danışmanlık hizmetleri'
    ],
    features: [
      '24/7 teknik destek',
      'Ücretsiz demo',
      'Özelleştirilebilir çözümler',
      'Entegrasyon desteği'
    ],
    contact: {
      representative: 'Ahmet Yılmaz',
      position: 'Satış Müdürü',
      email: 'ahmet@techcorp.com',
      phone: '+90 532 xxx xx xx'
    },
    schedule: [
      { time: '09:00-11:00', event: 'Genel Tanıtım' },
      { time: '11:30-12:30', event: 'Demo Sunumu' },
      { time: '14:00-15:00', event: 'Teknik Sunum' },
      { time: '15:30-16:30', event: 'Soru & Cevap' }
    ]
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Stand Detayı</Text>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={handleAddToFavorites}
        >
          <Text style={styles.favoriteText}>⭐</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Stand Header */}
        <View style={styles.standHeader}>
          <View style={styles.standIdContainer}>
            <Text style={styles.standId}>{standId}</Text>
            <Text style={styles.hallText}>{hall}</Text>
          </View>

          <View style={styles.standMainInfo}>
            <Text style={styles.companyName}>{company}</Text>
            <Text style={styles.category}>{category}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton} onPress={handleVisitStand}>
            <Text style={styles.actionButtonText}>🧭 Stand'a Git</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleContactStand}>
            <Text style={styles.actionButtonText}>🤝 İletişim Kur</Text>
          </TouchableOpacity>
        </View>

        {/* Products & Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛍️ Ürün & Hizmetler</Text>
          {standInfo.products.map((product, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.listBullet}>•</Text>
              <Text style={styles.listText}>{product}</Text>
            </View>
          ))}
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✨ Özellikler</Text>
          {standInfo.features.map((feature, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.listBullet}>•</Text>
              <Text style={styles.listText}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Günlük Program</Text>
          {standInfo.schedule.map((item, index) => (
            <View key={index} style={styles.scheduleItem}>
              <Text style={styles.scheduleTime}>{item.time}</Text>
              <Text style={styles.scheduleEvent}>{item.event}</Text>
            </View>
          ))}
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📞 İletişim Bilgileri</Text>
          <View style={styles.contactCard}>
            <Text style={styles.contactName}>{standInfo.contact.representative}</Text>
            <Text style={styles.contactPosition}>{standInfo.contact.position}</Text>
            <Text style={styles.contactInfo}>📧 {standInfo.contact.email}</Text>
            <Text style={styles.contactInfo}>📱 {standInfo.contact.phone}</Text>
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
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  favoriteButton: {
    padding: 8,
  },
  favoriteText: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  standHeader: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  standIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  standId: {
    backgroundColor: '#3498db',
    color: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12,
  },
  hallText: {
    fontSize: 14,
    color: '#7f8c8d',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  standMainInfo: {
    gap: 8,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  category: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  actionsSection: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    backgroundColor: '#ffffff',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  listBullet: {
    fontSize: 16,
    color: '#3498db',
    marginRight: 8,
    marginTop: 2,
  },
  listText: {
    fontSize: 14,
    color: '#2c3e50',
    flex: 1,
    lineHeight: 20,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  scheduleTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3498db',
    minWidth: 100,
  },
  scheduleEvent: {
    fontSize: 14,
    color: '#2c3e50',
    flex: 1,
  },
  contactCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e1e8ed',
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  contactPosition: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
  },
  contactInfo: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 4,
  },
  emptySpace: {
    height: 20,
  },
});