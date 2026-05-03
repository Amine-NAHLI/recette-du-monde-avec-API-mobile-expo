import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { styles } from './styles';

export default function RecipeHero({
  recipe,
  isMobile,
  selectedCuisine,
  toggleFavorite,
  isFavorite,
}) {
  return (
    <View style={[styles.heroFrame, { aspectRatio: isMobile ? 4 / 3 : 21 / 9 }]}>
      <Image source={{ uri: recipe.url }} style={styles.heroImage} resizeMode="cover" />
      <View style={styles.heroShadow} />

      <TouchableOpacity
        style={styles.floatingAction}
        onPress={() =>
          toggleFavorite({
            idMeal: recipe.idMeal,
            strMeal: recipe.name,
            strMealThumb: recipe.url,
            area: selectedCuisine,
          })
        }
      >
        <Ionicons
          name={isFavorite(recipe.idMeal) ? 'bookmark' : 'bookmark-outline'}
          size={24}
          color={COLORS.secondary}
        />
      </TouchableOpacity>
    </View>
  );
}
