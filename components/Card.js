import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const Card = ({ item, type, width, openCuisine, openRecipe, toggleFavorite, isFavorite, getFlagUrl, selectedCuisine }) => {
  const isCuisine = type === 'c';
  const area = isCuisine ? item.cuisine : (item.area || selectedCuisine || "Divers");
  const flag = getFlagUrl(area);

  return (
    <TouchableOpacity 
      style={[styles.card, { width }]} 
      onPress={() => isCuisine ? openCuisine(item.cuisine) : openRecipe(item.idMeal)}
    >
      <Image source={{ uri: isCuisine ? item.image : item.strMealThumb }} style={styles.cardImage} />
      <View style={styles.cardOverlay}>
        <View style={styles.cardTopRow}>
          {flag && <Image source={{ uri: flag }} style={styles.cardFlag} />}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            {!isCuisine && (
              <TouchableOpacity 
                onPress={() => toggleFavorite({ idMeal: item.idMeal, strMeal: item.strMeal, strMealThumb: item.strMealThumb, area: area })}
                style={styles.cardHeart}
              >
                <MaterialIcons 
                  name={isFavorite(item.idMeal) ? "favorite" : "favorite-border"} 
                  size={16} 
                  color={isFavorite(item.idMeal) ? '#E63946' : '#FFFFFF'} 
                />
              </TouchableOpacity>
            )}
            {isCuisine && (
              <View style={styles.cardBadge}>
                <Text style={styles.cardBadgeText}>{item.count} PLATS</Text>
              </View>
            )}
          </View>
        </View>
        <View>
          <Text style={styles.cardMetaText}>{area?.toUpperCase()}</Text>
          <Text style={styles.cardMainTitle} numberOfLines={1}>{isCuisine ? item.cuisine : item.strMeal}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.card, borderRadius: 16, marginBottom: 24, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 20, elevation: 6, overflow: 'hidden' },
  cardImage: { width: '100%', height: 280 },
  cardOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, backgroundColor: 'rgba(26,26,46,0.75)', height: '100%', justifyContent: 'space-between' },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardFlag: { width: 32, height: 20, borderRadius: 4, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  cardMetaText: { fontSize: 10, color: COLORS.secondary, letterSpacing: 2, fontWeight: '700', marginBottom: 4 },
  cardBadge: { backgroundColor: COLORS.secondary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  cardHeart: { backgroundColor: 'rgba(0,0,0,0.3)', padding: 8, borderRadius: 20 },
  cardBadgeText: { fontSize: 9, color: '#FFFFFF', fontWeight: '900', letterSpacing: 1 },
  cardMainTitle: { fontSize: 22, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.5, lineHeight: 28 },
});

export default Card;
