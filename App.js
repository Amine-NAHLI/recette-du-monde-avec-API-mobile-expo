import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList, useWindowDimensions, SafeAreaView, ActivityIndicator, StatusBar, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// IMPORTING FROM RESTAURANT FOLDER
import { COLORS } from './restaurant/constants/theme';
import { fetchCuisines, fetchDishesByCountry, fetchRecipeById } from './restaurant/services/api';
import { getFlagUrl, getCols, getPadding, getCardWidth } from './restaurant/utils/layout';
import { cuisineData } from './restaurant/data.js';

// COMPONENTS
import LoadingScreen from './restaurant/components/LoadingScreen';
import Header from './restaurant/components/Header';
import Breadcrumbs from './restaurant/components/Breadcrumbs';
import Card from './restaurant/components/Card';
import FilterSection from './restaurant/components/FilterSection';

// VIEWS
import HomeView from './restaurant/views/HomeView';
import RecipeView from './restaurant/views/RecipeView';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function App() {
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  const [page, setPage] = useState('home');
  const [ready, setReady] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState(null);
  const [selectedDishId, setSelectedDishId] = useState(null);
  const [cuisinesDict, setCuisinesDict] = useState({});
  const [areas, setAreas] = useState([]);
  const [recipeCache, setRecipeCache] = useState({});
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterCountry, setFilterCountry] = useState("Tous");
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const scrollRef = useRef(null);

  // FAVORITES PERSISTENCE
  useEffect(() => {
    const loadFavs = async () => {
      const saved = await AsyncStorage.getItem('favorites');
      if (saved) setFavorites(JSON.parse(saved));
    };
    loadFavs();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  // CONTENT LOADING
  const loadContent = useCallback(async () => {
    setInitLoading(true);
    setError(null);
    try {
      const areaList = await fetchCuisines();
      setAreas(areaList);
      const newDict = {};
      for (const area of areaList.slice(0, 10)) {
        newDict[area] = await fetchDishesByCountry(area);
      }
      setCuisinesDict(newDict);
    } catch (e) {
      setError("ERREUR_SYSTÈME: FLUX INTERROMPU");
    }
    setInitLoading(false);
  }, []);

  useEffect(() => { loadContent(); }, [loadContent]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }, [page, selectedCuisine, selectedDishId]);

  const openCuisine = async (name) => {
    setSelectedCuisine(name);
    setPage('dishes');
    if (!cuisinesDict[name]) {
      setLoading(true);
      const meals = await fetchDishesByCountry(name);
      setCuisinesDict(prev => ({ ...prev, [name]: meals }));
      setLoading(false);
    }
  };

  const openRecipe = async (id) => {
    setSelectedDishId(id);
    setPage('recipe');
    if (!recipeCache[id]) {
      setLoading(true);
      const meal = await fetchRecipeById(id);
      if (meal) {
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
          if (meal[`strIngredient${i}`]) ingredients.push(`${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}`);
        }
        setRecipeCache(prev => ({ ...prev, [id]: {
          idMeal: id,
          name: meal.strMeal,
          ingredients,
          instructions: meal.strInstructions.split('\r\n').filter(s => s.trim().length > 10),
          url: meal.strMealThumb
        }}));
      }
      setLoading(false);
    }
  };

  const goHome = () => { setPage('home'); setSelectedCuisine(null); setSelectedDishId(null); };
  const goCuisines = () => { setPage('cuisines'); setSelectedCuisine(null); setSelectedDishId(null); };
  const goFavorites = () => { setPage('favorites'); setSelectedCuisine(null); setSelectedDishId(null); };

  const toggleFavorite = (meal) => {
    const isFav = favorites.some(f => f.idMeal === meal.idMeal);
    if (isFav) setFavorites(prev => prev.filter(f => f.idMeal !== meal.idMeal));
    else setFavorites(prev => [...prev, meal]);
  };

  const isFavorite = (id) => favorites.some(f => f.idMeal === id);

  const cuisinesList = useMemo(() => {
    let list = areas.map(area => ({
      cuisine: area, country: area, count: cuisinesDict[area]?.length || 0,
      image: cuisinesDict[area]?.[0]?.strMealThumb || `https://www.themealdb.com/images/ingredients/${area}.png`
    }));
    return filterCountry === "Tous" ? list : list.filter(c => c.country === filterCountry);
  }, [areas, cuisinesDict, filterCountry]);

  const totalRecipesCount = useMemo(() => {
    return Object.values(cuisinesDict).reduce((acc, list) => acc + list.length, 0);
  }, [cuisinesDict]);

  if (!ready) return <LoadingScreen onFinish={() => setReady(true)} />;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* STRUCTURE: FLOATING HEADER */}
      <Header isMobile={isMobile} goFavorites={goFavorites} favCount={favorites.length} />

      <ScrollView 
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={page === 'dishes' ? [1] : []}
        contentContainerStyle={[styles.mainScroll, { paddingBottom: 100 }]}
      >
        <View style={styles.pageBody}>
          {/* STRUCTURE: DYNAMIC BREADCRUMBS */}
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
              <MaterialCommunityIcons name="wifi-off" size={24} color={COLORS.secondary} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={loadContent}><Text style={styles.retryLink}>RÉESSAYER</Text></TouchableOpacity>
            </View>
          )}

          {(initLoading || loading) && (
            <View style={styles.globalLoader}>
              <ActivityIndicator size="large" color={COLORS.secondary} />
            </View>
          )}

          {/* MAIN VIEWPORT */}
          {page === 'home' && (
            <HomeView isMobile={isMobile} setPage={setPage} areasCount={areas.length} recipesCount={totalRecipesCount} />
          )}

          {(page === 'cuisines' || page === 'dishes' || page === 'favorites') && (
            <View style={{ paddingHorizontal: getPadding(isMobile) }}>
              <View style={styles.sectionHeader}>
                <Text style={styles.titleCode}>MOD_SECTION_01</Text>
                <Text style={styles.mainTitle}>
                  {page === 'cuisines' ? 'RÉSEAU GLOBAL' : page === 'favorites' ? 'VOS ARCHIVES' : selectedCuisine.toUpperCase()}
                </Text>
              </View>

              {page === 'cuisines' && (
                <FilterSection 
                  showFilter={showFilter} setShowFilter={setShowFilter} 
                  filterCountry={filterCountry} setFilterCountry={setFilterCountry} 
                  areas={areas} 
                />
              )}

              {/* STRUCTURE: HERO ITEM (IF DISHES) */}
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
                  <View style={styles.heroBadge}><Text style={styles.heroBadgeText}>À LA UNE</Text></View>
                </View>
              )}

              {page === 'favorites' && favorites.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="scan-outline" size={80} color="rgba(255,255,255,0.05)" />
                  <Text style={styles.emptyText}>AUCUNE DONNÉE FAVORITE DÉTECTÉE.</Text>
                </View>
              ) : (
                <FlatList
                  data={page === 'dishes' ? cuisinesDict[selectedCuisine].slice(1) : (page === 'cuisines' ? cuisinesList : favorites)}
                  keyExtractor={(item) => item.cuisine || item.idMeal}
                  numColumns={getCols(isMobile, isTablet)}
                  key={getCols(isMobile, isTablet)}
                  renderItem={({ item }) => (
                    <Card 
                      item={item} type={page === 'cuisines' ? 'c' : 'd'} 
                      width={getCardWidth(windowWidth, isMobile, isTablet)}
                      openCuisine={openCuisine} openRecipe={openRecipe} 
                      toggleFavorite={toggleFavorite} isFavorite={isFavorite}
                      getFlagUrl={(a) => getFlagUrl(a, cuisineData)}
                      selectedCuisine={selectedCuisine}
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

      {/* STRUCTURE: PERSISTENT BOTTOM NAV */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={goHome}>
          <Feather name="home" size={24} color={page === 'home' ? COLORS.secondary : '#FFF'} />
          <Text style={[styles.navText, page === 'home' && { color: COLORS.secondary }]}>DASHBOARD</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={goCuisines}>
          <Feather name="compass" size={24} color={(page === 'cuisines' || page === 'dishes') ? COLORS.secondary : '#FFF'} />
          <Text style={[styles.navText, (page === 'cuisines' || page === 'dishes') && { color: COLORS.secondary }]}>EXPLORER</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={goFavorites}>
          <View>
            <Feather name="heart" size={24} color={page === 'favorites' ? COLORS.accent : '#FFF'} />
            {favorites.length > 0 && <View style={styles.navBadge} />}
          </View>
          <Text style={[styles.navText, page === 'favorites' && { color: COLORS.accent }]}>ARCHIVES</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  mainScroll: { alignSelf: 'center', width: '100%', maxWidth: 1200 },
  pageBody: { paddingTop: 110 },
  sectionHeader: { marginBottom: 32 },
  titleCode: { color: COLORS.secondary, fontSize: 10, fontWeight: '900', letterSpacing: 3, marginBottom: 8 },
  mainTitle: { color: '#FFF', fontSize: 32, fontWeight: '900', letterSpacing: 1 },
  errorBanner: { backgroundColor: 'rgba(255,0,0,0.1)', padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderLeftWidth: 4, borderLeftColor: COLORS.accent },
  errorText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  retryLink: { color: COLORS.secondary, fontWeight: '900', textDecorationLine: 'underline' },
  globalLoader: { padding: 40, alignItems: 'center' },
  heroDishBox: { marginBottom: 32, position: 'relative' },
  heroBadge: { position: 'absolute', top: 20, left: 20, backgroundColor: COLORS.secondary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
  heroBadgeText: { color: '#000', fontSize: 10, fontWeight: '900', letterSpacing: 1 },
  emptyState: { alignItems: 'center', paddingVertical: 80, gap: 20 },
  emptyText: { color: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: '900', letterSpacing: 2 },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 85,
    backgroundColor: '#0A0A0A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 25,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  navItem: { alignItems: 'center', gap: 6 },
  navText: { color: '#FFF', fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  navBadge: { position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.secondary },
});
