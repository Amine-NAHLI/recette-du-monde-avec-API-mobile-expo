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
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';


import { ThemeProvider, useTheme } from './restaurant/logique/design/ThemeContext.js';
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
import PageNotifications from './restaurant/ecrans/PageNotifications';
import { setupNotifications } from './restaurant/logique/gestionnaires/notifications.js';
import useAuth from './restaurant/logique/gestionnaires/auth.js';

function AppContent() {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;
  const [ready, setReady] = useState(false);
  const scrollRef = useRef(null);
  const { theme, isDark, toggleTheme } = useTheme();

  const { user, promptAsync, logout } = useAuth();

  useEffect(() => {
    setupNotifications();
  }, []);

  const { favorites, toggleFavorite, isFavorite } = useFavorites(promptAsync);
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
    goNotifications,
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
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* [NAVIGATION GLOBALE] Header fixe + breadcrumb + contenu + navigation bas */}
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.primary} />
      
      <Header 
        isMobile={isMobile} 
        goFavorites={goFavorites} 
        goNotifications={goNotifications} 
        favCount={favorites.length}
        toggleTheme={toggleTheme}
        isDark={isDark}
      />

      <ScrollView 
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[{ alignSelf: 'center', width: '100%', maxWidth: 1200 }, { paddingBottom: 120 }]}
      >
        <View style={{ paddingTop: 100 }}>
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
            <View style={{ backgroundColor: `rgba(212, 175, 55, 0.05)`, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 15, borderLeftWidth: 1, borderLeftColor: theme.secondary }}>
              <Ionicons name="alert-circle-outline" size={24} color={theme.secondary} />
              <Text style={{ color: theme.text, fontSize: 13 }}>{error}</Text>
              <TouchableOpacity onPress={loadContent}><Text style={{ color: theme.secondary, fontWeight: '700', textDecorationLine: 'underline', fontSize: 12 }}>RÉESSAYER</Text></TouchableOpacity>
            </View>
          )}

          {(initLoading || loading) && (
            <View style={{ padding: 60, alignItems: 'center' }}>
              <ActivityIndicator size="small" color={theme.secondary} />
            </View>
          )}

          {/* MAIN VIEWPORT */}
          {page === 'home' && (
            <PageAccueil 
              isMobile={isMobile} 
              setPage={setPage} 
              areasCount={areas.length} 
              recipesCount={totalRecipesCount} 
              user={user}
              promptAsync={promptAsync}
              logout={logout}
              openCuisine={openCuisine}
            />
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
              user={user}
            />
          )}

          {page === 'notifications' && (
            <PageNotifications isMobile={isMobile} user={user} />
          )}
        </View>
      </ScrollView>

      <BottomNav
        page={page}
        goHome={goHome}
        goCuisines={goCuisines}
        goFavorites={goFavorites}
        goNotifications={goNotifications}
        favoritesCount={favorites.length}
      />
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

