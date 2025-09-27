import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ScrollView
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function ARViewScreen() {
  const { standId, standName } = useLocalSearchParams();
  const [isARActive, setIsARActive] = useState(false);
  const [arMode, setArMode] = useState<'navigation' | 'info' | 'interaction'>('navigation');

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const arFeatures = [
    {
      id: 1,
      title: 'Stand Yönlendirme',
      description: 'Kamera ile stanttaki doğrudan yolu görün',
      icon: '🧭',
      isActive: arMode === 'navigation'
    },
    {
      id: 2,
      title: 'Ürün Bilgileri',
      description: 'Ürünlere odaklayarak detaylı bilgi alın',
      icon: '📱',
      isActive: arMode === 'info'
    },
    {
      id: 3,
      title: 'İnteraktif Deneyim',
      description: '3D modelleri inceleyip etkileşim kurun',
      icon: '🎮',
      isActive: arMode === 'interaction'
    }
  ];

  const handleStartAR = () => {
    setIsARActive(true);
  };

  const handleStopAR = () => {
    setIsARActive(false);
  };

  const ARPlaceholder = () => (
    <View style={styles.arContainer}>
      {/* AR Camera Simulation */}
      <View style={styles.arCamera}>
        {/* Navigation Overlay */}
        {arMode === 'navigation' && (
          <View style={styles.navigationOverlay}>
            <View style={styles.arrow}>
              <Text style={styles.arrowText}>↗️</Text>
            </View>
            <Text style={styles.directionText}>25m - Sol dönemece</Text>
            <View style={styles.pathIndicator}>
              <View style={styles.pathDot} />
              <View style={styles.pathDot} />
              <View style={styles.pathDot} />
              <View style={styles.pathLine} />
            </View>
          </View>
        )}

        {/* Info Overlay */}
        {arMode === 'info' && (
          <View style={styles.infoOverlay}>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>TechCorp Stand</Text>
              <Text style={styles.infoDescription}>
                Yapay Zeka ve Machine Learning çözümleri
              </Text>
              <View style={styles.infoActions}>
                <TouchableOpacity style={styles.infoButton}>
                  <Text style={styles.infoButtonText}>📋 Katalog</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.infoButton}>
                  <Text style={styles.infoButtonText}>👤 İletişim</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Interaction Overlay */}
        {arMode === 'interaction' && (
          <View style={styles.interactionOverlay}>
            <View style={styles.model3D}>
              <Text style={styles.model3DText}>🏢</Text>
              <Text style={styles.model3DLabel}>3D Model</Text>
            </View>
            <View style={styles.interactionControls}>
              <TouchableOpacity style={styles.controlButton}>
                <Text style={styles.controlButtonText}>🔄 Döndür</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton}>
                <Text style={styles.controlButtonText}>🔍 Yakınlaştır</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton}>
                <Text style={styles.controlButtonText}>ℹ️ Bilgi Al</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* AR Status Indicator */}
        <View style={styles.arStatus}>
          <View style={styles.arStatusDot} />
          <Text style={styles.arStatusText}>AR Aktif</Text>
        </View>

        {/* Camera Placeholder */}
        <View style={styles.cameraPlaceholder}>
          <Text style={styles.cameraPlaceholderText}>
            {isARActive ? '📷 Kamera Aktif - AR Görünüm' : '📱 AR Kamerası'}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>AR Görünüm</Text>
        <TouchableOpacity style={styles.helpButton}>
          <Text style={styles.helpButtonText}>❓</Text>
        </TouchableOpacity>
      </View>

      {isARActive ? (
        <ARPlaceholder />
      ) : (
        <ScrollView style={styles.content}>
          {/* AR Features */}
          <View style={styles.featuresSection}>
            <Text style={styles.sectionTitle}>🎯 AR Özellikler</Text>
            {arFeatures.map((feature) => (
              <TouchableOpacity
                key={feature.id}
                style={[
                  styles.featureCard,
                  feature.isActive && styles.featureCardActive
                ]}
                onPress={() => setArMode(feature.id === 1 ? 'navigation' : feature.id === 2 ? 'info' : 'interaction')}
              >
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <View style={styles.featureInfo}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
                {feature.isActive && (
                  <Text style={styles.activeIndicator}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* AR Instructions */}
          <View style={styles.instructionsSection}>
            <Text style={styles.sectionTitle}>📖 Kullanım Talimatları</Text>
            <View style={styles.instructionCard}>
              <Text style={styles.instructionStep}>1. AR özelliğini seçin</Text>
              <Text style={styles.instructionStep}>2. "AR Başlat" butonuna basın</Text>
              <Text style={styles.instructionStep}>3. Telefonu stand yönüne çevirin</Text>
              <Text style={styles.instructionStep}>4. Ekrandaki yönergeleri takip edin</Text>
            </View>
          </View>

          {/* Stand Info */}
          {standName && (
            <View style={styles.standInfoSection}>
              <Text style={styles.sectionTitle}>🏢 Stand Bilgileri</Text>
              <View style={styles.standInfoCard}>
                <Text style={styles.standName}>{decodeURIComponent(standName as string)}</Text>
                <Text style={styles.standDetails}>
                  AR teknolojisi ile stand konumunu bulun ve ürünleri keşfedin
                </Text>
              </View>
            </View>
          )}

          {/* Start AR Button */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={styles.startARButton}
              onPress={handleStartAR}
            >
              <Text style={styles.startARButtonText}>🎯 AR Deneyimini Başlat</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.emptySpace} />
        </ScrollView>
      )}

      {/* AR Controls (shown when AR is active) */}
      {isARActive && (
        <View style={styles.arControls}>
          <TouchableOpacity
            style={styles.stopARButton}
            onPress={handleStopAR}
          >
            <Text style={styles.stopARButtonText}>⏹️ AR Durdur</Text>
          </TouchableOpacity>

          <View style={styles.arModeSelector}>
            {arFeatures.map((feature) => (
              <TouchableOpacity
                key={feature.id}
                style={[
                  styles.arModeButton,
                  feature.isActive && styles.arModeButtonActive
                ]}
                onPress={() => setArMode(feature.id === 1 ? 'navigation' : feature.id === 2 ? 'info' : 'interaction')}
              >
                <Text style={styles.arModeIcon}>{feature.icon}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#ffffff',
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
  helpButton: {
    padding: 8,
  },
  helpButtonText: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  featuresSection: {
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
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  featureCardActive: {
    borderColor: '#3498db',
    backgroundColor: '#e3f2fd',
  },
  featureIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  featureInfo: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 18,
  },
  activeIndicator: {
    fontSize: 20,
    color: '#27ae60',
    fontWeight: 'bold',
  },
  instructionsSection: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginTop: 10,
  },
  instructionCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  instructionStep: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 8,
    lineHeight: 20,
  },
  standInfoSection: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginTop: 10,
  },
  standInfoCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
  },
  standName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  standDetails: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  actionSection: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginTop: 10,
    alignItems: 'center',
  },
  startARButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 250,
  },
  startARButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptySpace: {
    height: 20,
  },
  arContainer: {
    flex: 1,
    position: 'relative',
  },
  arCamera: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#1a1a1a',
  },
  navigationOverlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 2,
  },
  arrow: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  arrowText: {
    fontSize: 48,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowRadius: 2,
  },
  directionText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  pathIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  pathDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3498db',
    marginHorizontal: 4,
  },
  pathLine: {
    width: 100,
    height: 2,
    backgroundColor: '#3498db',
    marginLeft: 8,
  },
  infoOverlay: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    zIndex: 2,
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 16,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  infoDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 12,
    lineHeight: 18,
  },
  infoActions: {
    flexDirection: 'row',
    gap: 8,
  },
  infoButton: {
    flex: 1,
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  infoButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  interactionOverlay: {
    position: 'absolute',
    top: '30%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  model3D: {
    alignItems: 'center',
    marginBottom: 20,
  },
  model3DText: {
    fontSize: 64,
    marginBottom: 8,
  },
  model3DLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  interactionControls: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
  },
  controlButton: {
    backgroundColor: 'rgba(52,152,219,0.9)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  controlButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  arStatus: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(231,76,60,0.9)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    zIndex: 3,
  },
  arStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    marginRight: 6,
  },
  arStatusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cameraPlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
  cameraPlaceholderText: {
    color: '#bdc3c7',
    fontSize: 18,
    fontWeight: '500',
  },
  arControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingVertical: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stopARButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  stopARButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  arModeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  arModeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  arModeButtonActive: {
    borderColor: '#3498db',
    backgroundColor: 'rgba(52,152,219,0.3)',
  },
  arModeIcon: {
    fontSize: 20,
  },
});