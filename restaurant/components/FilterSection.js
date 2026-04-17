import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet, BlurView } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const FilterSection = ({ showFilter, setShowFilter, filterCountry, setFilterCountry, areas }) => (
  <View style={styles.container}>
    <TouchableOpacity style={styles.trigger} activeOpacity={0.7} onPress={() => setShowFilter(true)}>
      <View style={styles.triggerContent}>
        <MaterialCommunityIcons name="radar" size={20} color={COLORS.secondary} />
        <Text style={styles.triggerText}>
          {filterCountry === "Tous" ? "SÉLECTIONNER RÉGION" : `RÉGION: ${filterCountry.toUpperCase()}`}
        </Text>
      </View>
      <Feather name="plus-square" size={20} color={COLORS.secondary} />
    </TouchableOpacity>
    
    <Modal visible={showFilter} transparent animationType="slide">
      <View style={styles.modalBackdrop}>
        <View style={styles.modalPanel}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>FLUX_RÉGIONS</Text>
            <TouchableOpacity onPress={() => setShowFilter(false)}>
              <Feather name="x-circle" size={24} color={COLORS.accent} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.list}>
            <TouchableOpacity 
              style={[styles.item, filterCountry === "Tous" && styles.itemActive]}
              onPress={() => { setFilterCountry("Tous"); setShowFilter(false); }}
            >
              <MaterialCommunityIcons name="earth" size={20} color={COLORS.secondary} />
              <Text style={styles.itemText}>TOUT_LE_RÉSEAU</Text>
              {filterCountry === "Tous" && <View style={styles.activeDot} />}
            </TouchableOpacity>

            {areas.map((area, i) => (
              <TouchableOpacity 
                key={i} 
                style={[styles.item, filterCountry === area && styles.itemActive]}
                onPress={() => { setFilterCountry(area); setShowFilter(false); }}
              >
                <Text style={styles.itemIndex}>{String(i + 1).padStart(2, '0')}</Text>
                <Text style={styles.itemText}>{area.toUpperCase()}</Text>
                {filterCountry === area && <View style={styles.activeDot} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  </View>
);

const styles = StyleSheet.create({
  container: { 
    marginBottom: 40,
    marginTop: 20,
  },
  trigger: { 
    backgroundColor: 'rgba(255,255,255,0.03)', 
    borderWidth: 1, 
    borderColor: COLORS.secondary, 
    padding: 20, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    borderRadius: 2,
  },
  triggerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  triggerText: { 
    color: '#FFF', 
    fontSize: 12, 
    fontWeight: '900', 
    letterSpacing: 3 
  },
  modalBackdrop: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.9)', 
    justifyContent: 'flex-end' 
  },
  modalPanel: { 
    backgroundColor: '#0A0A0A', 
    height: '80%', 
    borderTopWidth: 2, 
    borderTopColor: COLORS.secondary,
    padding: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: '900', 
    letterSpacing: 5, 
    color: '#FFF' 
  },
  list: {
    gap: 10,
  },
  item: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 20, 
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    gap: 20,
  },
  itemActive: { 
    borderColor: COLORS.secondary,
    backgroundColor: 'rgba(57, 255, 20, 0.05)',
  },
  itemIndex: {
    color: COLORS.textLight,
    fontSize: 10,
    fontWeight: '900',
  },
  itemText: { 
    fontSize: 14, 
    fontWeight: '700', 
    color: '#FFF', 
    letterSpacing: 2 
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.secondary,
    marginLeft: 'auto',
    shadowColor: COLORS.secondary,
    shadowOpacity: 1,
    shadowRadius: 5,
  }
});

export default FilterSection;
