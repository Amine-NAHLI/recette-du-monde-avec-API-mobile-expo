import React from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { styles } from './styles';

export default function HeroSection({ scaleImage, setPage }) {
  return (
    <View style={styles.heroSection}>
      <Animated.Image
        source={{
          uri: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200',
        }}
        style={[StyleSheet.absoluteFillObject, { transform: [{ scale: scaleImage }] }]}
      />
      <View style={styles.heroOverlay} />

      <View style={styles.heroContent}>
        <View style={styles.prestigeBadge}>
          <View style={styles.crownDot} />
          <Text style={styles.prestigeText}>SIGNATURE COLLECTION</Text>
        </View>

        <Text style={styles.heroTitle}>L'EXCELLENCE{'\n'}DANS CHAQUE{'\n'}DETAIL</Text>

        <Text style={styles.heroSub}>
          Une odyssee sensorielle a travers les saveurs les plus raffinees du globe.
        </Text>

        <TouchableOpacity style={styles.primaryBtn} onPress={() => setPage('cuisines')}>
          <Text style={styles.primaryBtnText}>DECOUVRIR LE MONDE</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
