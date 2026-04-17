import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const Header = ({ isMobile, goFavorites, favCount }) => (
  <View style={[
    styles.navbar, 
    isMobile && { 
      flexDirection: 'column', 
      paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40, 
      paddingBottom: 15,
      gap: 8 
    }
  ]}>
    <Text style={[styles.logoText, isMobile && { fontSize: 14 }]}>RESTAURANT DU MONDE</Text>
    <TouchableOpacity onPress={goFavorites} style={{ padding: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <MaterialIcons name="favorite" size={18} color={COLORS.secondary} />
        {!isMobile && <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '700' }}>FAVORIS ({favCount})</Text>}
      </View>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  navbar: { 
    backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 18, 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    shadowColor: '#000', shadowOpacity: 0.12, shadowOffset: { width: 0, height: 4 }, elevation: 8 
  },
  logoText: { color: COLORS.secondary, fontSize: 20, fontWeight: '800', letterSpacing: 2 },
});

export default Header;
