import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, FlatList, useWindowDimensions, SafeAreaView, ActivityIndicator, StatusBar, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
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
      setError("Erreur de connexion au serveur culinaire.");
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
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <Header isMobile={isMobile} goFavorites={goFavorites} favCount={favorites.length} />

      <ScrollView 
        ref={scrollRef}
        contentContainerStyle={[styles.mainScroll, { padding: getPadding(isMobile) }]}
      >
        {page !== 'home' && (
          <Breadcrumbs 
            page={page} isMobile={isMobile} goHome={goHome} goCuisines={goCuisines} 
            openCuisine={openCuisine} selectedCuisine={selectedCuisine}
            dishName={page === 'recipe' && recipeCache[selectedDishId]?.name}
          />
        )}

        {error && (
          <View style={styles.errorCard}>
            <Feather name="wifi-off" size={32} color={COLORS.secondary} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={loadContent}>
              <Text style={styles.retryText}>RÉESSAYER</Text>
            </TouchableOpacity>
          </View>
        )}

        {(initLoading || loading) && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color={COLORS.secondary} />
            <Text style={styles.loaderText}>CHARGEMENT...</Text>
          </View>
        )}

        {page === 'home' && (
          <HomeView isMobile={isMobile} setPage={setPage} areasCount={areas.length} recipesCount={totalRecipesCount} />
        )}

        {(page === 'cuisines' || page === 'dishes' || page === 'favorites') && (
          <View>
            <View style={styles.sectionHeaderLine}>
              <Text style={styles.pageHeaderTitle}>
                {page === 'cuisines' ? 'NOS CUISINES' : page === 'favorites' ? 'VOS FAVORIS' : selectedCuisine.toUpperCase()}
              </Text>
            </View>
            
            {page === 'cuisines' && (
              <FilterSection 
                showFilter={showFilter} setShowFilter={setShowFilter} 
                filterCountry={filterCountry} setFilterCountry={setFilterCountry} 
                areas={areas} 
              />
            )}
            
            {page === 'favorites' && favorites.length === 0 ? (
              <View style={styles.errorCard}>
                <Feather name="heart" size={32} color={COLORS.border} />
                <Text style={styles.errorText}>Vous n'avez pas encore de favoris.</Text>
                <TouchableOpacity style={styles.retryBtn} onPress={goCuisines}>
                  <Text style={styles.retryText}>DÉCOUVRIR DES PLATS</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={page === 'cuisines' ? cuisinesList : page === 'favorites' ? favorites : cuisinesDict[selectedCuisine]}
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
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>SAVEUR DU MONDE BY AMINE NAHLI</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  mainScroll: { alignSelf: 'center', width: '100%', maxWidth: 1200 },
  pageHeaderTitle: { fontSize: 32, fontWeight: '900', color: COLORS.primary, letterSpacing: 1.5, marginBottom: 32, textAlign: 'center' },
  sectionHeaderLine: { marginBottom: 24 },
  loader: { padding: 40, alignItems: 'center' },
  loaderText: { color: COLORS.textLight, marginTop: 12, fontWeight: '700', letterSpacing: 1 },
  errorCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 40, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: COLORS.border },
  errorText: { color: COLORS.text, fontSize: 14, fontWeight: '700', marginVertical: 16, textAlign: 'center' },
  retryBtn: { backgroundColor: COLORS.secondary, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  retryText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12 },
  footer: { backgroundColor: COLORS.primary, paddingVertical: 20, alignItems: 'center' },
  footerText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700', letterSpacing: 2, opacity: 0.8 },
});
