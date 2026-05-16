/**
 * PAGE EXPLORATION - Fichier regroupé
 * Gère l'affichage des cuisines (pays) et des plats associés.
 * Supporte le mode clair/sombre via ThemeContext.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, FlatList, Image, Modal, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../logique/design/ThemeContext.js';
import { getCardWidth, getCols, getFlagUrl, getPadding } from '../logique/outils/affichage.js';
import { cuisineData } from '../data.js';

// --- COMPOSANT : CARTE CUISINE (Grille) ---
const CuisineCard = ({ item, width, flag, fadeAnim, scaleAnim, pressAnim, openCuisine, handlePressIn, handlePressOut }) => {
  const { theme } = useTheme();
  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }, { scale: pressAnim }], width }}>
      <TouchableOpacity style={[styles.cuisineCard, { backgroundColor: theme.primary, borderColor: theme.border }]} activeOpacity={0.9} onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={() => openCuisine(item.cuisine)}>
        <Image source={{ uri: item.image }} style={styles.cuisineImage} />
        <View style={[styles.cuisineOverlay, { backgroundColor: theme.overlay }]}>
          <View style={styles.cuisineTop}>
            {flag && <Image source={{ uri: flag }} style={styles.flag} />}
            <View style={[styles.recipeCounter, { backgroundColor: theme.secondary }]}><Text style={[styles.counterText, { color: theme.isDark ? theme.primary : '#FFF' }]}>{item.count}</Text></View>
          </View>
          <View>
            <Text style={[styles.cuisinePre, { color: theme.secondary }]}>HERITAGE</Text>
            <Text style={styles.cuisineTitle}>{item.cuisine.toUpperCase()}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// --- COMPOSANT : CARTE PLAT (Verticale Premium) ---
const DishCard = ({ item, area, width, fadeAnim, scaleAnim, pressAnim, openRecipe, toggleFavorite, isFavorite, handlePressIn, handlePressOut }) => {
  const { theme } = useTheme();
  const favorite = isFavorite(item.idMeal);
  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }, { scale: pressAnim }], width }}>
      <TouchableOpacity style={[styles.recipeCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]} activeOpacity={0.9} onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={() => openRecipe(item.idMeal)}>
        <Image source={{ uri: item.strMealThumb }} style={styles.recipeImage} />
        <View style={styles.recipeContent}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardArea, { color: theme.secondary }]}>{area.toUpperCase()}</Text>
            <TouchableOpacity onPress={() => toggleFavorite(item)}>
              <Ionicons name={favorite ? 'bookmark' : 'bookmark-outline'} size={20} color={favorite ? theme.secondary : theme.textMuted} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.recipeTitle, { color: theme.text }]} numberOfLines={1}>{item.strMeal}</Text>
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
const FilterSection = ({ showFilter, setShowFilter, filterCountry, setFilterCountry, areas }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.filterContainer}>
      <TouchableOpacity style={[styles.trigger, { backgroundColor: theme.inputBg, borderColor: theme.border }]} activeOpacity={0.8} onPress={() => setShowFilter(true)}>
        <View style={styles.triggerContent}>
          <Ionicons name="map-outline" size={18} color={theme.secondary} />
          <Text style={[styles.triggerText, { color: theme.text }]}>{filterCountry === "Tous" ? "SÉLECTIONNER UNE RÉGION" : filterCountry.toUpperCase()}</Text>
        </View>
        <Feather name="chevron-down" size={16} color={theme.secondary} />
      </TouchableOpacity>
      <Modal visible={showFilter} transparent animationType="fade">
        <View style={[styles.modalBackdrop, { backgroundColor: theme.modalBg }]}>
          <View style={[styles.modalPanel, { backgroundColor: theme.isDark ? theme.primary : '#FFF', borderColor: theme.border }]}>
            <View style={styles.modalHeader}>
              <View><Text style={[styles.modalPre, { color: theme.secondary }]}>GASTRONOMIE</Text><Text style={[styles.modalTitle, { color: theme.text }]}>Répertoire Global</Text></View>
              <TouchableOpacity onPress={() => setShowFilter(false)} style={styles.closeBtn}><Feather name="x" size={24} color={theme.text} /></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.filterList}>
              {["Tous", ...areas].map((area, i) => (
                <TouchableOpacity key={i} style={[styles.filterItem, { backgroundColor: theme.glass }, filterCountry === area && { backgroundColor: theme.secondary }]} onPress={() => { setFilterCountry(area); setShowFilter(false); }}>
                  <Text style={[styles.filterItemText, { color: theme.textSecondary }, filterCountry === area && { color: theme.isDark ? theme.primary : '#FFF', fontWeight: '900' }]}>
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
};

// --- COMPOSANT PRINCIPAL : PAGE EXPLORATION ---
export default function PageExploration({ page, isMobile, isTablet, windowWidth, showFilter, setShowFilter, filterCountry, setFilterCountry, areas, selectedCuisine, cuisinesDict, cuisinesList, openCuisine, openRecipe, toggleFavorite, isFavorite }) {
  const { theme } = useTheme();
  const dishes = cuisinesDict[selectedCuisine] || [];
  
  return (
    <View style={{ paddingHorizontal: getPadding(isMobile), paddingBottom: 100 }}>
      <View style={{ marginBottom: 32 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <View style={{ width: 20, height: 1, backgroundColor: theme.secondary }} />
          <Text style={{ color: theme.secondary, fontSize: 10, fontWeight: '800', letterSpacing: 4 }}>EXPLORATION</Text>
        </View>
        <Text style={{ color: theme.text, fontSize: 36, fontWeight: '300', letterSpacing: 1, fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif' }}>
          {page === 'cuisines' ? 'Regions du Monde' : selectedCuisine}
        </Text>
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
  recipeCard: { borderRadius: 4, overflow: 'hidden', marginBottom: 24, borderWidth: 0.5, elevation: 5 },
  recipeImage: { width: '100%', height: 180 },
  recipeContent: { padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardArea: { fontSize: 8, fontWeight: '800', letterSpacing: 2 },
  recipeTitle: { fontSize: 18, fontWeight: '300', letterSpacing: 1 },
  cuisineCard: { height: 280, borderRadius: 2, overflow: 'hidden', marginBottom: 24, borderWidth: 0.5 },
  cuisineImage: { width: '100%', height: '100%', opacity: 0.7 },
  cuisineOverlay: { ...StyleSheet.absoluteFillObject, padding: 24, justifyContent: 'space-between' },
  cuisineTop: { flexDirection: 'row', justifyContent: 'space-between' },
  flag: { width: 30, height: 18, borderRadius: 0, opacity: 0.8 },
  recipeCounter: { width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  counterText: { fontSize: 9, fontWeight: '900' },
  cuisinePre: { fontSize: 8, fontWeight: '800', letterSpacing: 3, marginBottom: 4 },
  cuisineTitle: { color: '#FFF', fontSize: 24, fontWeight: '300', letterSpacing: 1 },
  filterContainer: { marginBottom: 40, marginTop: 10 },
  trigger: { borderWidth: 0.5, paddingHorizontal: 20, paddingVertical: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 2 },
  triggerContent: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  triggerText: { fontSize: 10, fontWeight: '800', letterSpacing: 2.5 },
  modalBackdrop: { flex: 1, justifyContent: 'center', padding: 30 },
  modalPanel: { maxHeight: '85%', padding: 40, borderWidth: 0.5 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 50 },
  modalPre: { fontSize: 9, fontWeight: '800', letterSpacing: 4, marginBottom: 8 },
  modalTitle: { fontSize: 28, fontWeight: '300' },
  closeBtn: { marginTop: -10, marginRight: -10, padding: 10 },
  filterList: { gap: 2 },
  filterItem: { paddingVertical: 20, paddingHorizontal: 15 },
  filterItemText: { fontSize: 13, fontWeight: '400', letterSpacing: 2 },
});
