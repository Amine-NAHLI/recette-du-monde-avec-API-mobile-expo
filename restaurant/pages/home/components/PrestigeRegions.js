import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { PRESTIGE_REGIONS } from './constants';
import { styles } from './styles';

export default function PrestigeRegions({ setPage }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionPre}>SELECTION</Text>
        <Text style={styles.sectionTitle}>Regions de Prestige</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.regionScroll}
      >
        {PRESTIGE_REGIONS.map((region) => (
          <TouchableOpacity
            key={region.name}
            style={styles.regionCard}
            onPress={() => setPage('cuisines')}
          >
            <View style={styles.regionIconBox}>
              <Ionicons name={region.icon} size={28} color={COLORS.secondary} />
            </View>
            <Text style={styles.regionName}>{region.name}</Text>
            <Text style={styles.regionDesc}>{region.desc}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
