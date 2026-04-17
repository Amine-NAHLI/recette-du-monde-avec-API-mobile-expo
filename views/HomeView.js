import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

const HomeView = ({ isMobile, setPage, areasCount, recipesCount }) => (
  <>
    <View style={[styles.hero, isMobile && { borderRadius: 0, marginTop: -24, marginHorizontal: -24, height: 450 }]}>
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200' }} 
        style={StyleSheet.absoluteFillObject} 
      />
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(26,26,46,0.65)' }]} />
      
      <View style={[styles.heroText, { flex: 1, justifyContent: 'center', padding: isMobile ? 24 : 60 }]}>
        <Text style={styles.heroPre}>GASTRONOMIE MONDIALE</Text>
        <Text style={[styles.heroTitle, { fontSize: isMobile ? 32 : 56, color: '#FFFFFF' }]}>DÉCOUVREZ L'ART CULINAIRE</Text>
        <Text style={[styles.heroSub, { color: 'rgba(255,255,255,0.8)', fontSize: isMobile ? 16 : 20 }]}>Une collection exclusive de recettes authentiques pour les passionnés du goût.</Text>
        <TouchableOpacity style={[styles.cta, { alignSelf: 'flex-start' }]} onPress={() => setPage('cuisines')}>
          <Text style={styles.ctaText}>COMMENCER L'EXPLORATION</Text>
        </TouchableOpacity>
      </View>
    </View>

    <View style={styles.statsRow}>
      <View style={styles.statBox}>
        <Text style={styles.statNum}>{areasCount}</Text>
        <Text style={styles.statLabel}>CUISINES</Text>
      </View>
      <View style={{ width: 1, height: '40%', backgroundColor: COLORS.border }} />
      <View style={styles.statBox}>
        <Text style={styles.statNum}>{recipesCount}</Text>
        <Text style={styles.statLabel}>RECETTES</Text>
      </View>
      <View style={{ width: 1, height: '40%', backgroundColor: COLORS.border }} />
      <View style={styles.statBox}>
        <Text style={styles.statNum}>100%</Text>
        <Text style={styles.statLabel}>AUTHENTIQUE</Text>
      </View>
    </View>
  </>
);

const styles = StyleSheet.create({
  hero: { backgroundColor: COLORS.card, borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 20, elevation: 4 },
  heroPre: { fontSize: 12, color: COLORS.secondary, letterSpacing: 3, marginBottom: 16, fontWeight: '700' },
  heroTitle: { fontWeight: '900', color: COLORS.primary, marginBottom: 20, letterSpacing: 1 },
  heroSub: { color: COLORS.textLight, lineHeight: 28, marginBottom: 32 },
  cta: { backgroundColor: COLORS.primary, paddingVertical: 18, paddingHorizontal: 32, borderRadius: 4 },
  ctaText: { color: '#FFFFFF', fontWeight: '700', letterSpacing: 2, fontSize: 13 },
  statsRow: { 
    flexDirection: 'row', 
    backgroundColor: COLORS.card, 
    marginTop: 24, 
    borderRadius: 12, 
    paddingVertical: 32,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
    alignItems: 'center'
  },
  statBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  statNum: { fontSize: 24, fontWeight: '900', color: COLORS.primary, marginBottom: 4 },
  statLabel: { fontSize: 10, color: COLORS.textLight, letterSpacing: 2, fontWeight: '700' },
});

export default HomeView;
