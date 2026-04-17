import React, { useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const RecipeView = ({ recipe, isMobile, toggleFavorite, isFavorite, selectedCuisine }) => {
  // ADVANCED ANIMATIONS
  const scanAnim = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const slideIn = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Scan Line Animation Loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: 1, duration: 2500, easing: Easing.linear, useNativeDriver: true }),
        Animated.timing(scanAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
      ])
    ).start();

    // Content Fade-in
    Animated.parallel([
      Animated.timing(contentFade, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideIn, { toValue: 0, duration: 800, easing: Easing.out(Easing.exp), useNativeDriver: true })
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: contentFade, transform: [{ translateY: slideIn }] }]}>
      {/* BENTO HEADER: LARGE IMAGE + QUICK STATS */}
      <View style={[styles.bentoHeader, !isMobile && styles.bentoHeaderDesktop]}>
        <View style={styles.mainImageWrapper}>
          <Image source={{ uri: recipe.url }} style={styles.heroImg} />
          
          {/* ADVANCED SCAN LINE */}
          <Animated.View style={[
            styles.scanLine, 
            { transform: [{ translateY: scanAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 300] }) }] }
          ]} />

          <TouchableOpacity 
            style={styles.favBtn}
            onPress={() => toggleFavorite({ idMeal: recipe.idMeal, strMeal: recipe.name, strMealThumb: recipe.url, area: selectedCuisine })}
          >
            <MaterialCommunityIcons 
              name={isFavorite(recipe.idMeal) ? "heart-flash" : "heart-outline"} 
              size={28} 
              color={isFavorite(recipe.idMeal) ? COLORS.accent : '#FFF'} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.quickInfo}>
          <Text style={styles.recipeCode}>OBJET_{recipe.idMeal}</Text>
          <Text style={styles.mainTitle}>{recipe.name}</Text>
          <View style={styles.tagRow}>
            <View style={styles.statusTag}><Text style={styles.statusText}>ANALYSE_PRÊTE</Text></View>
            <View style={styles.areaTag}><Text style={styles.areaText}>{selectedCuisine || "GLOBAL"}</Text></View>
          </View>
        </View>
      </View>

      {/* MODULAR DATA GRID */}
      <View style={styles.dataGrid}>
        <View style={styles.dataCard}>
          <Feather name="clock" size={20} color={COLORS.secondary} />
          <View>
            <Text style={styles.dataLabel}>TEMPS_ESTIMÉ</Text>
            <Text style={styles.dataValue}>45 MIN</Text>
          </View>
        </View>
        <View style={styles.dataCard}>
          <Feather name="users" size={20} color={COLORS.secondary} />
          <View>
            <Text style={styles.dataLabel}>PORTIONS</Text>
            <Text style={styles.dataValue}>04 PERS.</Text>
          </View>
        </View>
        <View style={styles.dataCard}>
          <Feather name="activity" size={20} color={COLORS.secondary} />
          <View>
            <Text style={styles.dataLabel}>COMPLEXITÉ</Text>
            <Text style={styles.dataValue}>NIVEAU_01</Text>
          </View>
        </View>
      </View>

      {/* BENTO CONTENT: SIDE BY SIDE ON DESKTOP */}
      <View style={[styles.mainBody, !isMobile && styles.mainBodyDesktop]}>
        <View style={[styles.section, !isMobile && { flex: 1 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionCode}>MOD_ING_02</Text>
            <Text style={styles.sectionTitle}>INGRÉDIENTS</Text>
          </View>
          <View style={styles.ingList}>
            {recipe.ingredients.map((ing, i) => (
              <View key={i} style={styles.ingItem}>
                <View style={styles.ingDot} />
                <Text style={styles.ingText}>{ing}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.section, !isMobile && { flex: 1.5 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionCode}>MOD_PROC_04</Text>
            <Text style={styles.sectionTitle}>PROCÉDURE</Text>
          </View>
          {recipe.instructions.map((step, i) => (
            <View key={i} style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepIndex}>SÉQUENCE_{i + 1}</Text>
                <View style={styles.stepLine} />
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.background, gap: 24 },
  bentoHeader: { gap: 20 },
  bentoHeaderDesktop: { flexDirection: 'row', height: 400 },
  mainImageWrapper: { flex: 2, height: 300, borderRadius: 24, overflow: 'hidden', position: 'relative', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  heroImg: { width: '100%', height: '100%' },
  scanLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: COLORS.secondary, shadowColor: COLORS.secondary, shadowOpacity: 1, shadowRadius: 10, zIndex: 5 },
  favBtn: { position: 'absolute', top: 20, right: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 12, borderRadius: 20, zIndex: 10 },
  quickInfo: { flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 24, padding: 30, justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  recipeCode: { color: COLORS.secondary, fontSize: 9, fontWeight: '900', letterSpacing: 2, marginBottom: 8 },
  mainTitle: { color: '#FFF', fontSize: 32, fontWeight: '900', marginBottom: 20 },
  tagRow: { flexDirection: 'row', gap: 10 },
  statusTag: { backgroundColor: 'rgba(57, 255, 20, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  statusText: { color: COLORS.secondary, fontSize: 8, fontWeight: '900' },
  areaTag: { backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  areaText: { color: 'rgba(255,255,255,0.4)', fontSize: 8, fontWeight: '900' },
  dataGrid: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  dataCard: { flex: 1, minWidth: 120, backgroundColor: 'rgba(255,255,255,0.02)', padding: 20, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  dataLabel: { color: 'rgba(255,255,255,0.3)', fontSize: 8, fontWeight: '900' },
  dataValue: { color: '#FFF', fontSize: 16, fontWeight: '900' },
  mainBody: { gap: 24 },
  mainBodyDesktop: { flexDirection: 'row', alignItems: 'flex-start' },
  section: { backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 24, padding: 30, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  sectionHeader: { marginBottom: 24 },
  sectionCode: { color: COLORS.secondary, fontSize: 9, fontWeight: '900', marginBottom: 4 },
  sectionTitle: { color: '#FFF', fontSize: 20, fontWeight: '900' },
  ingList: { gap: 12 },
  ingItem: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(255,255,255,0.02)', padding: 16, borderRadius: 12 },
  ingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.secondary },
  ingText: { color: '#DDD', fontSize: 14, fontWeight: '500' },
  stepCard: { marginBottom: 24 },
  stepHeader: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 10 },
  stepIndex: { color: COLORS.secondary, fontSize: 10, fontWeight: '900' },
  stepLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  stepText: { color: '#AAA', fontSize: 14, lineHeight: 24 }
});

export default RecipeView;
