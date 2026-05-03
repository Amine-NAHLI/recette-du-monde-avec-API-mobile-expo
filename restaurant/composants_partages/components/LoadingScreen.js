/**
 * Ecran splash au premier lancement : animations + barre de progression simulee puis onFinish().
 */
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, StatusBar, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../logique/design/couleurs.js';

const MESSAGES = [
  "ÉVEIL DES SENS...",
  "L'EXCELLENCE DÉLIVRÉE...",
  "L'ART DE LA TABLE...",
  "SIGNATURE CULINAIRE...",
];

const LoadingScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const lineScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 4,
        tension: 10,
        useNativeDriver: false,
      }),
      Animated.timing(lineScale, {
        toValue: 1,
        duration: 2000,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start();

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: false,
          }).start(() => onFinish());
          return 100;
        }
        return prev + 1;
      });
    }, 25);

    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 1800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* --- LOGO CENTRAL ANIMÉ --- */}
        <Animated.View style={[styles.logoWrapper, { transform: [{ scale: logoScale }] }]}>
          <Ionicons name="restaurant-outline" size={56} color={COLORS.secondary} />
          <View style={styles.brandRing} />
        </Animated.View>

        {/* --- NOM DE LA MARQUE (ex: SALUT ou LA RÉSERVE) --- */}
        <Text style={styles.brandName}>SALUT</Text>
        <View style={styles.divider}>
          <Animated.View style={[styles.dividerFill, { transform: [{ scaleX: lineScale }] }]} />
        </View>
        <Text style={styles.brandTagline}>Symphonie Gastronomique</Text>

        {/* --- SECTION BARRE DE CHARGEMENT --- */}
        <View style={styles.progressSection}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <View style={styles.progressMeta}>
            <Text style={styles.message}>{MESSAGES[messageIndex]}</Text>
            <Text style={styles.percentage}>{`${Math.round(progress)}%`}</Text>
          </View>
        </View>
      </Animated.View>

      <View style={styles.signature}>
        <Text style={styles.signatureText}>EXCLUSIVEMENT PAR AMINE NAHLI</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // --- Fond plein ecran ---
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  // --- Logo anime + halo ---
  logoWrapper: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  brandRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 0.5,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  brandName: {
    fontSize: 36,
    fontWeight: '300',
    color: COLORS.text,
    letterSpacing: 12,
    marginBottom: 10,
    fontFamily: 'serif',
  },
  divider: {
    width: 100,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: 15,
    overflow: 'hidden',
  },
  dividerFill: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  brandTagline: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.secondary,
    letterSpacing: 6,
    textTransform: 'uppercase',
    marginBottom: 80,
  },
  // --- Barre de progression + texte rotatif ---
  progressSection: {
    width: '80%',
  },
  progressTrack: {
    height: 1.5,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 1,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.secondary,
  },
  progressMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  message: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '700',
    letterSpacing: 2,
  },
  percentage: {
    fontSize: 12,
    color: COLORS.secondary,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  signature: {
    position: 'absolute',
    bottom: 60,
  },
  signatureText: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.2)',
    letterSpacing: 4,
    fontWeight: '800',
  },
});

export default LoadingScreen;


