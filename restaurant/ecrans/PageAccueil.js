/**
 * PAGE D'ACCUEIL - Fichier regroupé
 * Contient le Hero, les Régions de Prestige et les Statistiques.
 * Supporte le mode clair/sombre via ThemeContext.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../logique/design/ThemeContext.js';

// --- DONNÉES STATIQUES (Régions) ---
const PRESTIGE_REGIONS = [
  { name: 'Italie', tech: 'Italian', icon: 'pizza-outline', desc: 'Tresors Mediterraneens' },
  { name: 'Chine', tech: 'Chinese', icon: 'restaurant-outline', desc: 'Dynasties Epicees' },
  { name: 'France', tech: 'French', icon: 'wine-outline', desc: 'Haute Gastronomie' },
  { name: 'Japon', tech: 'Japanese', icon: 'leaf-outline', desc: 'Serenite Culinaire' },
];  

// --- COMPOSANT : SECTION HERO (Bannière) ---
const HeroSection = ({ scaleImage, setPage, user, promptAsync, logout }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.heroSection}>
      <Animated.Image
        source={{ uri: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200' }}
        style={[StyleSheet.absoluteFillObject, { transform: [{ scale: scaleImage }] }]}
      />  
      <View style={[styles.heroOverlay, { backgroundColor: theme.isDark ? 'rgba(5,5,5,0.7)' : 'rgba(0,0,0,0.45)' }]} />
      <View style={styles.heroContent}>
        <View style={[styles.prestigeBadge, { borderLeftColor: theme.secondary }]}>
          <View style={[styles.crownDot, { backgroundColor: theme.secondary }]} />
          <Text style={[styles.prestigeText, { color: theme.secondary }]}>SIGNATURE COLLECTION</Text>
        </View>
        <Text style={styles.heroTitle}>L'EXCELLENCE{'\n'}DANS CHAQUE{'\n'}DETAIL</Text>
        <Text style={styles.heroSub}>Une odyssee sensorielle a travers les saveurs les plus raffinees du globe.</Text>
        
        {user && (
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              {user.user_metadata?.avatar_url ? (
                <Animated.Image 
                  source={{ uri: user.user_metadata.avatar_url }} 
                  style={[styles.avatar, { borderColor: theme.secondary }]} 
                />
              ) : (
                <Ionicons name="person-circle" size={50} color={theme.secondary} />
              )}
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user.user_metadata?.full_name || 'Utilisateur'}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <View style={[styles.badgeMember, { backgroundColor: theme.secondary }]}>
                <Text style={[styles.badgeMemberText, { color: theme.primary }]}>MEMBRE GOURMET</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.btnGroup}>
          <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: theme.secondary }]} onPress={() => setPage('cuisines')}>
            <Text style={[styles.primaryBtnText, { color: theme.isDark ? theme.primary : '#FFF' }]}>DÉCOUVRIR LE MONDE</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.isDark ? theme.primary : '#FFF'} />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={user ? logout : promptAsync} 
            style={[styles.primaryBtn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.secondary }]}
          >
            <MaterialCommunityIcons name={user ? "logout" : "google"} size={18} color={theme.secondary} />
            <Text style={[styles.primaryBtnText, { color: theme.secondary }]}>
              {user ? "DÉCONNEXION" : "CONNEXION"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// --- COMPOSANT : RÉGIONS DE PRESTIGE (Scroll Horizontal) ---
const PrestigeRegions = ({ openCuisine }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionPre, { color: theme.secondary }]}>SELECTION</Text>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Regions de Prestige</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.regionScroll}>
        {PRESTIGE_REGIONS.map((region, index) => (
          <TouchableOpacity key={`${region.name}-${index}`} style={[styles.regionCard, { backgroundColor: theme.card, borderColor: theme.border }]} onPress={() => openCuisine(region.tech)}>
            <View style={styles.regionIconBox}>
              <Ionicons name={region.icon} size={28} color={theme.secondary} />
            </View>
            <Text style={[styles.regionName, { color: theme.text }]}>{region.name}</Text>
            <Text style={[styles.regionDesc, { color: theme.textMuted }]}>{region.desc}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// --- COMPOSANT : SECTION STATISTIQUES ---
const StatsSection = ({ areasCount, recipesCount }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.section}>
      <View style={[styles.statsRow, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: theme.text }]}>{areasCount}</Text>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>CUISINES SYNC</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: theme.text }]}>{recipesCount}</Text>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>RECETTES PRETES</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
        <View style={styles.statBox}>
          <Ionicons name="ribbon-outline" size={24} color={theme.secondary} />
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>ELUE APP #1</Text>
        </View>
      </View>
    </View>
  );
};

// --- COMPOSANT PRINCIPAL : PAGE ACCUEIL ---
const PageAccueil = ({ isMobile, setPage, areasCount, recipesCount, user, promptAsync, logout, openCuisine }) => {
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
      <PrestigeRegions openCuisine={openCuisine} />

      {/* --- SECTION 3 : STATISTIQUES (Compteurs de recettes) --- */}
      <StatsSection areasCount={areasCount} recipesCount={recipesCount} />
    </Animated.View>
  );
};

// --- STYLES ---
const styles = StyleSheet.create({
  container: { paddingBottom: 60 },
  heroSection: { height: 480, overflow: 'hidden', marginBottom: 40 },
  heroOverlay: { ...StyleSheet.absoluteFillObject },
  heroContent: { flex: 1, padding: 32, justifyContent: 'center', paddingTop: 40 },
  prestigeBadge: { flexDirection: 'row', alignItems: 'center', gap: 10, borderLeftWidth: 1, paddingLeft: 12, marginBottom: 24 },
  crownDot: { width: 4, height: 4, borderRadius: 2 },
  prestigeText: { fontSize: 10, fontWeight: '800', letterSpacing: 4 },
  heroTitle: { color: '#FFF', fontSize: 32, fontWeight: '300', lineHeight: 42, marginBottom: 16, fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif', letterSpacing: 2 },
  heroSub: { color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 22, maxWidth: '90%', marginBottom: 32, fontWeight: '400' },
  primaryBtn: { paddingVertical: 14, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', gap: 10 },
  primaryBtnText: { fontWeight: '900', fontSize: 10, letterSpacing: 1.5 },
  btnGroup: { flexDirection: 'column', gap: 12, alignItems: 'stretch' },
  profileCard: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.05)', padding: 12, borderRadius: 10, marginBottom: 20, alignItems: 'center', borderWidth: 0.5, borderColor: 'rgba(212, 175, 55, 0.2)' },
  avatarContainer: { marginRight: 16 },
  avatar: { width: 40, height: 40, borderRadius: 20, borderWidth: 1 },
  profileInfo: { flex: 1 },
  userName: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  userEmail: { color: 'rgba(255,255,255,0.5)', fontSize: 11, marginBottom: 6 },
  badgeMember: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start' },
  badgeMemberText: { fontSize: 8, fontWeight: '900' },
  section: { paddingHorizontal: 24, marginBottom: 50 },
  sectionHeader: { marginBottom: 24 },
  sectionPre: { fontSize: 9, fontWeight: '800', letterSpacing: 4, marginBottom: 8 },
  sectionTitle: { fontSize: 24, fontWeight: '300', fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif' },
  regionScroll: { gap: 16 },
  regionCard: { width: 140, padding: 16, borderRadius: 2, borderWidth: 0.5 },
  regionIconBox: { marginBottom: 16 },
  regionName: { fontSize: 14, fontWeight: '700', marginBottom: 4 },
  regionDesc: { fontSize: 9, fontWeight: '500' },
  statsRow: { flexDirection: 'row', paddingVertical: 32, borderRadius: 2, borderWidth: 0.5 },
  statBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 28, fontWeight: '300', marginBottom: 4, fontFamily: 'serif' },
  statLabel: { fontSize: 8, fontWeight: '900', letterSpacing: 2 },
  statDivider: { width: 0.5, height: '60%', alignSelf: 'center' },
});

export default PageAccueil;
