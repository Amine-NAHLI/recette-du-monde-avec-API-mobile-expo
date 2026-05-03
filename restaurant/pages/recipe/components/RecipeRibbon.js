import React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';
import { styles } from './styles';

export default function RecipeRibbon() {
  return (
    <View style={styles.ribbon}>
      <View style={styles.ribbonItem}>
        <Ionicons name="time-outline" size={14} color={COLORS.secondary} />
        <Text style={styles.ribbonText}>45 MIN</Text>
      </View>
      <View style={styles.ribbonDot} />
      <View style={styles.ribbonItem}>
        <Ionicons name="people-outline" size={14} color={COLORS.secondary} />
        <Text style={styles.ribbonText}>4 PERSONNES</Text>
      </View>
      <View style={styles.ribbonDot} />
      <View style={styles.ribbonItem}>
        <Ionicons name="wine-outline" size={14} color={COLORS.secondary} />
        <Text style={styles.ribbonText}>SELECTION</Text>
      </View>
    </View>
  );
}
