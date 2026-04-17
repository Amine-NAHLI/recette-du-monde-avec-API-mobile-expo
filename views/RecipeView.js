import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const RecipeView = ({ recipe, isMobile, toggleFavorite, isFavorite, selectedCuisine }) => {
  return (
    <View style={[styles.recipeCard, isMobile && { padding: 16 }]}>
      <View style={[styles.recipeImgFrame, { aspectRatio: isMobile ? 4/3 : 16/7 }, isMobile && { marginBottom: 20 }]}>
        <Image source={{ uri: recipe.url }} style={styles.fullImg} resizeMode="cover" />
        <TouchableOpacity 
          style={styles.floatingFav}
          onPress={() => toggleFavorite({ idMeal: recipe.idMeal, strMeal: recipe.name, strMealThumb: recipe.url, area: selectedCuisine })}
        >
          <MaterialIcons 
            name={isFavorite(recipe.idMeal) ? "favorite" : "favorite-border"} 
            size={24} 
            color={isFavorite(recipe.idMeal) ? '#E63946' : COLORS.textLight} 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.recipeMetaRow}>
        <View style={styles.recipeMetaItem}>
          <Feather name="clock" size={16} color={COLORS.secondary} />
          <Text style={styles.recipeMetaText}>45 MIN</Text>
        </View>
        <View style={styles.recipeMetaItem}>
          <Feather name="users" size={16} color={COLORS.secondary} />
          <Text style={styles.recipeMetaText}>4 PERS.</Text>
        </View>
        <View style={styles.recipeMetaItem}>
          <Feather name="bar-chart" size={16} color={COLORS.secondary} />
          <Text style={styles.recipeMetaText}>MOYEN</Text>
        </View>
      </View>

      <Text style={styles.recipeMainTitle}>{recipe.name}</Text>
      <View style={styles.recipeTitleLine} />

      <View style={[styles.recipeContent, !isMobile && styles.recipeRow]}>
        <View style={[styles.recipeCol, !isMobile && { paddingRight: 40, borderRightWidth: 1, borderRightColor: COLORS.border }]}>
          <Text style={styles.sectionHeading}>INGRÉDIENTS</Text>
          <View style={styles.ingGrid}>
            {recipe.ingredients.map((ing, i) => (
              <View key={i} style={styles.ingCard}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.secondary, marginTop: 6 }} />
                <Text style={{ fontSize: 13, color: COLORS.text, flex: 1, lineHeight: 20 }}>{ing}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.recipeCol, !isMobile && { paddingLeft: 40 }]}>
          <Text style={styles.sectionHeading}>PRÉPARATION</Text>
          {recipe.instructions.map((step, i) => (
            <View key={i} style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <Text style={{ color: COLORS.secondary, fontWeight: '900', fontSize: 12 }}>ÉTAPE {i + 1}</Text>
              </View>
              <Text style={{ color: COLORS.text, lineHeight: 24, fontSize: 14 }}>{step}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  recipeCard: { backgroundColor: COLORS.card, borderRadius: 20, padding: 32, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 30, elevation: 8 },
  recipeImgFrame: { width: '100%', borderRadius: 16, overflow: 'hidden', marginBottom: 32 },
  fullImg: { width: '100%', height: '100%' },
  floatingFav: { position: 'absolute', top: 20, right: 20, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 30, shadowColor: '#000', shadowOpacity: 0.2, elevation: 5 },
  recipeMetaRow: { flexDirection: 'row', gap: 24, marginBottom: 32, paddingBottom: 24, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  recipeMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  recipeMetaText: { fontSize: 11, fontWeight: '800', color: COLORS.text, letterSpacing: 1 },
  recipeMainTitle: { fontSize: 36, fontWeight: '900', color: COLORS.primary, letterSpacing: 0.5, marginBottom: 12 },
  recipeTitleLine: { width: 60, height: 4, backgroundColor: COLORS.secondary, borderRadius: 2, marginBottom: 40 },
  recipeContent: { gap: 40, width: '100%' },
  recipeRow: { flexDirection: 'row' },
  recipeCol: { flex: 1, width: '100%' },
  sectionHeading: { fontSize: 18, fontWeight: '900', color: COLORS.primary, letterSpacing: 2, marginBottom: 24, borderLeftWidth: 5, borderLeftColor: COLORS.secondary, paddingLeft: 20 },
  ingGrid: { gap: 12 },
  ingCard: { flexDirection: 'row', gap: 12, backgroundColor: COLORS.background, padding: 16, borderRadius: 12 },
  stepCard: { marginBottom: 24, backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, borderLeftWidth: 4, borderLeftColor: COLORS.secondary, shadowColor: '#000', shadowOpacity: 0.05, elevation: 2 },
  stepHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
});

export default RecipeView;
