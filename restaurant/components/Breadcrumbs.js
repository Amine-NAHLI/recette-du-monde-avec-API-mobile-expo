import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const Breadcrumbs = ({ page, isMobile, goHome, goCuisines, openCuisine, selectedCuisine, dishName }) => {
  return (
    <View style={[styles.breadcrumbBar, isMobile && styles.breadcrumbBarMobile]}>
      <TouchableOpacity onPress={goHome} activeOpacity={0.6}>
        <View style={styles.item}>
          <Feather name="home" size={12} color={COLORS.textLight} />
          <Text style={styles.breadcrumbText}>ACCUEIL</Text>
        </View>
      </TouchableOpacity>
      
      {page === 'favorites' && (
        <>
          <Feather name="chevron-right" size={12} color={COLORS.border} />
          <Text style={[styles.breadcrumbText, styles.activeText]}>MES FAVORIS</Text>
        </>
      )}

      {(page === 'cuisines' || page === 'dishes' || page === 'recipe') && (
        <>
          <Feather name="chevron-right" size={12} color={COLORS.border} />
          <TouchableOpacity onPress={goCuisines} activeOpacity={0.6}>
            <Text style={[styles.breadcrumbText, page === 'cuisines' && styles.activeText]}>NOS CUISINES</Text>
          </TouchableOpacity>
        </>
      )}

      {(page === 'dishes' || page === 'recipe') && selectedCuisine && (
        <>
          <Feather name="chevron-right" size={12} color={COLORS.border} />
          <TouchableOpacity onPress={() => openCuisine(selectedCuisine)} activeOpacity={0.6}>
            <Text style={[styles.breadcrumbText, page === 'dishes' && styles.activeText]}>{selectedCuisine.toUpperCase()}</Text>
          </TouchableOpacity>
        </>
      )}

      {page === 'recipe' && dishName && (
        <>
          <Feather name="chevron-right" size={12} color={COLORS.border} />
          <View style={styles.recipeTag}>
            <Text style={[styles.breadcrumbText, styles.activeText]} numberOfLines={1}>{dishName.toUpperCase()}</Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  breadcrumbBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 32, 
    gap: 12, 
    flexWrap: 'wrap',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  breadcrumbBarMobile: {
    marginBottom: 20,
    gap: 8,
    paddingHorizontal: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  breadcrumbText: { 
    color: COLORS.textLight, 
    fontSize: 10, 
    fontWeight: '700',
    letterSpacing: 1,
  },
  activeText: {
    color: COLORS.secondary,
    fontWeight: '900',
  },
  recipeTag: {
    flexShrink: 1,
  }
});

export default Breadcrumbs;
