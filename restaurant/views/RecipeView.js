import React, { useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Dimensions, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const { width } = Dimensions.get('window');

const RecipeView = ({ recipe, isMobile, toggleFavorite, isFavorite, selectedCuisine }) => {
  const contentFade = useRef(new Animated.Value(0)).current;
  const slideIn = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(contentFade, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.spring(slideIn, { toValue: 0, friction: 8, useNativeDriver: true })
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: contentFade, transform: [{ translateY: slideIn }] }]}>
      {/* IMMERSIVE IMAGE FRAME */}
      <View style={[styles.heroFrame, { aspectRatio: isMobile ? 4/3 : 21/9 }]}>
        <Image source={{ uri: recipe.url }} style={styles.heroImage} resizeMode="cover" />
        <View style={styles.heroShadow} />
        
        <TouchableOpacity 
          style={styles.floatingAction}
          onPress={() => toggleFavorite({ idMeal: recipe.idMeal, strMeal: recipe.name, strMealThumb: recipe.url, area: selectedCuisine })}
        >
          <Ionicons 
            name={isFavorite(recipe.idMeal) ? "bookmark" : "bookmark-outline"} 
            size={24} 
            color={COLORS.secondary} 
          />
        </TouchableOpacity>
      </View>
      
      {/* METRIC RIBBON */}
      <View style={styles.ribbon}>
        <View style={styles.ribbonItem}>
          <Ionicons name="time-outline" size={14} color={COLORS.secondary} />
          <Text style={styles.ribbonText}>45 MIN</Text>
        </View>
        <View style={styles.ribbonDot} />
        <View style={styles.ribbonItem}>
          <Ionicons name="people-outline" size={14} color={COLORS.secondary} />
          <Text style={styles.ribbonText}>4 PERSONNES</Text>
        </View>
        <View style={styles.ribbonDot} />
        <View style={styles.ribbonItem}>
          <Ionicons name="wine-outline" size={14} color={COLORS.secondary} />
          <Text style={styles.ribbonText}>SÉLECTION</Text>
        </View>
      </View>

      <Text style={styles.title}>{recipe.name}</Text>
      <View style={styles.titleDivider} />

      <View style={[styles.contentLayout, !isMobile && styles.desktopRow]}>
        {/* INGREDIENTS SECTION */}
        <View style={[styles.section, !isMobile && styles.desktopCol]}>
          <Text style={styles.sectionTitle}>Composition</Text>
          <View style={styles.ingredientsList}>
            {recipe.ingredients.map((ing, i) => (
              <View key={i} style={styles.ingredientRow}>
                <View style={styles.ingDot} />
                <Text style={styles.ingText}>{ing}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* PREPARATION SECTION */}
        <View style={[styles.section, !isMobile && styles.desktopCol, !isMobile && { paddingLeft: 60 }]}>
          <Text style={styles.sectionTitle}>Élaboration</Text>
          {recipe.instructions.map((step, i) => (
            <View key={i} style={styles.stepBlock}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepIndex}>{(i + 1).toString().padStart(2, '0')}</Text>
                <View style={styles.stepLine} />
              </View>
              <Text style={styles.stepContent}>{step}</Text>
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { paddingBottom: 100 },
  heroFrame: { width: '100%', overflow: 'hidden', position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroShadow: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },
  floatingAction: { 
    position: 'absolute', 
    bottom: -25, 
    right: 32, 
    backgroundColor: COLORS.primary, 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderWidth: 0.5, 
    borderColor: COLORS.secondary,
    elevation: 8,
  },
  ribbon: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 20, 
    paddingVertical: 60,
  },
  ribbonItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ribbonText: { fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: '800', letterSpacing: 2 },
  ribbonDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: 'rgba(212, 175, 55, 0.4)' },
  title: { 
    fontSize: 42, 
    fontWeight: '300', 
    color: '#FFF', 
    textAlign: 'center', 
    paddingHorizontal: 24,
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    letterSpacing: 2,
    marginBottom: 20,
  },
  titleDivider: { 
    width: 40, 
    height: 1, 
    backgroundColor: COLORS.secondary, 
    alignSelf: 'center', 
    marginBottom: 60 
  },
  contentLayout: { paddingHorizontal: 32 },
  desktopRow: { flexDirection: 'row' },
  desktopCol: { flex: 1 },
  section: { marginBottom: 60 },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '300', 
    color: COLORS.secondary, 
    letterSpacing: 4, 
    marginBottom: 32,
    textTransform: 'uppercase',
  },
  ingredientsList: { gap: 16 },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  ingDot: { width: 6, height: 1, backgroundColor: COLORS.secondary },
  ingText: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '400', lineHeight: 22 },
  stepBlock: { marginBottom: 40 },
  stepHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12 },
  stepIndex: { color: COLORS.secondary, fontSize: 12, fontWeight: '900', letterSpacing: 2 },
  stepLine: { flex: 1, height: 0.5, backgroundColor: 'rgba(255,255,255,0.05)' },
  stepContent: { color: 'rgba(255,255,255,0.6)', lineHeight: 28, fontSize: 15, fontWeight: '400' },
});

export default RecipeView;

