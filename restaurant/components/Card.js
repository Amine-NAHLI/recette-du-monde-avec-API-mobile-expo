import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated, Easing, Platform } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const Card = ({ item, type, width, openCuisine, openRecipe, toggleFavorite, isFavorite, getFlagUrl, selectedCuisine, index = 0 }) => {
  const isCuisine = type === 'c';
  const area = isCuisine ? item.cuisine : (item.area || selectedCuisine || "Global");
  const flag = getFlagUrl(area);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.98)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        delay: index * 80,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      })
    ]).start();
  }, [index]);

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  if (!isCuisine) {
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
              <TouchableOpacity onPress={() => toggleFavorite({ idMeal: item.idMeal, strMeal: item.strMeal, strMealThumb: item.strMealThumb, area: area })}>
                <Ionicons 
                  name={isFavorite(item.idMeal) ? "bookmark" : "bookmark-outline"} 
                  size={20} 
                  color={isFavorite(item.idMeal) ? COLORS.secondary : 'rgba(255,255,255,0.3)'} 
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.recipeTitle} numberOfLines={2}>{item.strMeal}</Text>
            <View style={styles.cardFooter}>
              <View style={styles.luxuryTag}>
                <Ionicons name="time-outline" size={10} color={COLORS.secondary} />
                <Text style={styles.luxuryTagText}>ÉLABORATION 45M</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

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
            <View style={styles.recipeCounter}><Text style={styles.counterText}>{item.count}</Text></View>
          </View>
          <View>
            <Text style={styles.cuisinePre}>HÉRITAGE</Text>
            <Text style={styles.cuisineTitle}>{item.cuisine.toUpperCase()}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  recipeCard: {
    flexDirection: 'row',
    backgroundColor: '#121214',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(212, 175, 55, 0.1)',
    height: 150,
  },
  recipeImage: { width: 150, height: 150 },
  recipeContent: { flex: 1, padding: 20, justifyContent: 'space-between' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardArea: { color: COLORS.secondary, fontSize: 8, fontWeight: '800', letterSpacing: 2 },
  recipeTitle: { 
    color: '#FFF', 
    fontSize: 16, 
    fontWeight: '300', 
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif', 
    lineHeight: 22 
  },
  cardFooter: { flexDirection: 'row' },
  luxuryTag: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.03)', paddingHorizontal: 10, paddingVertical: 5 },
  luxuryTagText: { color: 'rgba(255,255,255,0.4)', fontSize: 7, fontWeight: '800', letterSpacing: 1 },
  cuisineCard: { 
    height: 280, 
    backgroundColor: COLORS.primary, 
    borderRadius: 2, 
    overflow: 'hidden', 
    marginBottom: 24, 
    borderWidth: 0.5, 
    borderColor: 'rgba(5,5,5,0.1)' 
  },
  cuisineImage: { width: '100%', height: '100%', opacity: 0.7 },
  cuisineOverlay: { ...StyleSheet.absoluteFillObject, padding: 24, justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.4)' },
  cuisineTop: { flexDirection: 'row', justifyContent: 'space-between' },
  flag: { width: 30, height: 18, borderRadius: 0, opacity: 0.8 },
  recipeCounter: { 
    backgroundColor: COLORS.secondary, 
    width: 22, 
    height: 22, 
    borderRadius: 11, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  counterText: { color: COLORS.primary, fontSize: 9, fontWeight: '900' },
  cuisinePre: { color: COLORS.secondary, fontSize: 8, fontWeight: '800', letterSpacing: 3, marginBottom: 4 },
  cuisineTitle: { 
    color: '#FFF', 
    fontSize: 24, 
    fontWeight: '300', 
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif', 
    letterSpacing: 1 
  }
});

export default Card;

