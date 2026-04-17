import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Animated, Easing } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const Card = ({ item, type, width, openCuisine, openRecipe, toggleFavorite, isFavorite, getFlagUrl, selectedCuisine, index = 0 }) => {
  const isCuisine = type === 'c';
  const area = isCuisine ? item.cuisine : (item.area || selectedCuisine || "Global");
  const flag = getFlagUrl(area);

  // ADVANCED ANIMATIONS
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Staggered entrance based on index
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      })
    ]).start();
  }, [index]);

  const handlePressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  // STRUCTURAL VARIATION: HORIZONTAL FOR RECIPES
  if (!isCuisine) {
    return (
      <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }, { scale: pressAnim }], width }}>
        <TouchableOpacity 
          style={styles.horizontalCard} 
          activeOpacity={0.9}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => openRecipe(item.idMeal)}
        >
          <Image source={{ uri: item.strMealThumb }} style={styles.horizImage} />
          <View style={styles.horizContent}>
            <View style={styles.horizTop}>
              <Text style={styles.horizMeta}>{area.toUpperCase()}</Text>
              <TouchableOpacity onPress={() => toggleFavorite({ idMeal: item.idMeal, strMeal: item.strMeal, strMealThumb: item.strMealThumb, area: area })}>
                <MaterialCommunityIcons 
                  name={isFavorite(item.idMeal) ? "heart-flash" : "heart-outline"} 
                  size={20} 
                  color={isFavorite(item.idMeal) ? COLORS.accent : 'rgba(255,255,255,0.4)'} 
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.horizTitle} numberOfLines={2}>{item.strMeal}</Text>
            <View style={styles.horizFooter}>
              <View style={styles.tag}><Feather name="clock" size={10} color={COLORS.secondary} /><Text style={styles.tagText}>45M</Text></View>
              <View style={styles.tag}><Feather name="zap" size={10} color={COLORS.secondary} /><Text style={styles.tagText}>LVL_A1</Text></View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  // CUISINE CARD
  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }, { scale: pressAnim }], width }}>
      <TouchableOpacity 
        style={styles.squareCard} 
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => openCuisine(item.cuisine)}
      >
        <Image source={{ uri: item.image }} style={styles.squareImage} />
        <View style={styles.squareOverlay}>
          <View style={styles.squareTop}>
            {flag && <Image source={{ uri: flag }} style={styles.flag} />}
            <View style={styles.countBadge}><Text style={styles.countText}>{item.count}</Text></View>
          </View>
          <View>
            <Text style={styles.squareMeta}>CUISINE_ARCH</Text>
            <Text style={styles.squareTitle}>{item.cuisine.toUpperCase()}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  horizontalCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    height: 140,
  },
  horizImage: { width: 140, height: 140 },
  horizContent: { flex: 1, padding: 16, justifyContent: 'space-between' },
  horizTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  horizMeta: { color: COLORS.secondary, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  horizTitle: { color: '#FFF', fontSize: 16, fontWeight: '800', lineHeight: 20 },
  horizFooter: { flexDirection: 'row', gap: 12 },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  tagText: { color: 'rgba(255,255,255,0.5)', fontSize: 8, fontWeight: '900' },
  squareCard: { height: 250, backgroundColor: COLORS.card, borderRadius: 24, overflow: 'hidden', marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  squareImage: { width: '100%', height: '100%', opacity: 0.6 },
  squareOverlay: { ...StyleSheet.absoluteFillObject, padding: 20, justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.5)' },
  squareTop: { flexDirection: 'row', justifyContent: 'space-between' },
  flag: { width: 32, height: 20, borderRadius: 4 },
  countBadge: { backgroundColor: COLORS.secondary, width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  countText: { color: '#000', fontSize: 10, fontWeight: '900' },
  squareMeta: { color: 'rgba(255,255,255,0.4)', fontSize: 8, fontWeight: '900', letterSpacing: 2 },
  squareTitle: { color: '#FFF', fontSize: 22, fontWeight: '900' }
});

export default Card;
