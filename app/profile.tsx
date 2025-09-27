import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  Share,
  Animated,
  Dimensions,
  StatusBar
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { QRCode } from '@/components/qr-code';

const { width, height } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user, logout, updateUser } = useAuth();
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    company: user?.company || ''
  });

  // Animation values - all using native driver
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Main entrance animation
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
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous QR code rotation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();

    // Pulse animation for QR code
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Floating animation for decorative elements
    Animated.loop(
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
    ).start();

    // Glow animation for QR container - using native driver
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Hesabınızdan çıkmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Çıkış Yap',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/');
          }
        }
      ]
    );
  };

  const handleFeedbackSubmit = () => {
    if (!feedback.trim()) {
      Alert.alert('Hata', 'Lütfen geri bildirim yazınız');
      return;
    }
    if (rating === 0) {
      Alert.alert('Hata', 'Lütfen bir puan veriniz');
      return;
    }

    Alert.alert(
      'Teşekkürler!',
      'Geri bildiriminiz kaydedildi.',
      [{ text: 'Tamam', onPress: () => { setFeedback(''); setRating(0); } }]
    );
  };

  const handleShareQR = async () => {
    try {
      await Share.share({
        message: `Diji Fuar 2024'te benimle iletişime geçin!\n\nKullanıcı: ${user?.fullName || user?.username}\nE-posta: ${user?.email}\n${user?.company ? `Şirket: ${user.company}` : ''}\n\nQR Kod Verisi: ${user?.qrCode || 'QR kod verisi bulunamadı'}`,
        title: 'Diji Fuar QR Kod'
      });
    } catch (error) {
      Alert.alert('Hata', 'QR kod paylaşılırken bir hata oluştu');
    }
  };

  const handleEditProfile = () => {
    setEditData({
      fullName: user?.fullName || '',
      email: user?.email || '',
      company: user?.company || ''
    });
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!editData.fullName.trim()) {
      Alert.alert('Hata', 'Ad Soyad alanı boş olamaz');
      return;
    }
    if (!editData.email.trim()) {
      Alert.alert('Hata', 'E-posta alanı boş olamaz');
      return;
    }

    try {
      const updatedUser = {
        ...user,
        fullName: editData.fullName.trim(),
        email: editData.email.trim(),
        company: editData.company.trim()
      };

      // QR kodunu güncelle
      updatedUser.qrCode = JSON.stringify({
        userId: user?.id || user?._id,
        username: user?.username,
        fullName: editData.fullName.trim(),
        email: editData.email.trim(),
        company: editData.company.trim(),
        timestamp: Date.now(),
        event: 'diji-fuar-2024'
      });

      if (updateUser) {
        await updateUser(updatedUser);
        setIsEditing(false);
        Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi');
      }
    } catch (error) {
      Alert.alert('Hata', 'Profil güncellenirken bir hata oluştu');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      fullName: user?.fullName || '',
      email: user?.email || '',
      company: user?.company || ''
    });
  };

  const profileSections = [
    {
      title: 'Hesap Bilgileri',
      icon: '👤',
      items: [
        { label: 'Ad Soyad', value: user?.fullName || 'Belirtilmemiş' },
        { label: 'Kullanıcı Adı', value: user?.username || 'Belirtilmemiş' },
        { label: 'E-posta', value: user?.email || 'Belirtilmemiş' },
        { label: 'Şirket', value: user?.company || 'Belirtilmemiş' }
      ]
    }
  ];

  // Animated interpolations
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const floatingInterpolate = floatingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10]
  });

  const glowInterpolate = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1]
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f1419" />

      {/* Animated Background */}
      <Animated.View style={[
        styles.animatedBackground,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideUpAnim }]
        }
      ]}>
        {/* Floating Stars */}
        {[...Array(20)].map((_, i) => (
          <Animated.View
            key={i}
            style={[
              styles.floatingStar,
              {
                left: Math.random() * width,
                top: Math.random() * height,
                transform: [
                  { translateY: floatingInterpolate },
                  { rotate: rotateInterpolate }
                ]
              }
            ]}
            pointerEvents="none"
          />
        ))}

        {/* Galaxy Spiral */}
        <Animated.View
          style={[
            styles.galaxySpiral,
            {
              transform: [{ rotate: rotateInterpolate }]
            }
          ]}
          pointerEvents="none"
        />
      </Animated.View>

      <SafeAreaView style={styles.safeArea}>
        {/* Modern Header */}
        <Animated.View style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Geri</Text>
          </TouchableOpacity>
          <Text style={styles.title}>👤 Profil</Text>
          <View style={styles.headerActions}>
            {!isEditing ? (
              <>
                <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                  <Text style={styles.editButtonText}>✏️ Düzenle</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                  <Text style={styles.logoutButtonText}>Çıkış</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
                  <Text style={styles.cancelButtonText}>✖️ İptal</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                  <Text style={styles.saveButtonText}>✅ Kaydet</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Animated.View>

        <ScrollView
          style={styles.content}
          bounces={true}
          alwaysBounceVertical={true}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section with Profile */}
          <Animated.View style={[
            styles.heroSection,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }, { translateY: slideUpAnim }]
            }
          ]}>
            <Text style={styles.heroTitle}>🚀 Dijital Profil</Text>
            <Text style={styles.heroSubtitle}>Fuar deneyiminizi yönetin</Text>

            {/* Profile Avatar */}
            <Animated.View style={[
              styles.profileAvatar,
              {
                transform: [{ scale: pulseAnim }]
              }
            ]}>
              <View style={styles.avatarGlow}>
                <Text style={styles.avatarText}>
                  {user?.fullName?.charAt(0) || user?.username?.charAt(0) || '🌟'}
                </Text>
              </View>
            </Animated.View>

            <Text style={styles.profileName}>{user?.fullName || user?.username}</Text>
            {user?.company && (
              <Text style={styles.profileCompany}>🏢 {user.company}</Text>
            )}
          </Animated.View>

          {/* Enhanced QR Code Section */}
          <Animated.View style={[
            styles.qrSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>✨ Dijital Kimlik</Text>
              <Text style={styles.sectionSubtitle}>
                QR kodunuz ile anında bağlantı kurun
              </Text>
            </View>

            {/* Premium QR Container */}
            <Animated.View style={[
              styles.qrContainer,
              {
                opacity: glowInterpolate
              }
            ]}>
              {/* QR Background Effects */}
              <Animated.View style={[
                styles.qrBackgroundGlow,
                {
                  transform: [{ rotate: rotateInterpolate }]
                }
              ]} pointerEvents="none" />

              <Text style={styles.qrDescription}>
                🌟 Gelişmiş QR teknolojisi ile anında networking
              </Text>

              {/* QR Code Display */}
              <Animated.View style={[
                styles.qrCodeWrapper,
                {
                  transform: [{ scale: pulseAnim }]
                }
              ]}>
                <View style={styles.qrCodeContainer}>
                  <View style={styles.qrCodeInner}>
                    {user?.qrCode && (
                      <QRCode
                        data={user.qrCode}
                        size={160}
                        backgroundColor="#ffffff"
                        color="#0f1419"
                      />
                    )}
                  </View>

                  {/* Modern Scanner Frame */}
                  <View style={styles.scannerFrame}>
                    <View style={styles.scannerCornerTL} />
                    <View style={styles.scannerCornerTR} />
                    <View style={styles.scannerCornerBL} />
                    <View style={styles.scannerCornerBR} />
                  </View>

                  {/* Scanning Line Animation */}
                  <Animated.View style={[
                    styles.scanningLine,
                    {
                      transform: [{ translateY: floatingInterpolate }]
                    }
                  ]} />
                </View>
              </Animated.View>

              {/* QR Actions */}
              <View style={styles.qrActions}>
                <TouchableOpacity
                  style={styles.shareButton}
                  onPress={handleShareQR}
                >
                  <Animated.View style={[
                    styles.shareButtonGlow,
                    {
                      transform: [{ scale: pulseAnim }]
                    }
                  ]} />
                  <Text style={styles.shareButtonText}>🚀 QR Paylaş</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.downloadButton}>
                  <Text style={styles.downloadButtonText}>💾 İndir</Text>
                </TouchableOpacity>
              </View>

              {/* QR Info Panel */}
              <View style={styles.qrInfoPanel}>
                <Text style={styles.qrInfoTitle}>🔐 Kod İçeriği</Text>
                <View style={styles.qrInfoGrid}>
                  <View style={styles.qrInfoItem}>
                    <Text style={styles.qrInfoLabel}>👤 ID</Text>
                    <Text style={styles.qrInfoValue}>{user?.id}</Text>
                  </View>
                  <View style={styles.qrInfoItem}>
                    <Text style={styles.qrInfoLabel}>🏷️ Kullanıcı</Text>
                    <Text style={styles.qrInfoValue}>{user?.username}</Text>
                  </View>
                  <View style={styles.qrInfoItem}>
                    <Text style={styles.qrInfoLabel}>📧 E-posta</Text>
                    <Text style={styles.qrInfoValue}>{user?.email}</Text>
                  </View>
                  <View style={styles.qrInfoItem}>
                    <Text style={styles.qrInfoLabel}>🎪 Etkinlik</Text>
                    <Text style={styles.qrInfoValue}>Diji Fuar 2024</Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          </Animated.View>

          {/* Profile Info Sections */}
          {profileSections.map((section, sectionIndex) => (
            <Animated.View
              key={sectionIndex}
              style={[
                styles.modernSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideUpAnim }]
                }
              ]}
            >
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{section.icon} {section.title}</Text>
              </View>

              <View style={styles.profileInfoContainer}>
                {section.items.map((item, itemIndex) => (
                  <View key={itemIndex} style={styles.profileInfoItem}>
                    <Text style={styles.profileInfoLabel}>{item.label}</Text>
                    {isEditing && (item.label === 'Ad Soyad' || item.label === 'E-posta' || item.label === 'Şirket') ? (
                      <TextInput
                        style={styles.profileEditInput}
                        value={
                          item.label === 'Ad Soyad' ? editData.fullName :
                          item.label === 'E-posta' ? editData.email :
                          item.label === 'Şirket' ? editData.company : ''
                        }
                        onChangeText={(value) => {
                          if (item.label === 'Ad Soyad') {
                            setEditData({...editData, fullName: value});
                          } else if (item.label === 'E-posta') {
                            setEditData({...editData, email: value});
                          } else if (item.label === 'Şirket') {
                            setEditData({...editData, company: value});
                          }
                        }}
                        placeholder={`${item.label} girin`}
                        placeholderTextColor="#7f8c8d"
                      />
                    ) : (
                      <Text style={styles.profileInfoValue}>{item.value}</Text>
                    )}
                  </View>
                ))}
              </View>
            </Animated.View>
          ))}

          {/* Statistics Section */}
          <Animated.View style={[
            styles.statsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📊 Fuar İstatistikleri</Text>
              <Text style={styles.sectionSubtitle}>Aktivite özeti</Text>
            </View>

            <View style={styles.statsGrid}>
              <Animated.View style={[
                styles.statCard,
                {
                  transform: [{ scale: pulseAnim }]
                }
              ]}>
                <Text style={styles.statIcon}>🏢</Text>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Ziyaret Edilen Stand</Text>
              </Animated.View>

              <Animated.View style={[
                styles.statCard,
                {
                  transform: [{ scale: pulseAnim }]
                }
              ]}>
                <Text style={styles.statIcon}>🎪</Text>
                <Text style={styles.statNumber}>5</Text>
                <Text style={styles.statLabel}>Katıldığı Etkinlik</Text>
              </Animated.View>

              <Animated.View style={[
                styles.statCard,
                {
                  transform: [{ scale: pulseAnim }]
                }
              ]}>
                <Text style={styles.statIcon}>🤝</Text>
                <Text style={styles.statNumber}>24</Text>
                <Text style={styles.statLabel}>Network Bağlantısı</Text>
              </Animated.View>

              <Animated.View style={[
                styles.statCard,
                {
                  transform: [{ scale: pulseAnim }]
                }
              ]}>
                <Text style={styles.statIcon}>⭐</Text>
                <Text style={styles.statNumber}>3</Text>
                <Text style={styles.statLabel}>Favori Stand</Text>
              </Animated.View>
            </View>
          </Animated.View>

          {/* Feedback Section */}
          <Animated.View style={[
            styles.feedbackSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>💬 Geri Bildirim</Text>
              <Text style={styles.sectionSubtitle}>Deneyiminizi paylaşın</Text>
            </View>

            <View style={styles.feedbackContainer}>
              <Text style={styles.feedbackLabel}>🌟 Deneyiminizi değerlendirin</Text>

              {/* Enhanced Rating */}
              <View style={styles.ratingContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                    style={styles.starButton}
                  >
                    <Animated.Text style={[
                      styles.star,
                      star <= rating && styles.starActive,
                      {
                        transform: [{ scale: star <= rating ? pulseAnim : 1 }]
                      }
                    ]}>
                      ⭐
                    </Animated.Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.ratingText}>
                {rating > 0 ? `${rating}/5 ${rating === 5 ? '🚀' : rating >= 4 ? '👍' : rating >= 3 ? '👌' : ''}` : 'Puan veriniz'}
              </Text>

              {/* Enhanced Feedback Input */}
              <View style={styles.feedbackInputContainer}>
                <TextInput
                  style={styles.feedbackInput}
                  placeholder="💭 Yorumunuzu yazın..."
                  placeholderTextColor="#7f8c8d"
                  value={feedback}
                  onChangeText={setFeedback}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleFeedbackSubmit}
              >
                <Animated.View style={[
                  styles.submitButtonGlow,
                  {
                    transform: [{ scale: pulseAnim }]
                  }
                ]} />
                <Text style={styles.submitButtonText}>📤 Gönder</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Quick Actions */}
          <Animated.View style={[
            styles.quickActionsSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>⚡ Hızlı İşlemler</Text>
              <Text style={styles.sectionSubtitle}>Hesap yönetimi</Text>
            </View>

            <View style={styles.quickActionsGrid}>
              <TouchableOpacity style={styles.quickActionCard} onPress={handleEditProfile}>
                <View style={styles.quickActionIconContainer}>
                  <Text style={styles.quickActionIcon}>📝</Text>
                </View>
                <Text style={styles.quickActionText}>Profili Düzenle</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickActionCard}>
                <View style={styles.quickActionIconContainer}>
                  <Text style={styles.quickActionIcon}>🔒</Text>
                </View>
                <Text style={styles.quickActionText}>Şifre Değiştir</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickActionCard}>
                <View style={styles.quickActionIconContainer}>
                  <Text style={styles.quickActionIcon}>📋</Text>
                </View>
                <Text style={styles.quickActionText}>Fuar Geçmişi</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickActionCard}>
                <View style={styles.quickActionIconContainer}>
                  <Text style={styles.quickActionIcon}>⚙️</Text>
                </View>
                <Text style={styles.quickActionText}>Ayarlar</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          <View style={styles.emptySpace} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1419',
  },
  animatedBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  floatingStar: {
    position: 'absolute',
    width: 2,
    height: 2,
    backgroundColor: '#64ffda',
    borderRadius: 1,
    opacity: 0.6,
  },
  galaxySpiral: {
    position: 'absolute',
    top: '10%',
    right: '10%',
    width: 150,
    height: 150,
    borderWidth: 2,
    borderColor: '#64ffda',
    borderRadius: 75,
    opacity: 0.1,
    borderStyle: 'dashed',
  },
  safeArea: {
    flex: 1,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(15, 20, 25, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(100, 255, 218, 0.2)',
    backdropFilter: 'blur(10px)',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.3)',
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
    textShadowColor: '#64ffda',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.3)',
  },
  editButtonText: {
    color: '#64ffda',
    fontSize: 12,
    fontWeight: '600',
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(46, 204, 113, 0.5)',
  },
  saveButtonText: {
    color: '#2ecc71',
    fontSize: 12,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 76, 60, 0.3)',
  },
  cancelButtonText: {
    color: '#ff6b6b',
    fontSize: 12,
    fontWeight: '600',
  },
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 76, 60, 0.5)',
  },
  logoutButtonText: {
    color: '#ff6b6b',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 30,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: '#64ffda',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#a0a9c0',
    textAlign: 'center',
    marginBottom: 30,
  },
  profileAvatar: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarGlow: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(100, 255, 218, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#64ffda',
    shadowColor: '#64ffda',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#64ffda',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
    textShadowColor: '#64ffda',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  profileCompany: {
    fontSize: 16,
    color: '#a0a9c0',
    textAlign: 'center',
  },
  qrSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
    textShadowColor: '#64ffda',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#a0a9c0',
  },
  qrContainer: {
    backgroundColor: 'rgba(15, 20, 25, 0.8)',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.3)',
    shadowColor: '#64ffda',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  qrBackgroundGlow: {
    position: 'absolute',
    top: -50,
    left: -50,
    right: -50,
    bottom: -50,
    borderRadius: 100,
    backgroundColor: 'rgba(100, 255, 218, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.1)',
  },
  qrDescription: {
    fontSize: 16,
    color: '#a0a9c0',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  qrCodeWrapper: {
    alignItems: 'center',
    marginBottom: 25,
  },
  qrCodeContainer: {
    position: 'relative',
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#64ffda',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  qrCodeInner: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },
  scannerFrame: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  scannerCornerTL: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 25,
    height: 25,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#64ffda',
    borderTopLeftRadius: 6,
  },
  scannerCornerTR: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 25,
    height: 25,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#64ffda',
    borderTopRightRadius: 6,
  },
  scannerCornerBL: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    width: 25,
    height: 25,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#64ffda',
    borderBottomLeftRadius: 6,
  },
  scannerCornerBR: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 25,
    height: 25,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#64ffda',
    borderBottomRightRadius: 6,
  },
  scanningLine: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: '#64ffda',
    opacity: 0.8,
    borderRadius: 1,
  },
  qrActions: {
    flexDirection: 'row',
    gap: 15,
    width: '100%',
    marginBottom: 20,
  },
  shareButton: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'rgba(100, 255, 218, 0.2)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#64ffda',
    overflow: 'hidden',
  },
  shareButtonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    borderRadius: 12,
  },
  shareButtonText: {
    color: '#64ffda',
    fontSize: 16,
    fontWeight: '600',
    zIndex: 1,
  },
  downloadButton: {
    flex: 1,
    backgroundColor: 'rgba(138, 43, 226, 0.2)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.5)',
  },
  downloadButtonText: {
    color: '#a855f7',
    fontSize: 16,
    fontWeight: '600',
  },
  qrInfoPanel: {
    backgroundColor: 'rgba(100, 255, 218, 0.05)',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.2)',
  },
  qrInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64ffda',
    marginBottom: 15,
    textAlign: 'center',
  },
  qrInfoGrid: {
    gap: 12,
  },
  qrInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(100, 255, 218, 0.1)',
  },
  qrInfoLabel: {
    fontSize: 14,
    color: '#a0a9c0',
    fontWeight: '500',
  },
  qrInfoValue: {
    fontSize: 14,
    color: '#ffffff',
    fontFamily: 'monospace',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  modernSection: {
    backgroundColor: 'rgba(15, 20, 25, 0.8)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.2)',
  },
  profileInfoContainer: {
    gap: 15,
  },
  profileInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(100, 255, 218, 0.05)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.1)',
  },
  profileInfoLabel: {
    fontSize: 16,
    color: '#a0a9c0',
    fontWeight: '500',
  },
  profileInfoValue: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
    fontWeight: '600',
  },
  profileEditInput: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
    fontWeight: '600',
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.3)',
  },
  statsSection: {
    backgroundColor: 'rgba(15, 20, 25, 0.8)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.2)',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  statCard: {
    width: '47%',
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.3)',
    shadowColor: '#64ffda',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#64ffda',
    marginBottom: 4,
    textShadowColor: '#64ffda',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  statLabel: {
    fontSize: 12,
    color: '#a0a9c0',
    textAlign: 'center',
    lineHeight: 16,
  },
  feedbackSection: {
    backgroundColor: 'rgba(15, 20, 25, 0.8)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.2)',
  },
  feedbackContainer: {
    gap: 15,
  },
  feedbackLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginBottom: 5,
  },
  starButton: {
    padding: 5,
  },
  star: {
    fontSize: 24,
    opacity: 0.3,
  },
  starActive: {
    opacity: 1,
    textShadowColor: '#ffdd59',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  ratingText: {
    fontSize: 13,
    color: '#a0a9c0',
    textAlign: 'center',
    marginBottom: 10,
  },
  feedbackInputContainer: {
    backgroundColor: 'rgba(100, 255, 218, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.2)',
  },
  feedbackInput: {
    color: '#ffffff',
    fontSize: 15,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    position: 'relative',
    backgroundColor: 'rgba(100, 255, 218, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#64ffda',
    overflow: 'hidden',
  },
  submitButtonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    borderRadius: 12,
  },
  submitButtonText: {
    color: '#64ffda',
    fontSize: 14,
    fontWeight: '600',
    zIndex: 1,
  },
  quickActionsSection: {
    backgroundColor: 'rgba(15, 20, 25, 0.8)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.2)',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  quickActionCard: {
    width: '47%',
    backgroundColor: 'rgba(100, 255, 218, 0.05)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.2)',
  },
  quickActionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.3)',
  },
  quickActionIcon: {
    fontSize: 24,
  },
  quickActionText: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 18,
  },
  emptySpace: {
    height: 50,
  },
});