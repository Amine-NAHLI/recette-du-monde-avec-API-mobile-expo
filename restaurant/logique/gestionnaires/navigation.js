/**
 * Etat global de navigation et de donnees hors favoris : page courante, caches API,
 * filtre des cuisines, chargement et erreurs. Consomme par App.js.
 */
import { useCallback, useMemo, useState } from 'react';
import { fetchCuisines, fetchDishesByCountry, fetchRecipeById } from '../appels_api/config.js';
import { buildRecipeDetails } from '../outils/formatage.js';
import { cuisineData } from '../../data.js';

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

  // Premiere requete : liste des zones + prechargement des plats pour un sous-ensemble de zones.
  const loadContent = useCallback(async () => {
    setInitLoading(true);
    setError(null);
    try {
      const areaList = await fetchCuisines();
      
      // On ne garde que les cuisines qui existent dans notre fichier data.js (pour avoir les drapeaux et eviter les vides)
      const filteredAreas = areaList.filter(area => 
        cuisineData.some(c => c.name.toLowerCase() === area.toLowerCase())
      );
      
      setAreas(filteredAreas);

      const newDict = {};
      for (const area of filteredAreas) {
        const normalized = area.charAt(0).toUpperCase() + area.slice(1).toLowerCase();
        newDict[normalized] = await fetchDishesByCountry(normalized);
      }
      setCuisinesDict(newDict);
    } catch (e) {
      setError('ERREUR_SYSTÈME: FLUX INTERROMPU');
    } finally {
      setInitLoading(false);
    }
  }, []);

  // Ouvre la grille des plats d une zone ; charge les plats si pas encore en cache.
  const openCuisine = useCallback(
    async (name) => {
      // Normalisation du nom (ex: ALGERIAN -> Algerian) pour l'API
      const normalizedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      setSelectedCuisine(normalizedName);
      setPage('dishes');
      if (!cuisinesDict[normalizedName]) {
        setLoading(true);
        try {
          const meals = await fetchDishesByCountry(normalizedName);
          setCuisinesDict((prev) => ({ ...prev, [normalizedName]: meals }));
        } finally {
          setLoading(false);
        }
      }
    },
    [cuisinesDict],
  );

  // Detail recette + mise en cache objet formate pour RecipePage.
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

  // Reinitialise la navigation vers l accueil.
  const goHome = useCallback(() => {
    setPage('home');
    setSelectedCuisine(null);
    setSelectedDishId(null);
  }, []);

  // Bouton Explorer / fil d Ariane : liste toutes les cuisines, sans selection.
  const goCuisines = useCallback(() => {
    setPage('cuisines');
    setSelectedCuisine(null);
    setSelectedDishId(null);
  }, []);

  // Page favoris depuis header ou bottom nav.
  const goFavorites = useCallback(() => {
    setPage('favorites');
    setSelectedCuisine(null);
    setSelectedDishId(null);
  }, []);

  // Liste affichee sur ExplorePage (cuisines) avec filtre filterCountry et comptage depuis cuisinesDict.
  const cuisinesList = useMemo(() => {
    const list = areas.map((area, index) => {
      const normalized = area.charAt(0).toUpperCase() + area.slice(1).toLowerCase();
      return {
        id: `${area}-${index}`, 
        cuisine: normalized,
        country: normalized,
        count: cuisinesDict[normalized]?.length || 0,
        image:
          cuisinesDict[normalized]?.[0]?.strMealThumb ||
          `https://www.themealdb.com/images/ingredients/${normalized}.png`,
      };
    }); 

    return filterCountry === 'Tous'
      ? list
      : list.filter((cuisine) => cuisine.country === filterCountry);
  }, [areas, cuisinesDict, filterCountry]);

  // Total des plats dans le cache cuisinesDict (pour les stats sur la home).
  const totalRecipesCount = useMemo(
    () => Object.values(cuisinesDict).reduce((acc, list) => acc + list.length, 0),
    [cuisinesDict],
  );

  // API utilisee par App : etat + actions de navigation / chargement.
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

