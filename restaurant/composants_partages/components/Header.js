/**
 * Barre superieure fixe : titre de marque au centre, raccourci favoris a droite avec badge.
 * Inclut le bouton de basculement Dark/Light Mode.
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../logique/design/ThemeContext.js';

const Header = ({ isMobile, goFavorites, goNotifications, favCount, toggleTheme, isDark }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.outerContainer, { backgroundColor: theme.headerBg, borderBottomColor: theme.border }]}>
      <View style={[styles.header, isMobile && styles.headerMobile]}>
        {/* BOUTON NOTIFICATIONS */}
        <TouchableOpacity onPress={goNotifications} style={[styles.iconBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.04)' }]}>
          <MaterialCommunityIcons name="bell-outline" size={22} color={theme.secondary} />
        </TouchableOpacity>

        {/* --- LOGO DU SITE (TITRE RÉSERVE) --- */}
        <View style={styles.brandContainer}>
          <Text style={[styles.brandMain, { color: theme.text }]}>RÉSERVE</Text>
          <View style={[styles.brandDot, { backgroundColor: theme.secondary }]} />
        </View>

        {/* --- ACTIONS DROITES : THEME TOGGLE + FAVORIS --- */}
        <View style={styles.rightActions}>
          {/* BOUTON DARK/LIGHT MODE */}
          <TouchableOpacity 
            onPress={toggleTheme} 
            style={[styles.themeBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)' }]}
          >
            <Ionicons 
              name={isDark ? 'sunny-outline' : 'moon-outline'} 
              size={16} 
              color={theme.secondary} 
            />
          </TouchableOpacity>

          {/* BOUTON FAVORIS */}
          <TouchableOpacity onPress={goFavorites} style={[styles.iconBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.04)' }]}>
            <MaterialCommunityIcons name="bookmark-outline" size={22} color={theme.secondary} />
            {favCount > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.secondary }]}>
                <Text style={[styles.badgeText, { color: theme.primary }]}>{favCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    borderBottomWidth: 0.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    height: 70,
  },
  headerMobile: {
    height: 90,
    paddingTop: Platform.OS === 'ios' ? 40 : 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandMain: {
    fontSize: 18,
    fontWeight: '300',
    letterSpacing: 6,
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
  },
  brandDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '900',
  },
});

export default Header;
