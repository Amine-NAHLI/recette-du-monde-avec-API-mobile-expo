/**
 * PAGE EXPLORATION - Fichier regroupé
 * Gère l'affichage des cuisines (pays) et des plats associés.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, FlatList, Image, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../logique/design/couleurs.js';
import { getCardWidth, getCols, getFlagUrl, getPadding } from '../logique/outils/affichage.js';
import { cuisineData } from '../data.js';
import { styles as globalStyles } from '../logique/styles_globaux/styles_partages.js';

// --- COMPOSANT : CARTE CUISINE (Grille) ---
const CuisineCard = ({ item, width, flag, fadeAnim, scaleAnim, pressAnim, openCuisine, handlePressIn, handlePressOut }) => (
  <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }, { scale: pressAnim }], width }}>
    <TouchableOpacity style={styles.cuisineCard} activeOpacity={0.9} onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={() => openCuisine(item.cuisine)}>
      <Image source={{ uri: item.image }} style={styles.cuisineImage} />
      <View style={styles.cuisineOverlay}>
        <View style={styles.cuisineTop}>
          {flag && <Image source={{ uri: flag }} style={styles.flag} />}
          <View style={styles.recipeCounter}><Text style={styles.counterText}>{item.count}</Text></View>
        </View>
        <View>
          <Text style={styles.cuisinePre}>HERITAGE</Text>
          <Text style={styles.cuisineTitle}>{item.cuisine.toUpperCase()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  </Animated.View>
);

// --- COMPOSANT : CARTE PLAT (Verticale Premium) ---
const DishCard = ({ item, area, width, fadeAnim, scaleAnim, pressAnim, openRecipe, toggleFavorite, isFavorite, handlePressIn, handlePressOut }) => {
  const favorite = isFavorite(item.idMeal);
  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }, { scale: pressAnim }], width }}>
      <TouchableOpacity style={styles.recipeCard} activeOpacity={0.9} onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={() => openRecipe(item.idMeal)}>
        <Image source={{ uri: item.strMealThumb }} style={styles.recipeImage} />
        <View style={styles.recipeContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardArea}>{area.toUpperCase()}</Text>
            <TouchableOpacity onPress={() => toggleFavorite(item)}>
              <Ionicons name={favorite ? 'bookmark' : 'bookmark-outline'} size={20} color={favorite ? COLORS.secondary : 'rgba(255,255,255,0.3)'} />
            </TouchableOpacity>
          </View>
          <Text style={styles.recipeTitle} numberOfLines={1}>{item.strMeal}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// --- COMPOSANT GÉNÉRIQUE : CARD ---
const Card = (props) => {
  const { item, type, openCuisine, openRecipe, toggleFavorite, isFavorite, getFlagUrl, selectedCuisine, index } = props;
  const isCuisine = type === 'c';
  const area = isCuisine ? item.cuisine : item.area || selectedCuisine || 'Global';
  const flag = isCuisine ? getFlagUrl(area) : null;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, delay: index * 50, useNativeDriver: false }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 8, useNativeDriver: false })
    ]).start();
  }, []);

  const handlePressIn = () => Animated.spring(pressAnim, { toValue: 0.97, useNativeDriver: false }).start();
  const handlePressOut = () => Animated.spring(pressAnim, { toValue: 1, friction: 4, useNativeDriver: false }).start();

  if (isCuisine) {
    return (
      <CuisineCard 
        {...props} 
        flag={flag} 
        fadeAnim={fadeAnim} 
        scaleAnim={scaleAnim} 
        pressAnim={pressAnim} 
        handlePressIn={handlePressIn} 
        handlePressOut={handlePressOut} 
      />
    );
  }

  return (
    <DishCard 
      {...props} 
      area={area} 
      fadeAnim={fadeAnim} 
      scaleAnim={scaleAnim} 
      pressAnim={pressAnim} 
      handlePressIn={handlePressIn} 
      handlePressOut={handlePressOut} 
    />
  );
};

// --- SECTION FILTRE ---
const FilterSection = ({ showFilter, setShowFilter, filterCountry, setFilterCountry, areas }) => (
  <View style={styles.filterContainer}>
    <TouchableOpacity style={styles.trigger} activeOpacity={0.8} onPress={() => setShowFilter(true)}>
      <View style={styles.triggerContent}>
        <Ionicons name="map-outline" size={18} color={COLORS.secondary} />
        <Text style={styles.triggerText}>{filterCountry === "Tous" ? "SÉLECTIONNER UNE RÉGION" : filterCountry.toUpperCase()}</Text>
      </View>
      <Feather name="chevron-down" size={16} color={COLORS.secondary} />
    </TouchableOpacity>
    <Modal visible={showFilter} transparent animationType="fade">
      <View style={styles.modalBackdrop}>
        <View style={styles.modalPanel}>
          <View style={styles.modalHeader}>
            <View><Text style={styles.modalPre}>GASTRONOMIE</Text><Text style={styles.modalTitle}>Répertoire Global</Text></View>
            <TouchableOpacity onPress={() => setShowFilter(false)} style={styles.closeBtn}><Feather name="x" size={24} color={COLORS.text} /></TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.filterList}>
            {["Tous", ...areas].map((area, i) => (
              <TouchableOpacity key={i} style={[styles.filterItem, filterCountry === area && styles.filterItemActive]} onPress={() => { setFilterCountry(area); setShowFilter(false); }}>
                <Text style={[styles.filterItemText, filterCountry === area && styles.filterItemTextActive]}>
                  {area === "Tous" ? "TOUTES LES ORIGINES" : area.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  </View>
);

// --- COMPOSANT PRINCIPAL : PAGE EXPLORATION ---
export default function PageExploration({ page, isMobile, isTablet, windowWidth, showFilter, setShowFilter, filterCountry, setFilterCountry, areas, selectedCuisine, cuisinesDict, cuisinesList, openCuisine, openRecipe, toggleFavorite, isFavorite }) {
  const dishes = cuisinesDict[selectedCuisine] || [];
  
  return (
    <View style={{ paddingHorizontal: getPadding(isMobile), paddingBottom: 100 }}>
      <View style={globalStyles.sectionHeader}>
        <View style={globalStyles.headerPreBadge}><View style={globalStyles.badgeLine} /><Text style={globalStyles.headerPreText}>EXPLORATION</Text></View>
        <Text style={globalStyles.mainTitle}>{page === 'cuisines' ? 'Regions du Monde' : selectedCuisine}</Text>
      </View>
      
      {page === 'cuisines' && <FilterSection showFilter={showFilter} setShowFilter={setShowFilter} filterCountry={filterCountry} setFilterCountry={setFilterCountry} areas={areas} />}

      <FlatList
        data={page === 'dishes' ? dishes : cuisinesList}
        keyExtractor={(item, index) => item.idMeal || item.cuisine || index.toString()}
        numColumns={getCols(isMobile, isTablet)}
        key={getCols(isMobile, isTablet)}
        renderItem={({ item, index }) => (
          <Card 
            item={item} 
            type={page === 'cuisines' ? 'c' : 'd'} 
            width={getCardWidth(windowWidth, isMobile, isTablet)} 
            openCuisine={openCuisine} 
            openRecipe={openRecipe} 
            toggleFavorite={toggleFavorite} 
            isFavorite={isFavorite} 
            getFlagUrl={(area) => getFlagUrl(area, cuisineData)}
            selectedCuisine={selectedCuisine} 
            index={index} 
          />
        )}
        scrollEnabled={false}
        columnWrapperStyle={getCols(isMobile, isTablet) > 1 ? { gap: 24 } : null}
      />
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
  cuisineCard: { height: 280, backgroundColor: COLORS.primary, borderRadius: 2, overflow: 'hidden', marginBottom: 24, borderWidth: 0.5, borderColor: 'rgba(5,5,5,0.1)' },
  cuisineImage: { width: '100%', height: '100%', opacity: 0.7 },
  cuisineOverlay: { ...StyleSheet.absoluteFillObject, padding: 24, justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.4)' },
  cuisineTop: { flexDirection: 'row', justifyContent: 'space-between' },
  flag: { width: 30, height: 18, borderRadius: 0, opacity: 0.8 },
  recipeCounter: { backgroundColor: COLORS.secondary, width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  counterText: { color: COLORS.primary, fontSize: 9, fontWeight: '900' },
  cuisinePre: { color: COLORS.secondary, fontSize: 8, fontWeight: '800', letterSpacing: 3, marginBottom: 4 },
  cuisineTitle: { color: '#FFF', fontSize: 24, fontWeight: '300', letterSpacing: 1 },
  filterContainer: { marginBottom: 40, marginTop: 10 },
  trigger: { backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 0.5, borderColor: 'rgba(212, 175, 55, 0.3)', paddingHorizontal: 20, paddingVertical: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 2 },
  triggerContent: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  triggerText: { color: COLORS.text, fontSize: 10, fontWeight: '800', letterSpacing: 2.5 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(5,5,5,0.95)', justifyContent: 'center', padding: 30 },
  modalPanel: { backgroundColor: COLORS.primary, maxHeight: '85%', padding: 40, borderWidth: 0.5, borderColor: 'rgba(212, 175, 55, 0.2)' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 50 },
  modalPre: { color: COLORS.secondary, fontSize: 9, fontWeight: '800', letterSpacing: 4, marginBottom: 8 },
  modalTitle: { fontSize: 28, fontWeight: '300', color: '#FFF' },
  closeBtn: { marginTop: -10, marginRight: -10, padding: 10 },
  filterList: { gap: 2 },
  filterItem: { paddingVertical: 20, paddingHorizontal: 15, backgroundColor: 'rgba(255,255,255,0.01)' },
  filterItemActive: { backgroundColor: COLORS.secondary },
  filterItemText: { fontSize: 13, fontWeight: '400', color: 'rgba(255,255,255,0.6)', letterSpacing: 2 },
  filterItemTextActive: { color: COLORS.primary, fontWeight: '900' },
});
