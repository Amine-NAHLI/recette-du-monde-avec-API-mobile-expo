import { useCallback, useMemo, useState } from 'react';
import { fetchCuisines, fetchDishesByCountry, fetchRecipeById } from '../services/api';
import { buildRecipeDetails } from '../utils/recipeFormatter';

export default function useMealBrowser() {
  const [page, setPage] = useState('home');
  const [selectedCuisine, setSelectedCuisine] = useState(null);
  const [selectedDishId, setSelectedDishId] = useState(null);
  const [cuisinesDict, setCuisinesDict] = useState({});
  const [areas, setAreas] = useState([]);
  const [recipeCache, setRecipeCache] = useState({});
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterCountry, setFilterCountry] = useState('Tous');
  const [error, setError] = useState(null);

  const loadContent = useCallback(async () => {
    setInitLoading(true);
    setError(null);
    try {
      const areaList = await fetchCuisines();
      setAreas(areaList);

      const newDict = {};
      for (const area of areaList.slice(0, 10)) {
        // Preload a subset for initial speed.
        newDict[area] = await fetchDishesByCountry(area);
      }
      setCuisinesDict(newDict);
    } catch (e) {
      setError('ERREUR_SYSTÈME: FLUX INTERROMPU');
    } finally {
      setInitLoading(false);
    }
  }, []);

  const openCuisine = useCallback(
    async (name) => {
      setSelectedCuisine(name);
      setPage('dishes');
      if (!cuisinesDict[name]) {
        setLoading(true);
        try {
          const meals = await fetchDishesByCountry(name);
          setCuisinesDict((prev) => ({ ...prev, [name]: meals }));
        } finally {
          setLoading(false);
        }
      }
    },
    [cuisinesDict],
  );

  const openRecipe = useCallback(
    async (id) => {
      setSelectedDishId(id);
      setPage('recipe');
      if (!recipeCache[id]) {
        setLoading(true);
        try {
          const meal = await fetchRecipeById(id);
          const recipe = buildRecipeDetails(meal, id);
          if (recipe) {
            setRecipeCache((prev) => ({ ...prev, [id]: recipe }));
          }
        } finally {
          setLoading(false);
        }
      }
    },
    [recipeCache],
  );

  const goHome = useCallback(() => {
    setPage('home');
    setSelectedCuisine(null);
    setSelectedDishId(null);
  }, []);

  const goCuisines = useCallback(() => {
    setPage('cuisines');
    setSelectedCuisine(null);
    setSelectedDishId(null);
  }, []);

  const goFavorites = useCallback(() => {
    setPage('favorites');
    setSelectedCuisine(null);
    setSelectedDishId(null);
  }, []);

  const cuisinesList = useMemo(() => {
    const list = areas.map((area) => ({
      cuisine: area,
      country: area,
      count: cuisinesDict[area]?.length || 0,
      image:
        cuisinesDict[area]?.[0]?.strMealThumb ||
        `https://www.themealdb.com/images/ingredients/${area}.png`,
    }));

    return filterCountry === 'Tous'
      ? list
      : list.filter((cuisine) => cuisine.country === filterCountry);
  }, [areas, cuisinesDict, filterCountry]);

  const totalRecipesCount = useMemo(
    () => Object.values(cuisinesDict).reduce((acc, list) => acc + list.length, 0),
    [cuisinesDict],
  );

  return {
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
  };
}
