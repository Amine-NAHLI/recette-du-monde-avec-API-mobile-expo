import { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../appels_api/supabase';

const FAVORITES_KEY = 'favorites';

export default function useFavorites(promptAsync) {
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);

  // Gestion de la session utilisateur
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) setFavorites([]); // Vide les favoris à la déconnexion
    });
  }, []);

  // Charger les favoris depuis Supabase si connecté
  useEffect(() => {
    const loadFavorites = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('favorites')
          .select('*')
          .eq('user_id', user.id);
        
        if (!error && data) {
          const formatted = data.map(f => ({
            idMeal: f.meal_id,
            strMeal: f.meal_name,
            strMealThumb: f.meal_image
          }));
          setFavorites(formatted);
        }
      } else {
        // IMPORTANT: Vide la liste quand l'utilisateur est déconnecté
        setFavorites([]);
      }
    };

    loadFavorites();
  }, [user]);

  /** Ajoute ou retire un plat identifie par idMeal. */
  const toggleFavorite = async (meal) => {
    if (!user) {
      if (Platform.OS === 'web') {
        const confirmLogin = window.confirm("✨ Action Réservée : Voulez-vous vous connecter pour sauvegarder vos recettes préférées ?");
        if (confirmLogin) promptAsync?.();
      } else {
        Alert.alert(
          "✨ Action Réservée",
          "La gestion des favoris est réservée aux Membres Gourmet. Connectez-vous pour sauvegarder vos recettes préférées !",
          [
            { text: "Plus tard", style: "cancel" },
            { text: "Se connecter", onPress: () => promptAsync?.() }
          ]
        );
      }
      return;
    }

    const exists = favorites.some((fav) => fav.idMeal === meal.idMeal);
    
    if (exists) {
      setFavorites(prev => prev.filter((fav) => fav.idMeal !== meal.idMeal));
      await supabase.from('favorites').delete().eq('meal_id', meal.idMeal).eq('user_id', user.id);
    } else {
      setFavorites(prev => [...prev, meal]);
      await supabase.from('favorites').insert({
        user_id: user.id,
        meal_id: meal.idMeal,
        meal_name: meal.strMeal,
        meal_image: meal.strMealThumb
      });
    }
  };

  /** Test rapide avant affichage des icones bookmark pleines / vides. */
  const isFavorite = (id) => favorites.some((fav) => fav.idMeal === id);

  return { favorites, toggleFavorite, isFavorite };
}
