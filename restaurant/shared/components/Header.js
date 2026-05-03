import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Platform, Alert } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const Header = ({ isMobile, goFavorites, favCount }) => (
  <View style={styles.outerContainer}>
    <View style={[styles.header, isMobile && styles.headerMobile]}>
      <View style={{ width: 40 }} />
      
      <View style={styles.brandContainer}>
        <Text style={styles.brandMain}>RÉSERVE</Text>
        <View style={styles.brandDot} />
      </View>

      <TouchableOpacity onPress={goFavorites} style={styles.iconBtn}>
        <MaterialCommunityIcons name="bookmark-outline" size={22} color={COLORS.secondary} />
        {favCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{favCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  outerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(5, 5, 5, 0.85)',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(212, 175, 55, 0.15)',
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
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandMain: {
    fontSize: 18,
    fontWeight: '300',
    color: COLORS.text,
    letterSpacing: 6,
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
  },
  brandDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.secondary,
    marginTop: 4,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.secondary,
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
    color: COLORS.primary,
  }
});

export default Header;

