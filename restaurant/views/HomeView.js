import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, ScrollView, Animated, Easing } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const TOP_REGIONS = [
  { name: 'Italian', icon: 'pizza' },
  { name: 'Chinese', icon: 'food-variant' },
  { name: 'French', icon: 'baguette' },
  { name: 'Japanese', icon: 'noodle' },
];

const HomeView = ({ isMobile, setPage, areasCount, recipesCount }) => {
  // ADVANCED ANIMATIONS
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glitchAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance Sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();

    // Loop Pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    ).start();

    // Loop Glitch Shift
    Animated.loop(
      Animated.sequence([
        Animated.timing(glitchAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
        Animated.timing(glitchAnim, { toValue: -1, duration: 100, useNativeDriver: true }),
        Animated.timing(glitchAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      {/* SECTION 1: DYNAMIC HERO */}
      <View style={styles.heroSection}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?auto=format&fit=crop&w=1200' }} 
          style={StyleSheet.absoluteFillObject} 
        />
        <View style={styles.heroOverlay} />
        
        <View style={styles.heroContent}>
          <View style={styles.statusBadge}>
            <Animated.View style={[styles.pulse, { transform: [{ scale: pulseAnim }] }]} />
            <Text style={styles.statusText}>SYSTÈME_ACTIF</Text>
          </View>
          
          <Animated.View style={{ transform: [{ translateX: glitchAnim.interpolate({ inputRange: [-1, 1], outputRange: [-2, 2] }) }] }}>
            <Text style={styles.heroTitle}>EXPLORER{"\n"}L'ORBITALE{"\n"}CULINAIRE</Text>
          </Animated.View>

          <TouchableOpacity style={styles.scanBtn} onPress={() => setPage('cuisines')}>
            <Text style={styles.scanBtnText}>SCANNER LE RÉSEAU</Text>
            <Feather name="maximize" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* SECTION 2: TOP REGIONS HORIZONTAL */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionCode}>ARCH_REGIONS_v1</Text>
          <Text style={styles.sectionTitle}>RÉGIONS PRIORITAIRES</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.regionList}>
          {TOP_REGIONS.map((region, i) => (
            <TouchableOpacity key={i} style={styles.regionCard} onPress={() => setPage('cuisines')}>
              <MaterialCommunityIcons name={region.icon} size={32} color={COLORS.secondary} />
              <Text style={styles.regionName}>{region.name.toUpperCase()}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* SECTION 3: SYSTEM STATS GRID */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionCode}>SYS_METRICS_04</Text>
          <Text style={styles.sectionTitle}>MÉTRIQUES DU SYSTÈME</Text>
        </View>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>RÉGIONS_SYNC</Text>
            <Text style={styles.statValue}>{areasCount}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>RECETTES_LOADED</Text>
            <Text style={styles.statValue}>{recipesCount}</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: COLORS.secondary }]}>
            <Text style={[styles.statLabel, { color: '#000' }]}>STABILITÉ</Text>
            <Text style={[styles.statValue, { color: '#000' }]}>99.9%</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 40 },
  heroSection: { height: 500, borderRadius: 30, overflow: 'hidden', marginHorizontal: 20, marginBottom: 40 },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.6)' },
  heroContent: { flex: 1, padding: 30, justifyContent: 'center' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4, marginBottom: 20 },
  pulse: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.secondary },
  statusText: { color: '#FFF', fontSize: 9, fontWeight: '900', letterSpacing: 2 },
  heroTitle: { color: '#FFF', fontSize: 48, fontWeight: '900', lineHeight: 48, marginBottom: 30 },
  scanBtn: { backgroundColor: COLORS.secondary, paddingVertical: 20, paddingHorizontal: 30, borderRadius: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  scanBtnText: { color: '#000', fontWeight: '900', fontSize: 12, letterSpacing: 2 },
  section: { paddingHorizontal: 20, marginBottom: 40 },
  sectionHeader: { marginBottom: 20 },
  sectionCode: { color: COLORS.secondary, fontSize: 9, fontWeight: '900', letterSpacing: 3, marginBottom: 4 },
  sectionTitle: { color: '#FFF', fontSize: 18, fontWeight: '900', letterSpacing: 1 },
  regionList: { gap: 16 },
  regionCard: { width: 120, height: 120, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', gap: 10 },
  regionName: { color: '#FFF', fontSize: 9, fontWeight: '800', letterSpacing: 1 },
  statsGrid: { flexDirection: 'row', gap: 12 },
  statBox: { flex: 1, backgroundColor: 'rgba(255,255,255,0.02)', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  statLabel: { color: COLORS.textLight, fontSize: 8, fontWeight: '900', letterSpacing: 1, marginBottom: 8 },
  statValue: { color: '#FFF', fontSize: 24, fontWeight: '900' },
});

export default HomeView;
