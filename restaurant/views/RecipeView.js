import React, { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import RecipeHero from './recipe/RecipeHero';
import RecipeRibbon from './recipe/RecipeRibbon';
import IngredientsSection from './recipe/IngredientsSection';
import InstructionsSection from './recipe/InstructionsSection';
import { styles } from './recipe/styles';

const RecipeView = ({ recipe, isMobile, toggleFavorite, isFavorite, selectedCuisine }) => {
  const contentFade = useRef(new Animated.Value(0)).current;
  const slideIn = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(contentFade, { toValue: 1, duration: 1000, useNativeDriver: false }),
      Animated.spring(slideIn, { toValue: 0, friction: 8, useNativeDriver: false })
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: contentFade, transform: [{ translateY: slideIn }] }]}>
      <RecipeHero
        recipe={recipe}
        isMobile={isMobile}
        selectedCuisine={selectedCuisine}
        toggleFavorite={toggleFavorite}
        isFavorite={isFavorite}
      />
      <RecipeRibbon />

      <Text style={styles.title}>{recipe.name}</Text>
      <View style={styles.titleDivider} />

      <View style={[styles.contentLayout, !isMobile && styles.desktopRow]}>
        <IngredientsSection ingredients={recipe.ingredients} isMobile={isMobile} />
        <InstructionsSection instructions={recipe.instructions} isMobile={isMobile} />
      </View>
    </Animated.View>
  );
};

export default RecipeView;

