/**
 * PAGE FAVORIS - Supporte le mode clair/sombre via ThemeContext.
 */
import React from 'react';
import { FlatList, Text, View, StyleSheet, TouchableOpacity, Image, Animated, Easing, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCardWidth, getCols, getPadding } from '../logique/outils/affichage.js';
import { useTheme } from '../logique/design/ThemeContext.js';
import { useEffect, useRef } from 'react';

// --- COMPOSANT : CARTE PLAT (Standardisée) ---
const Card = ({ item, width, openRecipe, toggleFavorite, isFavorite, index = 0 }) => {
  const { theme } = useTheme();
  const favorite = isFavorite(item.idMeal);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.98)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, delay: index * 80, useNativeDriver: false }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 800, delay: index * 80, useNativeDriver: false, easing: Easing.out(Easing.quad) })
    ]).start();
  }, [index]);

  const handlePressIn = () => Animated.spring(pressAnim, { toValue: 0.97, useNativeDriver: false }).start();
  const handlePressOut = () => Animated.spring(pressAnim, { toValue: 1, friction: 4, useNativeDriver: false }).start();

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }, { scale: pressAnim }], width }}>
      <TouchableOpacity 
        style={[styles.recipeCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]} 
        activeOpacity={0.9} 
        onPressIn={handlePressIn} 
        onPressOut={handlePressOut} 
        onPress={() => openRecipe(item.idMeal || item.id_meal)}
      >
        <Image source={{ uri: item.strMealThumb || item.meal_thumb }} style={styles.recipeImage} />
        <View style={styles.recipeContent}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardArea, { color: theme.secondary }]}>ARCHIVE</Text>
            <TouchableOpacity onPress={() => toggleFavorite(item)}>
              <Ionicons name={favorite ? 'bookmark' : 'bookmark-outline'} size={20} color={favorite ? theme.secondary : theme.textMuted} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.recipeTitle, { color: theme.text }]} numberOfLines={1}>{item.strMeal || item.meal_name}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// --- COMPOSANT PRINCIPAL : PAGE FAVORIS ---
export default function PageFavoris({ isMobile, isTablet, windowWidth, favorites, openRecipe, toggleFavorite, isFavorite }) {
  const { theme } = useTheme();

  return (
    <View style={{ paddingHorizontal: getPadding(isMobile), paddingBottom: 100 }}>
      <View style={{ marginBottom: 32 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <View style={{ width: 20, height: 1, backgroundColor: theme.secondary }} />
          <Text style={{ color: theme.secondary, fontSize: 10, fontWeight: '800', letterSpacing: 4 }}>COLLECTION</Text>
        </View>
        <Text style={{ color: theme.text, fontSize: 36, fontWeight: '300', letterSpacing: 1, fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif' }}>Mes Archives</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="bookmark-outline" size={80} color={theme.border} />
          <Text style={[styles.emptyText, { color: theme.textMuted }]}>Votre bibliothèque est vide pour le moment.</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.idMeal}
          numColumns={getCols(isMobile, isTablet)}
          key={getCols(isMobile, isTablet)}
          renderItem={({ item, index }) => (
            <Card 
              item={item} 
              width={getCardWidth(windowWidth, isMobile, isTablet)} 
              openRecipe={openRecipe} 
              toggleFavorite={toggleFavorite} 
              isFavorite={isFavorite} 
              index={index} 
            />
          )}
          scrollEnabled={false}
          columnWrapperStyle={getCols(isMobile, isTablet) > 1 ? { gap: 24 } : null}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  recipeCard: { borderRadius: 4, overflow: 'hidden', marginBottom: 24, borderWidth: 0.5, elevation: 5 },
  recipeImage: { width: '100%', height: 180 },
  recipeContent: { padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardArea: { fontSize: 8, fontWeight: '800', letterSpacing: 2 },
  recipeTitle: { fontSize: 18, fontWeight: '300', letterSpacing: 1 },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { fontSize: 14, marginTop: 20, fontWeight: '300', letterSpacing: 1 }
});
