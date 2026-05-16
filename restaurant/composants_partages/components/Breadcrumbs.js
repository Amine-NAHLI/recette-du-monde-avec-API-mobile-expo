/**
 * Fil d Ariane : reflete la pile logique home -> cuisines -> zone -> recette / favoris.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../logique/design/ThemeContext.js';

const Breadcrumbs = ({ page, isMobile, goHome, goCuisines, openCuisine, selectedCuisine, dishName }) => {
  const { theme } = useTheme();

  return (
    <View style={styles.outerContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
        {/* --- LIEN : RETOUR ACCUEIL --- */}
        <TouchableOpacity onPress={goHome} activeOpacity={0.6}>
          <Text style={[styles.breadcrumbText, { color: theme.textLight }]}>RÉSERVE</Text>
        </TouchableOpacity>

        {page === 'favorites' && (
          <>
            <Feather name="chevron-right" size={10} color={theme.border} />
            <Text style={[styles.breadcrumbText, { color: theme.secondary, fontWeight: '900' }]}>FAVORIS</Text>
          </>
        )}

        {page === 'notifications' && (
          <>
            <Feather name="chevron-right" size={10} color={theme.border} />
            <Text style={[styles.breadcrumbText, { color: theme.secondary, fontWeight: '900' }]}>NOTIFICATIONS</Text>
          </>
        )}

        {/* --- LIEN : EXPLORATION / CUISINES --- */}
        {(page === 'cuisines' || page === 'dishes' || page === 'recipe') && (
          <>
            <Feather name="chevron-right" size={10} color={theme.border} />
            <TouchableOpacity onPress={goCuisines} activeOpacity={0.6}>
              <Text style={[styles.breadcrumbText, { color: page === 'cuisines' ? theme.secondary : theme.textLight }, page === 'cuisines' && { fontWeight: '900' }]}>CUISINES</Text>
            </TouchableOpacity>
          </>
        )}

        {/* --- LIEN : PAYS SÉLECTIONNÉ --- */}
        {(page === 'dishes' || page === 'recipe') && selectedCuisine && (
          <>
            <Feather name="chevron-right" size={10} color={theme.border} />
            <TouchableOpacity onPress={() => openCuisine(selectedCuisine)} activeOpacity={0.6}>
              <Text style={[styles.breadcrumbText, { color: page === 'dishes' ? theme.secondary : theme.textLight }, page === 'dishes' && { fontWeight: '900' }]}>{selectedCuisine.toUpperCase()}</Text>
            </TouchableOpacity>
          </>
        )}

        {/* --- LIEN : PLAT ACTUEL --- */}
        {page === 'recipe' && dishName && (
          <>
            <Feather name="chevron-right" size={10} color={theme.border} />
            <View style={styles.recipeTag}>
              <Text style={[styles.breadcrumbText, { color: theme.secondary, fontWeight: '900' }]} numberOfLines={1}>{dishName.toUpperCase()}</Text>
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
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
  },
  recipeTag: {
    flexShrink: 1,
  },
});

export default Breadcrumbs;
