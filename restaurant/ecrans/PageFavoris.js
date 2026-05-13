import React from 'react';
import { FlatList, Text, View, StyleSheet, TouchableOpacity, Image, Animated, Easing, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCardWidth, getCols, getPadding } from '../logique/outils/affichage.js';
import { styles as globalStyles } from '../logique/styles_globaux/styles_partages.js';
import { COLORS } from '../logique/design/couleurs.js';
import { useEffect, useRef } from 'react';

// --- COMPOSANT : CARTE PLAT (Standardisée) ---
const Card = ({ item, width, openRecipe, toggleFavorite, isFavorite, index = 0 }) => {
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
        style={styles.recipeCard} 
        activeOpacity={0.9} 
        onPressIn={handlePressIn} 
        onPressOut={handlePressOut} 
        onPress={() => openRecipe(item.idMeal || item.id_meal)}
      >
        <Image source={{ uri: item.strMealThumb || item.meal_thumb }} style={styles.recipeImage} />
        <View style={styles.recipeContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardArea}>ARCHIVE</Text>
            <TouchableOpacity onPress={() => toggleFavorite(item)}>
              <Ionicons name={favorite ? 'bookmark' : 'bookmark-outline'} size={20} color={favorite ? COLORS.secondary : 'rgba(255,255,255,0.3)'} />
            </TouchableOpacity>
          </View>
          <Text style={styles.recipeTitle} numberOfLines={1}>{item.strMeal || item.meal_name}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// --- COMPOSANT PRINCIPAL : PAGE FAVORIS ---
export default function PageFavoris({ isMobile, isTablet, windowWidth, favorites, openRecipe, toggleFavorite, isFavorite }) {
  return (
    <View style={{ paddingHorizontal: getPadding(isMobile), paddingBottom: 100 }}>
      <View style={globalStyles.sectionHeader}>
        <View style={globalStyles.headerPreBadge}><View style={globalStyles.badgeLine} /><Text style={globalStyles.headerPreText}>COLLECTION</Text></View>
        <Text style={globalStyles.mainTitle}>Mes Archives</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="bookmark-outline" size={80} color="rgba(212, 175, 55, 0.05)" />
          <Text style={styles.emptyText}>Votre bibliothèque est vide pour le moment.</Text>
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
  recipeCard: { backgroundColor: '#121214', borderRadius: 4, overflow: 'hidden', marginBottom: 24, borderWidth: 0.5, borderColor: 'rgba(212, 175, 55, 0.1)', elevation: 5 },
  recipeImage: { width: '100%', height: 180 },
  recipeContent: { padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardArea: { color: COLORS.secondary, fontSize: 8, fontWeight: '800', letterSpacing: 2 },
  recipeTitle: { color: '#FFF', fontSize: 18, fontWeight: '300', letterSpacing: 1 },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { color: 'rgba(255,255,255,0.3)', fontSize: 14, marginTop: 20, fontWeight: '300', letterSpacing: 1 }
});

