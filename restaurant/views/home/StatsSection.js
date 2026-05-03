import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { styles } from './styles';

export default function StatsSection({ areasCount, recipesCount }) {
  return (
    <View style={styles.section}>
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{areasCount}</Text>
          <Text style={styles.statLabel}>CUISINES SYNC</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{recipesCount}</Text>
          <Text style={styles.statLabel}>RECETTES PRETES</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statBox}>
          <Ionicons name="ribbon-outline" size={24} color={COLORS.secondary} />
          <Text style={styles.statLabel}>ELUE APP #1</Text>
        </View>
      </View>
    </View>
  );
}
