import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import CuisineCard from './card/CuisineCard';
import DishCard from './card/DishCard';

/**
 * [SECTION: COMPOSANT RÉUTILISABLE (Propriétés/Props)]
 * Ce composant 'Card' reçoit des données via ses 'props'.
 * item: l'objet plat ou cuisine à afficher
 * type: 'c' pour cuisine, 'd' pour dish (plat)
 */
const Card = ({
  item,
  type,
  width,
  openCuisine,
  openRecipe,
  toggleFavorite,
  isFavorite,
  getFlagUrl,
  selectedCuisine,
  index = 0,
}) => {
  const isCuisine = type === 'c';
  const area = isCuisine ? item.cuisine : item.area || selectedCuisine || 'Global';
  const flag = getFlagUrl(area);

  /** 
   * [SECTION: ANIMATIONS (Animated API)]
   * Initialisation des valeurs d'animation pour les effets visuels.
   */
  const fadeAnim = useRef(new Animated.Value(0)).current; // Opacité
  const scaleAnim = useRef(new Animated.Value(0.98)).current; // Échelle initiale
  const pressAnim = useRef(new Animated.Value(1)).current; // Échelle lors de l'appui

  /**
   * [SECTION: DÉCLENCHEMENT D'ANIMATIONS (useEffect)]
   * Les animations se lancent de manière décalée (Staggered) selon l'index.
   */
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        delay: index * 80,
        useNativeDriver: false,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        delay: index * 80,
        useNativeDriver: false,
        easing: Easing.out(Easing.quad),
      })
    ]).start();
  }, [index]);

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 0.97,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: false,
    }).start();
  };

  if (isCuisine) {
    return (
      <CuisineCard
        item={item}
        width={width}
        flag={flag}
        fadeAnim={fadeAnim}
        scaleAnim={scaleAnim}
        pressAnim={pressAnim}
        openCuisine={openCuisine}
        handlePressIn={handlePressIn}
        handlePressOut={handlePressOut}
      />
    );
  }

  return (
    <DishCard
      item={item}
      area={area}
      width={width}
      fadeAnim={fadeAnim}
      scaleAnim={scaleAnim}
      pressAnim={pressAnim}
      openRecipe={openRecipe}
      toggleFavorite={toggleFavorite}
      isFavorite={isFavorite}
      handlePressIn={handlePressIn}
      handlePressOut={handlePressOut}
    />
  );
};

export default Card;

