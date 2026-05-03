import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';

export default function InstructionsSection({ instructions, isMobile }) {
  return (
    <View style={[styles.section, !isMobile && styles.desktopCol, !isMobile && { paddingLeft: 60 }]}>
      <Text style={styles.sectionTitle}>Elaboration</Text>
      {instructions.map((step, index) => (
        <View key={`${step.slice(0, 20)}-${index}`} style={styles.stepBlock}>
          <View style={styles.stepHeader}>
            <Text style={styles.stepIndex}>{(index + 1).toString().padStart(2, '0')}</Text>
            <View style={styles.stepLine} />
          </View>
          <Text style={styles.stepContent}>{step}</Text>
        </View>
      ))}
    </View>
  );
}
