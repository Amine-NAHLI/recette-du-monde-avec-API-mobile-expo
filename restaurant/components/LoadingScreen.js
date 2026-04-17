import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Animated, Easing } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const MESSAGES = [
  "INSPIRATIONS CULINAIRES...",
  "VOYAGE GASTRONOMIQUE...",
  "SÉLECTION DES CHEFS...",
  "DÉCOUVREZ LE MONDE..."
];

const LoadingScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onFinish, 800); 
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    const messageInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % MESSAGES.length);
    }, 1500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.logoCircle}>
          <Feather name="map" size={48} color={COLORS.secondary} />
        </View>

        <Text style={styles.titleMain}>SAVEURS DU MONDE</Text>
        <Text style={styles.titleSub}>L'ART DU GOÛT</Text>

        <View style={styles.progressContainer}>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${progress}%` }]} />
          </View>
          <View style={styles.progressInfo}>
            <Text style={styles.statusMessage}>{MESSAGES[messageIndex]}</Text>
            <Text style={styles.percentageText}>{Math.round(progress)}%</Text>
          </View>
        </View>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>AMINE NAHLI COLLECTION</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.primary, 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 24 
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  logoCircle: {
    width: 120, 
    height: 120, 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    borderRadius: 60,
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  titleMain: { 
    fontSize: 28, 
    fontWeight: '900', 
    color: '#FFFFFF', 
    letterSpacing: 4, 
    marginBottom: 8 
  },
  titleSub: { 
    fontSize: 12, 
    fontWeight: '700', 
    color: COLORS.secondary, 
    letterSpacing: 8, 
    marginBottom: 60 
  },
  progressContainer: { 
    width: '80%', 
  },
  track: { 
    width: '100%', 
    height: 4, 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    borderRadius: 2, 
    overflow: 'hidden',
    marginBottom: 16,
  },
  fill: { 
    height: '100%', 
    backgroundColor: COLORS.secondary, 
    borderRadius: 2 
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  percentageText: { 
    fontSize: 14, 
    fontWeight: '900', 
    color: '#FFF', 
  },
  statusMessage: { 
    fontSize: 10, 
    color: 'rgba(255,255,255,0.5)', 
    fontWeight: '700',
    letterSpacing: 1 
  },
  footer: { 
    position: 'absolute', 
    bottom: 60,
  },
  footerText: { 
    fontSize: 10, 
    color: 'rgba(255,255,255,0.3)', 
    letterSpacing: 2, 
    fontWeight: '800' 
  },
});

export default LoadingScreen;
