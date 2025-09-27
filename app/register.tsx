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

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [company, setCompany] = useState('');
  const { register, isLoading } = useAuth();

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
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(slideUpAnim, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
      // Form animasyonu
      Animated.timing(formSlideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Sürekli floating animasyon
    const floatingAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 4500,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 4500,
          useNativeDriver: true,
        }),
      ])
    );
    floatingAnimation.start();

    return () => floatingAnimation.stop();
  }, []);

  const floatingTranslateY = floatingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -25],
  });

  const handleRegister = async () => {
    if (!username) {
      Alert.alert('Hata', 'Kullanıcı adı giriniz');
      return;
    }
    if (!fullName) {
      Alert.alert('Hata', 'Ad soyad giriniz');
      return;
    }
    if (!email) {
      Alert.alert('Hata', 'E-posta giriniz');
      return;
    }
    if (!password) {
      Alert.alert('Hata', 'Şifre giriniz');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor!');
      return;
    }

    const success = await register({
      username: username.trim(),
      email: email.trim(),
      password: password.trim(),
      fullName: fullName.trim(),
      company: company.trim() || undefined
    });

    if (success) {
      router.replace('/dashboard');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0f1419" />

      {/* Space Background */}
      <View style={styles.spaceBackground} pointerEvents="none" />

      {/* Floating Stars/Particles */}
      <View style={styles.starsContainer} pointerEvents="none">
        {[...Array(35)].map((_, index) => (
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
                      outputRange: [0, Math.random() * 0.9 + 0.4],
                    }),
                  },
                ],
              },
            ]}
            pointerEvents="none"
          />
        ))}
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          bounces={true}
          alwaysBounceVertical={true}
          keyboardShouldPersistTaps="handled"
        >

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
              <View style={styles.registerLogo}>
                <Text style={styles.logoText}>✨</Text>
                <View style={styles.logoGlow} pointerEvents="none" />
                <View style={styles.logoOrbit} pointerEvents="none" />
              </View>
            </View>
            <Text style={styles.title}>Kayıt Ol</Text>
            <Text style={styles.subtitle}>Dijital evrenin parçası ol</Text>

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
                  <View style={styles.inputGlow} pointerEvents="none" />
                </View>
              </View>

              {/* Full Name Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>🧑‍🚀 Ad Soyad</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Adınız Soyadınız"
                    placeholderTextColor="#64748b"
                    value={fullName}
                    onChangeText={setFullName}
                    autoCapitalize="words"
                    autoComplete="name"
                  />
                  <View style={styles.inputGlow} pointerEvents="none" />
                </View>
              </View>

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>📧 E-posta</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="astronot@galaxy.com"
                    placeholderTextColor="#64748b"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                  <View style={styles.inputGlow} pointerEvents="none" />
                </View>
              </View>

              {/* Company Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>🏢 Şirket (Opsiyonel)</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Space Corporation"
                    placeholderTextColor="#64748b"
                    value={company}
                    onChangeText={setCompany}
                    autoCapitalize="words"
                  />
                  <View style={styles.inputGlow} pointerEvents="none" />
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
                    autoComplete="new-password"
                  />
                  <View style={styles.inputGlow} pointerEvents="none" />
                </View>
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>🔐 Şifre Tekrar</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#64748b"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="new-password"
                  />
                  <View style={styles.inputGlow} pointerEvents="none" />
                </View>
              </View>

              {/* Register Button */}
              <TouchableOpacity
                style={[styles.registerButton, isLoading && styles.disabledButton]}
                onPress={handleRegister}
                disabled={isLoading}
                activeOpacity={0.9}
              >
                <View style={styles.registerButtonGlow} pointerEvents="none" />
                <Text style={styles.registerButtonText}>
                  {isLoading ? '🚀 Hesap Oluşturuluyor...' : '🚀 Uzaya Katıl'}
                </Text>
              </TouchableOpacity>

              {/* Footer Links */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Zaten hesabınız var mı? </Text>
                <Link href="/login">
                  <Text style={styles.linkText}>Giriş yapın 🔐</Text>
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
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
    minHeight: height,
  },
  spaceBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0f1419',
    overflow: 'hidden',
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
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
    zIndex: 2,
  },
  logoContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  registerLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    borderWidth: 2,
    borderColor: '#64ffda',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#64ffda',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  logoText: {
    fontSize: 40,
    textAlign: 'center',
    color: '#64ffda',
    textShadowColor: '#64ffda',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  logoGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.3)',
  },
  logoOrbit: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.2)',
    borderStyle: 'dashed',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    textAlign: 'center',
    textShadowColor: 'rgba(100, 255, 218, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '300',
  },
  decorativeElements: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  decorativeLine: {
    width: 40,
    height: 2,
    backgroundColor: '#64ffda',
    shadowColor: '#64ffda',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  decorativeCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#64ffda',
    marginHorizontal: 15,
    shadowColor: '#64ffda',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
  },
  formContainer: {
    zIndex: 2,
    marginTop: 20,
  },
  form: {
    backgroundColor: 'rgba(31, 41, 55, 0.4)',
    borderRadius: 20,
    padding: 30,
    borderWidth: 1,
    borderColor: 'rgba(100, 255, 218, 0.2)',
    shadowColor: '#64ffda',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64ffda',
    marginBottom: 10,
    textShadowColor: 'rgba(100, 255, 218, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderWidth: 2,
    borderColor: 'rgba(100, 255, 218, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 15,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '400',
    shadowColor: '#64ffda',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  inputGlow: {
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
  registerButton: {
    backgroundColor: 'rgba(100, 255, 218, 0.15)',
    borderWidth: 2,
    borderColor: '#64ffda',
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#64ffda',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  registerButtonGlow: {
    position: 'absolute',
    top: -50,
    left: -50,
    right: -50,
    bottom: -50,
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    borderRadius: 50,
  },
  registerButtonText: {
    color: '#64ffda',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(100, 255, 218, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    zIndex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  footerText: {
    fontSize: 15,
    color: '#94a3b8',
    fontWeight: '300',
  },
  linkText: {
    fontSize: 15,
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
    fontWeight: '400',
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
});