/**
 * PAGE FAVORIS - Fichier regroupé
 * Affiche la liste des recettes sauvegardées par l'utilisateur.
 */
import React from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCardWidth, getCols, getFlagUrl, getPadding } from '../logique/outils/affichage.js';
import { cuisineData } from '../data.js';
import { styles as globalStyles } from '../logique/styles_globaux/styles_partages.js';

// On réutilise le composant Card de la page Exploration pour éviter de dupliquer trop de code
// Note : Dans un vrai projet, Card serait un fichier séparé, mais ici on optimise par page.
import PageExploration from './PageExploration'; 
// On va plutôt extraire Card si possible, mais pour faire simple, on va juste recréer une version légère ici
// ou l'importer si on l'avait exporté. 
// Pour respecter la demande "un seul fichier par page", je vais remettre la logique Card ici.

import { COLORS } from '../logique/design/couleurs.js';
import { Animated, Easing, Image, Platform } from 'react-native';
import { useEffect, useRef } from 'react';

// --- COMPOSANT : CARTE PLAT (Version simplifiée pour Favoris) ---
const DishCard = ({ item, area, width, fadeAnim, scaleAnim, pressAnim, openRecipe, toggleFavorite, isFavorite, handlePressIn, handlePressOut }) => {
  const favorite = isFavorite(item.idMeal);
  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }, { scale: pressAnim }], width }}>
      <TouchableOpacity style={styles.recipeCard} activeOpacity={0.9} onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={() => openRecipe(item.idMeal)}>
        <Image source={{ uri: item.strMealThumb }} style={styles.recipeImage} />
        <View style={styles.recipeContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardArea}>{area.toUpperCase()}</Text>
            <TouchableOpacity onPress={() => toggleFavorite({ idMeal: item.idMeal, strMeal: item.strMeal, strMealThumb: item.strMealThumb, area })}>
              <Ionicons name={favorite ? 'bookmark' : 'bookmark-outline'} size={20} color={favorite ? COLORS.secondary : 'rgba(255,255,255,0.3)'} />
            </TouchableOpacity>
          </View>
          <Text style={styles.recipeTitle} numberOfLines={2}>{item.strMeal}</Text>
          <View style={styles.cardFooter}>
            <View style={styles.luxuryTag}>
              <Ionicons name="time-outline" size={10} color={COLORS.secondary} />
              <Text style={styles.luxuryTagText}>ELABORATION 45M</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const Card = ({ item, width, openRecipe, toggleFavorite, isFavorite, getFlagUrl, index = 0 }) => {
  const area = item.area || 'Global';
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
    <DishCard item={item} area={area} width={width} fadeAnim={fadeAnim} scaleAnim={scaleAnim} pressAnim={pressAnim} openRecipe={openRecipe} toggleFavorite={toggleFavorite} isFavorite={isFavorite} handlePressIn={handlePressIn} handlePressOut={handlePressOut} />
  );
};

import { TouchableOpacity } from 'react-native';

// --- COMPOSANT PRINCIPAL : PAGE FAVORIS ---
export default function PageFavoris({ isMobile, isTablet, windowWidth, favorites, openRecipe, toggleFavorite, isFavorite }) {
  return (
    <View style={{ paddingHorizontal: getPadding(isMobile) }}>
      <View style={globalStyles.sectionHeader}>
        <View style={globalStyles.headerPreBadge}><View style={globalStyles.badgeLine} /><Text style={globalStyles.headerPreText}>COLLECTION</Text></View>
        <Text style={globalStyles.mainTitle}>Mes Archives</Text>
      </View>

      {/* --- ÉTAT VIDE (Si aucun favori n'est enregistré) --- */}
      {favorites.length === 0 ? (
        <View style={globalStyles.emptyState}>
          <Ionicons name="restaurant-outline" size={60} color="rgba(212, 175, 55, 0.1)" />
          <Text style={globalStyles.emptyText}>Votre collection est vide.</Text>
        </View>
      ) : (
        /* --- LISTE DES FAVORIS (Grille de plats) --- */
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.idMeal}
          numColumns={getCols(isMobile, isTablet)}
          key={getCols(isMobile, isTablet)}
          renderItem={({ item, index }) => (
            <Card item={item} width={getCardWidth(windowWidth, isMobile, isTablet)} openRecipe={openRecipe} toggleFavorite={toggleFavorite} isFavorite={isFavorite} getFlagUrl={(area) => getFlagUrl(area, cuisineData)} index={index} />
          )}
          scrollEnabled={false}
          columnWrapperStyle={getCols(isMobile, isTablet) > 1 ? { gap: 24 } : null}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  recipeCard: { flexDirection: 'row', backgroundColor: '#121214', borderRadius: 2, overflow: 'hidden', marginBottom: 20, borderWidth: 0.5, borderColor: 'rgba(212, 175, 55, 0.1)', height: 150 },
  recipeImage: { width: 150, height: 150 },
  recipeContent: { flex: 1, padding: 20, justifyContent: 'space-between' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardArea: { color: COLORS.secondary, fontSize: 8, fontWeight: '800', letterSpacing: 2 },
  recipeTitle: { color: '#FFF', fontSize: 16, fontWeight: '300', fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif', lineHeight: 22 },
  cardFooter: { flexDirection: 'row' },
  luxuryTag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.03)', paddingHorizontal: 10, paddingVertical: 5 },
  luxuryTagText: { color: 'rgba(255,255,255,0.4)', fontSize: 7, fontWeight: '800', letterSpacing: 1 },
});

