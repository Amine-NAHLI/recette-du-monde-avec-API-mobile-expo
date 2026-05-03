/**
 * Composant racine de l application La Reserve (Expo / React Native).
 * - En-tete, fil d Ariane, zone de defilement principale, barre du bas.
 * - Choix de la page via useMealBrowser : home, cuisines, dishes, favorites, recipe.
 * - Favoris persistes via useFavorites (AsyncStorage).
 */
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  useWindowDimensions,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from './restaurant/logique/design/couleurs.js';
import { getPadding } from './restaurant/logique/outils/affichage.js';
import useFavorites from './restaurant/logique/gestionnaires/favoris.js';
import useMealBrowser from './restaurant/logique/gestionnaires/navigation.js';
import LoadingScreen from './restaurant/composants_partages/components/LoadingScreen';
import Header from './restaurant/composants_partages/components/Header';
import Breadcrumbs from './restaurant/composants_partages/components/Breadcrumbs';
import BottomNav from './restaurant/composants_partages/components/BottomNav';
import PageAccueil from './restaurant/ecrans/PageAccueil';
import PageExploration from './restaurant/ecrans/PageExploration';
import PageFavoris from './restaurant/ecrans/PageFavoris';
import PageRecette from './restaurant/ecrans/PageRecette';
import { styles } from './restaurant/logique/styles_globaux/styles_partages.js';

export default function App() {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const [ready, setReady] = useState(false);
  const scrollRef = useRef(null);

  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const {
    page,
    selectedCuisine,
    selectedDishId,
    cuisinesDict,
    areas,
    recipeCache,
    loading,
    initLoading,
    showFilter,
    filterCountry,
    error,
    setPage,
    setShowFilter,
    setFilterCountry,
    loadContent,
    openCuisine,
    openRecipe,
    goHome,
    goCuisines,
    goFavorites,
    cuisinesList,
    totalRecipesCount,
  } = useMealBrowser();

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, [page, selectedCuisine, selectedDishId]);

  if (!ready) return (
    <View style={{ flex: 1 }}>
      <LoadingScreen onFinish={() => setReady(true)} />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
      {/* [NAVIGATION GLOBALE] Header fixe + breadcrumb + contenu + navigation bas */}
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <Header isMobile={isMobile} goFavorites={goFavorites} favCount={favorites.length} />

      <ScrollView 
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.mainScroll, { paddingBottom: 120 }]}
      >
        <View style={styles.pageBody}>
          {page !== 'home' && (
            <View style={{ paddingHorizontal: getPadding(isMobile) }}>
              <Breadcrumbs 
                page={page} isMobile={isMobile} goHome={goHome} goCuisines={goCuisines} 
                openCuisine={openCuisine} selectedCuisine={selectedCuisine}
                dishName={page === 'recipe' && recipeCache[selectedDishId]?.name}
              />
            </View>
          )}

          {error && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle-outline" size={24} color={COLORS.secondary} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={loadContent}><Text style={styles.retryLink}>RÉESSAYER</Text></TouchableOpacity>
            </View>
          )}

          {(initLoading || loading) && (
            <View style={styles.globalLoader}>
              <ActivityIndicator size="small" color={COLORS.secondary} />
            </View>
          )}

          {/* MAIN VIEWPORT */}
          {page === 'home' && (
            <PageAccueil isMobile={isMobile} setPage={setPage} areasCount={areas.length} recipesCount={totalRecipesCount} />
          )}

          {(page === 'cuisines' || page === 'dishes') && (
            <PageExploration
              page={page}
              isMobile={isMobile}
              isTablet={isTablet}
              windowWidth={windowWidth}
              showFilter={showFilter}
              setShowFilter={setShowFilter}
              filterCountry={filterCountry}
              setFilterCountry={setFilterCountry}
              areas={areas}
              selectedCuisine={selectedCuisine}
              cuisinesDict={cuisinesDict}
              cuisinesList={cuisinesList}
              openCuisine={openCuisine}
              openRecipe={openRecipe}
              toggleFavorite={toggleFavorite}
              isFavorite={isFavorite}
            />
          )}

          {page === 'favorites' && (
            <PageFavoris
              isMobile={isMobile}
              isTablet={isTablet}
              windowWidth={windowWidth}
              favorites={favorites}
              openRecipe={openRecipe}
              toggleFavorite={toggleFavorite}
              isFavorite={isFavorite}
            />
          )}

          {page === 'recipe' && recipeCache[selectedDishId] && (
            <PageRecette 
              recipe={recipeCache[selectedDishId]} isMobile={isMobile} 
              toggleFavorite={toggleFavorite} isFavorite={isFavorite}
              selectedCuisine={selectedCuisine}
            />
          )}
        </View>
      </ScrollView>

      <BottomNav
        page={page}
        goHome={goHome}
        goCuisines={goCuisines}
        goFavorites={goFavorites}
        favoritesCount={favorites.length}
      />
      </SafeAreaView>
    </View>
  );
}

