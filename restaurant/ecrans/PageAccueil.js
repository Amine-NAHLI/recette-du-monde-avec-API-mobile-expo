/**
 * PAGE D'ACCUEIL - Fichier regroupé
 * Contient le Hero, les Régions de Prestige et les Statistiques.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../logique/design/couleurs';

// --- DONNÉES STATIQUES (Régions) ---
const PRESTIGE_REGIONS = [
  { name: 'Italie', tech: 'Italian', icon: 'pizza-outline', desc: 'Tresors Mediterraneens' },
  { name: 'Chine', tech: 'Chinese', icon: 'restaurant-outline', desc: 'Dynasties Epicees' },
  { name: 'France', tech: 'French', icon: 'wine-outline', desc: 'Haute Gastronomie' },
  { name: 'Japon', tech: 'Japanese', icon: 'leaf-outline', desc: 'Serenite Culinaire' },
];  

// --- COMPOSANT : SECTION HERO (Bannière) ---
const HeroSection = ({ scaleImage, setPage, user, promptAsync, logout }) => (
  <View style={styles.heroSection}>
    <Animated.Image
      source={{ uri: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200' }}
      style={[StyleSheet.absoluteFillObject, { transform: [{ scale: scaleImage }] }]}
    />  
    <View style={styles.heroOverlay} />
    <View style={styles.heroContent}>
      <View style={styles.prestigeBadge}>
        <View style={styles.crownDot} />
        <Text style={styles.prestigeText}>SIGNATURE COLLECTION</Text>
      </View>
      <Text style={styles.heroTitle}>L'EXCELLENCE{'\n'}DANS CHAQUE{'\n'}DETAIL</Text>
      <Text style={styles.heroSub}>Une odyssee sensorielle a travers les saveurs les plus raffinees du globe.</Text>
      
      {user && (
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {user.user_metadata?.avatar_url ? (
              <Animated.Image 
                source={{ uri: user.user_metadata.avatar_url }} 
                style={styles.avatar} 
              />
            ) : (
              <Ionicons name="person-circle" size={50} color={COLORS.secondary} />
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user.user_metadata?.full_name || 'Utilisateur'}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={styles.badgeMember}>
              <Text style={styles.badgeMemberText}>MEMBRE GOURMET</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.btnGroup}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => setPage('cuisines')}>
          <Text style={styles.primaryBtnText}>DÉCOUVRIR LE MONDE</Text>
          <Ionicons name="chevron-forward" size={18} color={COLORS.primary} />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={user ? logout : promptAsync} 
          style={[styles.primaryBtn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.secondary }]}
        >
          <MaterialCommunityIcons name={user ? "logout" : "google"} size={18} color={COLORS.secondary} />
          <Text style={[styles.primaryBtnText, { color: COLORS.secondary }]}>
            {user ? "DÉCONNEXION" : "CONNEXION"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

// --- COMPOSANT : RÉGIONS DE PRESTIGE (Scroll Horizontal) ---
const PrestigeRegions = ({ openCuisine }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionPre}>SELECTION</Text>
      <Text style={styles.sectionTitle}>Regions de Prestige</Text>
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.regionScroll}>
      {PRESTIGE_REGIONS.map((region, index) => (
        <TouchableOpacity key={`${region.name}-${index}`} style={styles.regionCard} onPress={() => openCuisine(region.tech)}>
          <View style={styles.regionIconBox}>
            <Ionicons name={region.icon} size={28} color={COLORS.secondary} />
          </View>
          <Text style={styles.regionName}>{region.name}</Text>
          <Text style={styles.regionDesc}>{region.desc}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

// --- COMPOSANT : SECTION STATISTIQUES ---
const StatsSection = ({ areasCount, recipesCount }) => (
  <View style={styles.section}>
    <View style={styles.statsRow}>
      <View style={styles.statBox}>
        <Text style={styles.statValue}>{areasCount}</Text>
        <Text style={styles.statLabel}>CUISINES SYNC</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statBox}>
        <Text style={styles.statValue}>{recipesCount}</Text>
        <Text style={styles.statLabel}>RECETTES PRETES</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statBox}>
        <Ionicons name="ribbon-outline" size={24} color={COLORS.secondary} />
        <Text style={styles.statLabel}>ELUE APP #1</Text>
      </View>
    </View>
  </View>
);

// --- COMPOSANT PRINCIPAL : PAGE ACCUEIL ---
const PageAccueil = ({ isMobile, setPage, areasCount, recipesCount, user, promptAsync, logout }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleImage = useRef(new Animated.Value(1.1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1200, useNativeDriver: false }),
      Animated.spring(slideAnim, { toValue: 0, friction: 8, useNativeDriver: false }),
      Animated.timing(scaleImage, { toValue: 1, duration: 2000, useNativeDriver: false })
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      {/* --- SECTION 1 : BANNIÈRE HERO (Image + Bouton Explorer) --- */}
      <HeroSection 
        scaleImage={scaleImage} 
        setPage={setPage} 
        user={user} 
        promptAsync={promptAsync} 
        logout={logout} 
      />

      {/* --- SECTION 2 : RÉGIONS DE PRESTIGE (Italie, Chine, etc.) --- */}
      <PrestigeRegions setPage={setPage} />

      {/* --- SECTION 3 : STATISTIQUES (Compteurs de recettes) --- */}
      <StatsSection areasCount={areasCount} recipesCount={recipesCount} />
    </Animated.View>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  container: { paddingBottom: 60 },
  heroSection: { height: 560, overflow: 'hidden', marginBottom: 50 },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(5,5,5,0.7)' },
  heroContent: { flex: 1, padding: 32, justifyContent: 'center', paddingTop: 100 },
  prestigeBadge: { flexDirection: 'row', alignItems: 'center', gap: 10, borderLeftWidth: 1, borderLeftColor: COLORS.secondary, paddingLeft: 12, marginBottom: 24 },
  crownDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: COLORS.secondary },
  prestigeText: { color: COLORS.secondary, fontSize: 10, fontWeight: '800', letterSpacing: 4 },
  heroTitle: { color: '#FFF', fontSize: 42, fontWeight: '300', lineHeight: 52, marginBottom: 24, fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif', letterSpacing: 2 },
  heroSub: { color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 24, maxWidth: '85%', marginBottom: 40, fontWeight: '400' },
  primaryBtn: { backgroundColor: COLORS.secondary, paddingVertical: 18, paddingHorizontal: 28, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 12 },
  primaryBtnText: { color: COLORS.primary, fontWeight: '900', fontSize: 11, letterSpacing: 2 },
  btnGroup: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  profileCard: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 12, marginBottom: 24, alignItems: 'center', borderWidth: 0.5, borderColor: 'rgba(212, 175, 55, 0.2)' },
  avatarContainer: { marginRight: 16 },
  avatar: { width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: COLORS.secondary },
  profileInfo: { flex: 1 },
  userName: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  userEmail: { color: 'rgba(255,255,255,0.5)', fontSize: 11, marginBottom: 6 },
  badgeMember: { backgroundColor: COLORS.secondary, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start' },
  badgeMemberText: { color: COLORS.primary, fontSize: 8, fontWeight: '900' },
  section: { paddingHorizontal: 24, marginBottom: 50 },
  sectionHeader: { marginBottom: 24 },
  sectionPre: { color: COLORS.secondary, fontSize: 9, fontWeight: '800', letterSpacing: 4, marginBottom: 8 },
  sectionTitle: { color: '#FFF', fontSize: 24, fontWeight: '300', fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif' },
  regionScroll: { gap: 16 },
  regionCard: { width: 160, padding: 24, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 2, borderWidth: 0.5, borderColor: 'rgba(212, 175, 55, 0.1)' },
  regionIconBox: { marginBottom: 16 },
  regionName: { color: '#FFF', fontSize: 14, fontWeight: '700', marginBottom: 4 },
  regionDesc: { color: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: '500' },
  statsRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.01)', paddingVertical: 32, borderRadius: 2, borderWidth: 0.5, borderColor: 'rgba(212, 175, 55, 0.1)' },
  statBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  statValue: { color: '#FFF', fontSize: 28, fontWeight: '300', marginBottom: 4, fontFamily: 'serif' },
  statLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 8, fontWeight: '900', letterSpacing: 2 },
  statDivider: { width: 0.5, height: '60%', backgroundColor: 'rgba(212, 175, 55, 0.2)', alignSelf: 'center' },
});

export default PageAccueil;

