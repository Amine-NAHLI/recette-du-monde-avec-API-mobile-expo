import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  useWindowDimensions,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from './restaurant/constants/theme';
import { getFlagUrl, getCols, getPadding, getCardWidth } from './restaurant/utils/layout';
import { cuisineData } from './restaurant/data.js';
import useFavorites from './restaurant/hooks/useFavorites';
import useMealBrowser from './restaurant/hooks/useMealBrowser';
import LoadingScreen from './restaurant/components/LoadingScreen';
import Header from './restaurant/components/Header';
import Breadcrumbs from './restaurant/components/Breadcrumbs';
import Card from './restaurant/components/Card';
import FilterSection from './restaurant/components/FilterSection';
import BottomNav from './restaurant/components/BottomNav';
import HomeView from './restaurant/views/HomeView';
import RecipeView from './restaurant/views/RecipeView';
import { styles } from './restaurant/styles/appStyles';

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
            <HomeView isMobile={isMobile} setPage={setPage} areasCount={areas.length} recipesCount={totalRecipesCount} />
          )}

          {(page === 'cuisines' || page === 'dishes' || page === 'favorites') && (
            <View style={{ paddingHorizontal: getPadding(isMobile) }}>
              <View style={styles.sectionHeader}>
                <View style={styles.headerPreBadge}>
                  <View style={styles.badgeLine} />
                  <Text style={styles.headerPreText}>EXPLORATION</Text>
                </View>
                <Text style={styles.mainTitle}>
                  {page === 'cuisines' ? 'Régions du Monde' : page === 'favorites' ? 'Mes Archives' : selectedCuisine}
                </Text>
              </View>

              {page === 'cuisines' && (
                <FilterSection 
                  showFilter={showFilter} setShowFilter={setShowFilter} 
                  filterCountry={filterCountry} setFilterCountry={setFilterCountry} 
                  areas={areas} 
                />
              )}

              {page === 'dishes' && cuisinesDict[selectedCuisine]?.length > 0 && (
                <View style={styles.heroDishBox}>
                   <Card 
                    item={cuisinesDict[selectedCuisine][0]} type="d" 
                    width={windowWidth - getPadding(isMobile)*2}
                    openCuisine={openCuisine} openRecipe={openRecipe} 
                    toggleFavorite={toggleFavorite} isFavorite={isFavorite}
                    getFlagUrl={(a) => getFlagUrl(a, cuisineData)}
                    selectedCuisine={selectedCuisine}
                  />
                  <View style={styles.heroBadge}><Text style={styles.heroBadgeText}>SÉLECTION DU CHEF</Text></View>
                </View>
              )}

              {page === 'favorites' && favorites.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="restaurant-outline" size={60} color="rgba(212, 175, 55, 0.1)" />
                  <Text style={styles.emptyText}>Votre collection est vide.</Text>
                </View>
              ) : (
                <FlatList
                  data={page === 'dishes' ? cuisinesDict[selectedCuisine].slice(1) : (page === 'cuisines' ? cuisinesList : favorites)}
                  keyExtractor={(item) => item.cuisine || item.idMeal}
                  numColumns={getCols(isMobile, isTablet)}
                  key={getCols(isMobile, isTablet)}
                  renderItem={({ item, index }) => (
                    <Card 
                      item={item} type={page === 'cuisines' ? 'c' : 'd'} 
                      width={getCardWidth(windowWidth, isMobile, isTablet)}
                      openCuisine={openCuisine} openRecipe={openRecipe} 
                      toggleFavorite={toggleFavorite} isFavorite={isFavorite}
                      getFlagUrl={(a) => getFlagUrl(a, cuisineData)}
                      selectedCuisine={selectedCuisine}
                      index={index}
                    />
                  )}
                  scrollEnabled={false}
                  columnWrapperStyle={getCols(isMobile, isTablet) > 1 ? { gap: 24 } : null}
                />
              )}
            </View>
          )}

          {page === 'recipe' && recipeCache[selectedDishId] && (
            <RecipeView 
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
