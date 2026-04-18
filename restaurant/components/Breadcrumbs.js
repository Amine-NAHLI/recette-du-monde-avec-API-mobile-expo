import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const Breadcrumbs = ({ page, isMobile, goHome, goCuisines, openCuisine, selectedCuisine, dishName }) => {
  return (
    <View style={styles.outerContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={goHome} activeOpacity={0.6}>
          <Text style={styles.breadcrumbText}>RÉSERVE</Text>
        </TouchableOpacity>
        
        {page === 'favorites' && (
          <>
            <Feather name="chevron-right" size={10} color={COLORS.border} />
            <Text style={[styles.breadcrumbText, styles.activeText]}>FAVORIS</Text>
          </>
        )}

        {(page === 'cuisines' || page === 'dishes' || page === 'recipe') && (
          <>
            <Feather name="chevron-right" size={10} color={COLORS.border} />
            <TouchableOpacity onPress={goCuisines} activeOpacity={0.6}>
              <Text style={[styles.breadcrumbText, page === 'cuisines' && styles.activeText]}>CUISINES</Text>
            </TouchableOpacity>
          </>
        )}

        {(page === 'dishes' || page === 'recipe') && selectedCuisine && (
          <>
            <Feather name="chevron-right" size={10} color={COLORS.border} />
            <TouchableOpacity onPress={() => openCuisine(selectedCuisine)} activeOpacity={0.6}>
              <Text style={[styles.breadcrumbText, page === 'dishes' && styles.activeText]}>{selectedCuisine.toUpperCase()}</Text>
            </TouchableOpacity>
          </>
        )}

        {page === 'recipe' && dishName && (
          <>
            <Feather name="chevron-right" size={10} color={COLORS.border} />
            <View style={styles.recipeTag}>
              <Text style={[styles.breadcrumbText, styles.activeText]} numberOfLines={1}>{dishName.toUpperCase()}</Text>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    paddingVertical: 16,
    marginBottom: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  breadcrumbText: { 
    color: '#8E8E93', 
    fontSize: 9, 
    fontWeight: '700',
    letterSpacing: 2,
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

