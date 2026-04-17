import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const MESSAGES = [
  "Préparation des recettes...",
  "Exploration des cuisines...",
  "Découverte des saveurs...",
  "Mise en place des ingrédients..."
];

const LoadingScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onFinish, 500); 
          return 100;
        }
        return prev + 2;
      });
    }, 100);

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
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.logoContainer}>
        <MaterialIcons name="restaurant" size={48} color={COLORS.secondary} />
      </View>

      <Text style={styles.titleMain}>RESTAURANT</Text>
      <Text style={styles.titleSub}>DU MONDE</Text>

      <View style={styles.progressWrapper}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress}%` }]} />
        </View>
      </View>

      <Text style={styles.percentageText}>{Math.round(progress)}%</Text>
      <Text style={styles.statusMessage}>{MESSAGES[messageIndex]}</Text>

      <View style={styles.footerDecoration}>
        <View style={styles.decoLine} />
        <Text style={styles.decoText}>CHARGEMENT</Text>
        <View style={styles.decoLine} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center', padding: 24 },
  logoContainer: {
    width: 100, height: 100, backgroundColor: COLORS.primary, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center', shadowColor: COLORS.secondary,
    shadowOpacity: 0.4, shadowRadius: 20, elevation: 12, borderWidth: 2, borderColor: COLORS.secondary, marginBottom: 28,
  },
  titleMain: { fontSize: 26, fontWeight: '800', color: COLORS.primary, letterSpacing: 2, marginBottom: 4 },
  titleSub: { fontSize: 14, fontWeight: '400', color: COLORS.secondary, letterSpacing: 6, marginBottom: 48 },
  progressWrapper: { width: '70%', marginBottom: 16 },
  track: { width: '100%', height: 3, backgroundColor: '#E8E0D5', borderRadius: 2, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: COLORS.secondary, borderRadius: 2 },
  percentageText: { fontSize: 13, fontWeight: '700', color: COLORS.primary, letterSpacing: 1, marginBottom: 8 },
  statusMessage: { fontSize: 12, color: '#7A7A7A', fontStyle: 'italic', letterSpacing: 0.5 },
  footerDecoration: { position: 'absolute', bottom: 40, flexDirection: 'row', alignItems: 'center', gap: 12 },
  decoLine: { width: 30, height: 1, backgroundColor: COLORS.secondary },
  decoText: { fontSize: 10, color: '#7A7A7A', letterSpacing: 2, fontWeight: '600' },
});

export default LoadingScreen;
