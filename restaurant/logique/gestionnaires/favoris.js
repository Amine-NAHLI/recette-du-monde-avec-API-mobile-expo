/**
 * Favoris stockes sous cle AsyncStorage JSON ; synchro automatique liste <-> stockage.
 */
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'favorites';

export default function useFavorites() {
  const [favorites, setFavorites] = useState([]);

  // Au montage : restauration JSON depuis AsyncStorage.
  useEffect(() => {
    const loadFavorites = async () => {
      const saved = await AsyncStorage.getItem(FAVORITES_KEY);
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    };

    loadFavorites();
  }, []);

  // A chaque mise a jour : persistance immediate de la liste.
  useEffect(() => {
    AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  /** Ajoute ou retire un plat identifie par idMeal. */
  const toggleFavorite = (meal) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.idMeal === meal.idMeal);
      if (exists) {
        return prev.filter((fav) => fav.idMeal !== meal.idMeal);
      }
      return [...prev, meal];
    });
  };

  /** Test rapide avant affichage des icones bookmark pleines / vides. */
  const isFavorite = (id) => favorites.some((fav) => fav.idMeal === id);

  return { favorites, toggleFavorite, isFavorite };
}
