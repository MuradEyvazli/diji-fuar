import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Animated,
  Dimensions,
  StatusBar,
  SafeAreaView
} from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();

  // Animation states
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideUpAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.9));
  const [formSlideAnim] = useState(new Animated.Value(100));
  const [floatingAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Animasyon sekansı başlat
    Animated.sequence([
      // İlk animasyon grubu
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
      ]),
      // Form animasyonu
      Animated.timing(formSlideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Sürekli floating animasyon
    const floatingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    );
    floatingAnimation.start();

    return () => floatingAnimation.stop();
  }, []);

  const floatingTranslateY = floatingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const handleLogin = async () => {
    if (!username.trim()) {
      Alert.alert('Hata', 'Kullanıcı adı veya e-posta giriniz');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Hata', 'Şifre giriniz');
      return;
    }

    const success = await login({
      username: username.trim(),
      password: password.trim()
    });

    if (success) {
      router.replace('/dashboard');
    }
  };

  const fillDemoCredentials = () => {
    setUsername('demo');
    setPassword('123456');
  };

  const fillAdminCredentials = () => {
    setUsername('admin');
    setPassword('admin123');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f1419" />

      {/* Space Background */}
      <View style={styles.spaceBackground} />

      {/* Floating Stars/Particles */}
      <View style={styles.starsContainer}>
        {[...Array(30)].map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.star,
              {
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: floatingTranslateY,
                  },
                  {
                    scale: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, Math.random() * 0.8 + 0.3],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

          {/* Header Section */}
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
              <View style={styles.loginLogo}>
                <Text style={styles.logoText}>🔐</Text>
                <View style={styles.logoGlow} />
              </View>
            </View>
            <Text style={styles.title}>Giriş Yap</Text>
            <Text style={styles.subtitle}>Dijital dünyaya hoş geldin</Text>

            <View style={styles.decorativeElements}>
              <View style={styles.decorativeLine} />
              <View style={styles.decorativeCircle} />
              <View style={styles.decorativeLine} />
            </View>
          </Animated.View>

          {/* Form Section */}
          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: formSlideAnim }],
              },
            ]}
          >
            <View style={styles.form}>

              {/* Username Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>👤 Kullanıcı Adı</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="kullanici_adi"
                    placeholderTextColor="#64748b"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoComplete="username"
                  />
                  <View style={styles.inputGlow} />
                </View>
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>🔒 Şifre</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#64748b"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="password"
                  />
                  <View style={styles.inputGlow} />
                </View>
              </View>

              {/* Quick Access Section */}
              <View style={styles.quickAccessSection}>
                <Text style={styles.quickAccessTitle}>⚡ Hızlı Erişim</Text>
                <View style={styles.quickAccessButtons}>
                  <TouchableOpacity
                    style={styles.demoButton}
                    onPress={fillDemoCredentials}
                    activeOpacity={0.8}
                  >
                    <View style={styles.buttonGradient} />
                    <Text style={styles.demoButtonText}>👤 Demo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.adminButton}
                    onPress={fillAdminCredentials}
                    activeOpacity={0.8}
                  >
                    <View style={styles.buttonGradient} />
                    <Text style={styles.adminButtonText}>⚙️ Admin</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.credentialsInfo}>
                  <Text style={styles.credentialsText}>Demo: demo / 123456</Text>
                  <Text style={styles.credentialsText}>Admin: admin / admin123</Text>
                </View>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.disabledButton]}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.9}
              >
                <View style={styles.loginButtonGlow} />
                <Text style={styles.loginButtonText}>
                  {isLoading ? '🚀 Giriş Yapılıyor...' : '🚀 Giriş Yap'}
                </Text>
              </TouchableOpacity>

              {/* Footer Links */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Hesabınız yok mu? </Text>
                <Link href="/register">
                  <Text style={styles.linkText}>Kayıt olun ✨</Text>
                </Link>
              </View>

              <Link href="/" style={styles.backLink}>
                <Text style={styles.backLinkText}>← Ana Sayfaya Dön</Text>
              </Link>
            </View>
          </Animated.View>

        </ScrollView>
      </KeyboardAvoidingView>
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
  },
  star: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#64ffda',
    shadowColor: '#64ffda',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  loginLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1a1f2e',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#64ffda',
    position: 'relative',
    shadowColor: '#64ffda',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  logoGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#64ffda',
    opacity: 0.3,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ccd6f6',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(100, 255, 218, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#8892b0',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '300',
  },
  decorativeElements: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginTop: 20,
  },
  decorativeLine: {
    width: 50,
    height: 1,
    backgroundColor: '#64ffda',
    opacity: 0.6,
  },
  decorativeCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#64ffda',
    shadowColor: '#64ffda',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 5,
  },
  formContainer: {
    alignItems: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 350,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64ffda',
    marginBottom: 12,
    textShadowColor: 'rgba(100, 255, 218, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: '#1a1f2e',
    borderWidth: 2,
    borderColor: '#233554',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: '#ccd6f6',
    fontWeight: '500',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  inputGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.3)',
    opacity: 0,
  },
  quickAccessSection: {
    marginBottom: 30,
    backgroundColor: 'rgba(26, 31, 46, 0.6)',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#233554',
  },
  quickAccessTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#64ffda',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(100, 255, 218, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  quickAccessButtons: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  demoButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  adminButton: {
    flex: 1,
    backgroundColor: '#f59e0b',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonGradient: {
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    borderRadius: 13,
    opacity: 0.5,
  },
  demoButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  adminButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  credentialsInfo: {
    backgroundColor: 'rgba(15, 20, 25, 0.8)',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#233554',
  },
  credentialsText: {
    fontSize: 12,
    color: '#8892b0',
    textAlign: 'center',
    marginBottom: 3,
    fontFamily: 'monospace',
  },
  loginButton: {
    backgroundColor: '#64ffda',
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 25,
    position: 'relative',
    shadowColor: '#64ffda',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  loginButtonGlow: {
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: 18,
    backgroundColor: '#64ffda',
    opacity: 0.3,
    zIndex: -1,
  },
  loginButtonText: {
    color: '#0f1419',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#8892b0',
  },
  linkText: {
    fontSize: 14,
    color: '#64ffda',
    fontWeight: '600',
    textShadowColor: 'rgba(100, 255, 218, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  backLink: {
    alignSelf: 'center',
  },
  backLinkText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
});