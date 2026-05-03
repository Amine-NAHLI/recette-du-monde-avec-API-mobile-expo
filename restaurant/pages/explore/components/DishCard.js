import React from 'react';
import { Animated, Image, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { styles } from './styles';

export default function DishCard({
  item,
  area,
  width,
  fadeAnim,
  scaleAnim,
  pressAnim,
  openRecipe,
  toggleFavorite,
  isFavorite,
  handlePressIn,
  handlePressOut,
}) {
  const favorite = isFavorite(item.idMeal);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }, { scale: pressAnim }], width }}>
      <TouchableOpacity
        style={styles.recipeCard}
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => openRecipe(item.idMeal)}
      >
        <Image source={{ uri: item.strMealThumb }} style={styles.recipeImage} />
        <View style={styles.recipeContent}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardArea}>{area.toUpperCase()}</Text>
            <TouchableOpacity
              onPress={() =>
                toggleFavorite({
                  idMeal: item.idMeal,
                  strMeal: item.strMeal,
                  strMealThumb: item.strMealThumb,
                  area,
                })
              }
            >
              <Ionicons
                name={favorite ? 'bookmark' : 'bookmark-outline'}
                size={20}
                color={favorite ? COLORS.secondary : 'rgba(255,255,255,0.3)'}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.recipeTitle} numberOfLines={2}>
            {item.strMeal}
          </Text>
          <View style={styles.cardFooter}>
            <View style={styles.luxuryTag}>
              <Ionicons name="time-outline" size={10} color={COLORS.secondary} />
              <Text style={styles.luxuryTagText}>ELABORATION 45M</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
