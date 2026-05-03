import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';
import { styles } from '../styles/appStyles';

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

      <TouchableOpacity style={styles.navItem} onPress={goCuisines}>
        <Ionicons
          name={isExplore ? 'compass' : 'compass-outline'}
          size={22}
          color={isExplore ? COLORS.secondary : '#FFF'}
        />
        <Text style={[styles.navText, isExplore && { color: COLORS.secondary }]}>
          EXPLORER
        </Text>
      </TouchableOpacity>

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
