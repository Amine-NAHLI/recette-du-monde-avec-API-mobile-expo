/**
 * Navigation inferieure : relie home, liste cuisines (explorer) et favoris.
 * Utilise le ThemeContext pour s'adapter au mode clair/sombre.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../logique/design/ThemeContext.js';

export default function BottomNav({
  page,
  goHome,
  goCuisines,
  goFavorites,
  goNotifications,
  favoritesCount,
}) {
  const { theme } = useTheme();
  const isExplore = page === 'cuisines' || page === 'dishes';

  return (
    <View style={[styles.bottomNav, { backgroundColor: theme.bottomNavBg, borderTopColor: theme.border }]}>
      {/* --- BOUTON : ACCUEIL --- */}
      <TouchableOpacity style={styles.navItem} onPress={goHome}>
        <Ionicons
          name={page === 'home' ? 'home' : 'home-outline'}
          size={22}
          color={page === 'home' ? theme.secondary : theme.navIcon}
        />
        <Text style={[styles.navText, { color: page === 'home' ? theme.secondary : theme.textMuted }]}>
          ACCUEIL
        </Text>
      </TouchableOpacity>

      {/* --- BOUTON : EXPLORER (Cuisines et Plats) --- */}
      <TouchableOpacity style={styles.navItem} onPress={goCuisines}>
        <Ionicons
          name={isExplore ? 'compass' : 'compass-outline'}
          size={22}
          color={isExplore ? theme.secondary : theme.navIcon}
        />
        <Text style={[styles.navText, { color: isExplore ? theme.secondary : theme.textMuted }]}>
          CUISINES
        </Text>
      </TouchableOpacity>

      {/* --- BOUTON : FAVORIS --- */}
      <TouchableOpacity style={styles.navItem} onPress={goFavorites}>
        <View>
          <Ionicons
            name={page === 'favorites' ? 'bookmark' : 'bookmark-outline'}
            size={22}
            color={page === 'favorites' ? theme.secondary : theme.navIcon}
          />
          {favoritesCount > 0 && <View style={[styles.navBadge, { backgroundColor: theme.secondary }]} />}
        </View>
        <Text style={[styles.navText, { color: page === 'favorites' ? theme.secondary : theme.textMuted }]}>
          FAVORIS
        </Text>
      </TouchableOpacity>

      {/* --- BOUTON : NOTIFICATIONS --- */}
      <TouchableOpacity style={styles.navItem} onPress={goNotifications}>
        <Ionicons
          name={page === 'notifications' ? 'notifications' : 'notifications-outline'}
          size={22}
          color={page === 'notifications' ? theme.secondary : theme.navIcon}
        />
        <Text style={[styles.navText, { color: page === 'notifications' ? theme.secondary : theme.textMuted }]}>
          NOTIFS
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
    borderTopWidth: 0.5,
  },
  navItem: { alignItems: 'center', gap: 6 },
  navText: { fontSize: 9, fontWeight: '600', letterSpacing: 1 },
  navBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
