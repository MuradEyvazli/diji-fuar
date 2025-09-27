import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const { isAuthenticated } = useAuth();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideUpAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.9));
  const [buttonSlideAnim] = useState(new Animated.Value(100));
  const [floatingAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Sadece initial load'da kontrol et, logout sonrası değil
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, []); // isAuthenticated dependency'sini kaldırdık

  useEffect(() => {
    // Ana animasyon sekansı
    Animated.sequence([
      // Logo ve başlık animasyonu
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(slideUpAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Butonlar animasyonu
      Animated.timing(buttonSlideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Sürekli yüzen animasyon
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f1419" />

      {/* Arka plan gradient efekti */}
      <View style={styles.backgroundGradient} />

      {/* Floating particles efekti */}
      <View style={styles.particlesContainer}>
        {[...Array(20)].map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.particle,
              {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: floatingTranslateY,
                  },
                ],
              },
            ]}
          />
        ))}
      </View>

      {/* Ana içerik */}
      <View style={styles.content}>
        {/* Logo ve başlık bölümü */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideUpAnim },
                { scale: scaleAnim },
                { translateY: floatingTranslateY },
              ],
            },
          ]}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>DF</Text>
              <View style={styles.logoPulse} />
            </View>
          </View>

          <Text style={styles.title}>Diji Fuar</Text>
          <Text style={styles.subtitle}>Dijital Fuarların Geleceği</Text>

          <View style={styles.featureRow}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🚀</Text>
              <Text style={styles.featureText}>Modern</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🌐</Text>
              <Text style={styles.featureText}>Global</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>⚡</Text>
              <Text style={styles.featureText}>Hızlı</Text>
            </View>
          </View>
        </Animated.View>

        {/* Buton bölümü */}
        <Animated.View
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: buttonSlideAnim }],
            },
          ]}
        >
          <Link href="/login" asChild>
            <TouchableOpacity style={styles.loginButton} activeOpacity={0.8}>
              <View style={styles.buttonContent}>
                <Text style={styles.loginButtonText}>🔐 Giriş Yap</Text>
                <Text style={styles.buttonSubtext}>Hesabınıza erişin</Text>
              </View>
              <View style={styles.buttonGlow} />
            </TouchableOpacity>
          </Link>

          <Link href="/register" asChild>
            <TouchableOpacity style={styles.registerButton} activeOpacity={0.8}>
              <View style={styles.buttonContent}>
                <Text style={styles.registerButtonText}>✨ Kayıt Ol</Text>
                <Text style={styles.registerButtonSubtext}>Ücretsiz hesap oluşturun</Text>
              </View>
            </TouchableOpacity>
          </Link>

          <View style={styles.quickAccessContainer}>
            <Text style={styles.quickAccessTitle}>Hızlı Erişim</Text>
            <View style={styles.quickAccessButtons}>
              <TouchableOpacity style={styles.quickAccessButton}>
                <Text style={styles.quickAccessText}>👤 Demo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAccessButton}>
                <Text style={styles.quickAccessText}>⚙️ Admin</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Alt bilgi */}
      <Animated.View
        style={[
          styles.footer,
          { opacity: fadeAnim }
        ]}
      >
        <Text style={styles.footerText}>v2024.1 • Made with ❤️</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1419',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0f1419',
    opacity: 1,
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#64ffda',
    opacity: 0.6,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 80,
  },
  logoContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1a1f2e',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#64ffda',
    position: 'relative',
    shadowColor: '#64ffda',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#64ffda',
  },
  logoPulse: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#64ffda',
    opacity: 0.3,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ccd6f6',
    marginBottom: 10,
    textAlign: 'center',
    textShadowColor: 'rgba(100, 255, 218, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#8892b0',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '300',
  },
  featureRow: {
    flexDirection: 'row',
    gap: 30,
    marginTop: 20,
  },
  featureItem: {
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: '#64ffda',
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 320,
    gap: 20,
  },
  loginButton: {
    backgroundColor: '#64ffda',
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 16,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#64ffda',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonContent: {
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#0f1419',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  buttonSubtext: {
    color: '#0f1419',
    fontSize: 12,
    opacity: 0.8,
  },
  buttonGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 18,
    backgroundColor: '#64ffda',
    opacity: 0.3,
    zIndex: -1,
  },
  registerButton: {
    backgroundColor: 'transparent',
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#64ffda',
    alignItems: 'center',
    position: 'relative',
  },
  registerButtonText: {
    color: '#64ffda',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  registerButtonSubtext: {
    color: '#8892b0',
    fontSize: 12,
  },
  quickAccessContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  quickAccessTitle: {
    fontSize: 14,
    color: '#8892b0',
    marginBottom: 15,
    fontWeight: '600',
  },
  quickAccessButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  quickAccessButton: {
    backgroundColor: '#1a1f2e',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#233554',
  },
  quickAccessText: {
    color: '#ccd6f6',
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#8892b0',
    textAlign: 'center',
  },
});