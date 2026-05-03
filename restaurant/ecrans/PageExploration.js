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

// --- COMPOSANT : CARTE PLAT (Liste) ---
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

// --- COMPOSANT GÉNÉRIQUE : CARD (Routeur visuel) ---
const Card = (props) => {
  const { item, type, width, openCuisine, openRecipe, toggleFavorite, isFavorite, getFlagUrl, selectedCuisine, index = 0 } = props;
  const isCuisine = type === 'c';
  const area = isCuisine ? item.cuisine : item.area || selectedCuisine || 'Global';
  const flag = getFlagUrl(area);

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

  return isCuisine ? (
    <CuisineCard {...props} flag={flag} fadeAnim={fadeAnim} scaleAnim={scaleAnim} pressAnim={pressAnim} handlePressIn={handlePressIn} handlePressOut={handlePressOut} />
  ) : (
    <DishCard {...props} area={area} fadeAnim={fadeAnim} scaleAnim={scaleAnim} pressAnim={pressAnim} handlePressIn={handlePressIn} handlePressOut={handlePressOut} />
  );
};

// --- COMPOSANT : SECTION FILTRE (Modal) ---
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
            <TouchableOpacity style={[styles.filterItem, filterCountry === "Tous" && styles.filterItemActive]} onPress={() => { setFilterCountry("Tous"); setShowFilter(false); }}>
              <Ionicons name="globe-outline" size={20} color={filterCountry === "Tous" ? COLORS.primary : COLORS.secondary} />
              <Text style={[styles.filterItemText, filterCountry === "Tous" && styles.filterItemTextActive]}>TOUTES LES ORIGINES</Text>
            </TouchableOpacity>
            {areas.map((area, i) => (
              <TouchableOpacity key={i} style={[styles.filterItem, filterCountry === area && styles.filterItemActive]} onPress={() => { setFilterCountry(area); setShowFilter(false); }}>
                <Text style={[styles.itemIndex, filterCountry === area && { color: COLORS.primary }]}>{String(i + 1).padStart(2, '0')}</Text>
                <Text style={[styles.filterItemText, filterCountry === area && styles.filterItemTextActive]}>{area.toUpperCase()}</Text>
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
    <View style={{ paddingHorizontal: getPadding(isMobile) }}>
      <View style={globalStyles.sectionHeader}>
        <View style={globalStyles.headerPreBadge}><View style={globalStyles.badgeLine} /><Text style={globalStyles.headerPreText}>EXPLORATION</Text></View>
        <Text style={globalStyles.mainTitle}>{page === 'cuisines' ? 'Regions du Monde' : selectedCuisine}</Text>
      </View>
      {/* --- BARRE DE FILTRE (Sélecteur de pays) --- */}
      {page === 'cuisines' && <FilterSection showFilter={showFilter} setShowFilter={setShowFilter} filterCountry={filterCountry} setFilterCountry={setFilterCountry} areas={areas} />}

      {/* --- SÉLECTION DU CHEF (Mise en avant du premier plat) --- */}
      {page === 'dishes' && dishes.length > 0 && (
        <View style={globalStyles.heroDishBox}>
          <Card item={dishes[0]} type="d" width={windowWidth - getPadding(isMobile) * 2} openCuisine={openCuisine} openRecipe={openRecipe} toggleFavorite={toggleFavorite} isFavorite={isFavorite} getFlagUrl={(area) => getFlagUrl(area, cuisineData)} selectedCuisine={selectedCuisine} />
          <View style={globalStyles.heroBadge}><Text style={globalStyles.heroBadgeText}>SELECTION DU CHEF</Text></View>
        </View>
      )}

      {/* --- GRILLE DE CONTENU (Cuisines ou Liste des Plats) --- */}
      <FlatList
        data={page === 'dishes' ? dishes.slice(1) : cuisinesList}
        keyExtractor={(item) => item.id || item.cuisine || item.idMeal}
        numColumns={getCols(isMobile, isTablet)}
        key={getCols(isMobile, isTablet)}
        renderItem={({ item, index }) => (
          <Card item={item} type={page === 'cuisines' ? 'c' : 'd'} width={getCardWidth(windowWidth, isMobile, isTablet)} openCuisine={openCuisine} openRecipe={openRecipe} toggleFavorite={toggleFavorite} isFavorite={isFavorite} getFlagUrl={(area) => getFlagUrl(area, cuisineData)} selectedCuisine={selectedCuisine} index={index} />
        )}
        scrollEnabled={false}
        columnWrapperStyle={getCols(isMobile, isTablet) > 1 ? { gap: 24 } : null}
      />
    </View>
  );
}

// --- STYLES ---
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
  cuisineCard: { height: 280, backgroundColor: COLORS.primary, borderRadius: 2, overflow: 'hidden', marginBottom: 24, borderWidth: 0.5, borderColor: 'rgba(5,5,5,0.1)' },
  cuisineImage: { width: '100%', height: '100%', opacity: 0.7 },
  cuisineOverlay: { ...StyleSheet.absoluteFillObject, padding: 24, justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.4)' },
  cuisineTop: { flexDirection: 'row', justifyContent: 'space-between' },
  flag: { width: 30, height: 18, borderRadius: 0, opacity: 0.8 },
  recipeCounter: { backgroundColor: COLORS.secondary, width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  counterText: { color: COLORS.primary, fontSize: 9, fontWeight: '900' },
  cuisinePre: { color: COLORS.secondary, fontSize: 8, fontWeight: '800', letterSpacing: 3, marginBottom: 4 },
  cuisineTitle: { color: '#FFF', fontSize: 24, fontWeight: '300', fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif', letterSpacing: 1 },
  filterContainer: { marginBottom: 40, marginTop: 10 },
  trigger: { backgroundColor: 'rgba(255,255,255,0.02)', borderWidth: 0.5, borderColor: 'rgba(212, 175, 55, 0.3)', paddingHorizontal: 20, paddingVertical: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 2 },
  triggerContent: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  triggerText: { color: COLORS.text, fontSize: 10, fontWeight: '800', letterSpacing: 2.5 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(5,5,5,0.95)', justifyContent: 'center', padding: 30 },
  modalPanel: { backgroundColor: COLORS.primary, maxHeight: '85%', padding: 40, borderWidth: 0.5, borderColor: 'rgba(212, 175, 55, 0.2)' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 50 },
  modalPre: { color: COLORS.secondary, fontSize: 9, fontWeight: '800', letterSpacing: 4, marginBottom: 8 },
  modalTitle: { fontSize: 28, fontWeight: '300', color: '#FFF', fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif' },
  closeBtn: { marginTop: -10, marginRight: -10, padding: 10 },
  filterList: { gap: 2 },
  filterItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 20, paddingHorizontal: 15, backgroundColor: 'rgba(255,255,255,0.01)', gap: 25 },
  filterItemActive: { backgroundColor: COLORS.secondary },
  itemIndex: { color: 'rgba(212, 175, 55, 0.5)', fontSize: 11, fontWeight: '700', width: 25 },
  filterItemText: { fontSize: 13, fontWeight: '400', color: 'rgba(255,255,255,0.6)', letterSpacing: 2 },
  filterItemTextActive: { color: COLORS.primary, fontWeight: '900' },
});

