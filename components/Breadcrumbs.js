import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const Breadcrumbs = ({ page, isMobile, goHome, goCuisines, openCuisine, selectedCuisine, dishName }) => {
  return (
    <View style={[styles.breadcrumbBar, isMobile && { gap: 6, marginBottom: 16 }]}>
      <TouchableOpacity onPress={goHome}><Text style={styles.breadcrumbText}>ACCUEIL</Text></TouchableOpacity>
      
      {page === 'favorites' && (
        <>
          <Feather name="chevron-right" size={10} color={COLORS.textLight} />
          <Text style={[styles.breadcrumbText, { color: COLORS.secondary, fontWeight: '800' }]}>FAVORIS</Text>
        </>
      )}

      {(page === 'cuisines' || page === 'dishes' || page === 'recipe') && (
        <>
          <Feather name="chevron-right" size={10} color={COLORS.textLight} />
          <TouchableOpacity onPress={goCuisines}><Text style={[styles.breadcrumbText, page === 'cuisines' && { color: COLORS.secondary, fontWeight: '800' }]}>CUISINES</Text></TouchableOpacity>
        </>
      )}

      {(page === 'dishes' || page === 'recipe') && selectedCuisine && (
        <>
          <Feather name="chevron-right" size={10} color={COLORS.textLight} />
          <TouchableOpacity onPress={() => openCuisine(selectedCuisine)}><Text style={[styles.breadcrumbText, page === 'dishes' && { color: COLORS.secondary, fontWeight: '800' }]}>{selectedCuisine.toUpperCase()}</Text></TouchableOpacity>
        </>
      )}

      {page === 'recipe' && dishName && (
        <>
          <Feather name="chevron-right" size={10} color={COLORS.textLight} />
          <Text style={[styles.breadcrumbText, { color: COLORS.secondary, fontWeight: '800', flexShrink: 1 }]} numberOfLines={1}>{dishName.toUpperCase()}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  breadcrumbBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 10, flexWrap: 'wrap' },
  breadcrumbText: { color: COLORS.textLight, fontSize: 11, letterSpacing: 0.5 },
});

export default Breadcrumbs;
