import React from 'react';
import { Animated, Image, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

export default function CuisineCard({
  item,
  width,
  flag,
  fadeAnim,
  scaleAnim,
  pressAnim,
  openCuisine,
  handlePressIn,
  handlePressOut,
}) {
  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }, { scale: pressAnim }], width }}>
      <TouchableOpacity
        style={styles.cuisineCard}
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => openCuisine(item.cuisine)}
      >
        <Image source={{ uri: item.image }} style={styles.cuisineImage} />
        <View style={styles.cuisineOverlay}>
          <View style={styles.cuisineTop}>
            {flag && <Image source={{ uri: flag }} style={styles.flag} />}
            <View style={styles.recipeCounter}>
              <Text style={styles.counterText}>{item.count}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.cuisinePre}>HERITAGE</Text>
            <Text style={styles.cuisineTitle}>{item.cuisine.toUpperCase()}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
