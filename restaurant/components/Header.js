import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, BlurView } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const Header = ({ isMobile, goFavorites, favCount }) => (
  <View style={styles.headerContainer}>
    <View style={[styles.navbar, isMobile && styles.navbarMobile]}>
      <TouchableOpacity onPress={() => {}} style={styles.menuButton}>
        <Feather name="grid" size={24} color={COLORS.secondary} />
      </TouchableOpacity>
      
      <View style={styles.logoWrapper}>
        <Text style={styles.logoPart1}>CULINARY</Text>
        <Text style={styles.logoPart2}>X</Text>
      </View>

      <TouchableOpacity onPress={goFavorites} style={styles.favButton}>
        <MaterialCommunityIcons name="heart-pulse" size={26} color={COLORS.accent} />
        {favCount > 0 && <View style={styles.dot} />}
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  navbar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  navbarMobile: {
    height: 100,
    paddingTop: StatusBar.currentHeight || 40,
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  logoPart1: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '200',
    letterSpacing: 4,
  },
  logoPart2: {
    color: COLORS.secondary,
    fontSize: 24,
    fontWeight: '900',
  },
  favButton: {
    position: 'relative',
    padding: 8,
  },
  dot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
    borderWidth: 2,
    borderColor: '#000',
  }
});

export default Header;
