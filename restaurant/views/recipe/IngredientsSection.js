import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';

export default function IngredientsSection({ ingredients, isMobile }) {
  return (
    <View style={[styles.section, !isMobile && styles.desktopCol]}>
      <Text style={styles.sectionTitle}>Composition</Text>
      <View style={styles.ingredientsList}>
        {ingredients.map((ingredient) => (
          <View key={ingredient} style={styles.ingredientRow}>
            <View style={styles.ingDot} />
            <Text style={styles.ingText}>{ingredient}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
