/**
 * Navigation inferieure : relie home, liste cuisines (explorer) et favoris.
 * Les styles visuels sont dans logique/styles_globaux/styles_partages (bottomNav, navItem, …).
 */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../logique/design/couleurs.js';
import { styles } from '../../logique/styles_globaux/styles_partages.js';

export default function BottomNav({
  page,
  goHome,
  goCuisines,
  goFavorites,
  favoritesCount,
}) {
  const isExplore = page === 'cuisines' || page === 'dishes';

  return (
    <View style={styles.bottomNav}>
      {/* --- BOUTON : ACCUEIL --- */}
      <TouchableOpacity style={styles.navItem} onPress={goHome}>
        <Ionicons
          name={page === 'home' ? 'home' : 'home-outline'}
          size={22}
          color={page === 'home' ? COLORS.secondary : '#FFF'}
        />
        <Text style={[styles.navText, page === 'home' && { color: COLORS.secondary }]}>
          ACCUEIL
        </Text>
      </TouchableOpacity>

      {/* --- BOUTON : EXPLORER (Cuisines et Plats) --- */}
      <TouchableOpacity style={styles.navItem} onPress={goCuisines}>
        <Ionicons
          name={isExplore ? 'compass' : 'compass-outline'}
          size={22}
          color={isExplore ? COLORS.secondary : '#FFF'}
        />
        <Text style={[styles.navText, isExplore && { color: COLORS.secondary }]}>
          CUISINES
        </Text>
      </TouchableOpacity>

      {/* --- BOUTON : FAVORIS --- */}
      <TouchableOpacity style={styles.navItem} onPress={goFavorites}>
        <View>
          <Ionicons
            name={page === 'favorites' ? 'bookmark' : 'bookmark-outline'}
            size={22}
            color={page === 'favorites' ? COLORS.secondary : '#FFF'}
          />
          {favoritesCount > 0 && <View style={styles.navBadge} />}
        </View>
        <Text style={[styles.navText, page === 'favorites' && { color: COLORS.secondary }]}>
          FAVORIS
        </Text>
      </TouchableOpacity>
    </View>
  );
}


