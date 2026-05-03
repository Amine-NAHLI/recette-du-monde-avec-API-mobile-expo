import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet, Platform } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const FilterSection = ({ showFilter, setShowFilter, filterCountry, setFilterCountry, areas }) => (
  <View style={styles.container}>
    <TouchableOpacity style={styles.trigger} activeOpacity={0.8} onPress={() => setShowFilter(true)}>
      <View style={styles.triggerContent}>
        <Ionicons name="map-outline" size={18} color={COLORS.secondary} />
        <Text style={styles.triggerText}>
          {filterCountry === "Tous" ? "SÉLECTIONNER UNE RÉGION" : filterCountry.toUpperCase()}
        </Text>
      </View>
      <Feather name="chevron-down" size={16} color={COLORS.secondary} />
    </TouchableOpacity>
    
    <Modal visible={showFilter} transparent animationType="fade">
      <View style={styles.modalBackdrop}>
        <View style={styles.modalPanel}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalPre}>GASTRONOMIE</Text>
              <Text style={styles.modalTitle}>Répertoire Global</Text>
            </View>
            <TouchableOpacity onPress={() => setShowFilter(false)} style={styles.closeBtn}>
              <Feather name="x" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
            <TouchableOpacity 
              style={[styles.item, filterCountry === "Tous" && styles.itemActive]}
              onPress={() => { setFilterCountry("Tous"); setShowFilter(false); }}
            >
              <Ionicons name="globe-outline" size={20} color={filterCountry === "Tous" ? COLORS.primary : COLORS.secondary} />
              <Text style={[styles.itemText, filterCountry === "Tous" && styles.itemTextActive]}>TOUTES LES ORIGINES</Text>
            </TouchableOpacity>

            {areas.map((area, i) => (
              <TouchableOpacity 
                key={i} 
                style={[styles.item, filterCountry === area && styles.itemActive]}
                onPress={() => { setFilterCountry(area); setShowFilter(false); }}
              >
                <Text style={[styles.itemIndex, filterCountry === area && { color: COLORS.primary }]}>{String(i + 1).padStart(2, '0')}</Text>
                <Text style={[styles.itemText, filterCountry === area && styles.itemTextActive]}>{area.toUpperCase()}</Text>
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
    marginTop: 10,
  },
  trigger: { 
    backgroundColor: 'rgba(255,255,255,0.02)', 
    borderWidth: 0.5, 
    borderColor: 'rgba(212, 175, 55, 0.3)', 
    paddingHorizontal: 20,
    paddingVertical: 18, 
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
    color: COLORS.text, 
    fontSize: 10, 
    fontWeight: '800', 
    letterSpacing: 2.5 
  },
  modalBackdrop: { 
    flex: 1, 
    backgroundColor: 'rgba(5,5,5,0.95)', 
    justifyContent: 'center',
    padding: 30 
  },
  modalPanel: { 
    backgroundColor: COLORS.primary, 
    maxHeight: '85%', 
    padding: 40,
    borderWidth: 0.5,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 50,
  },
  modalPre: { color: COLORS.secondary, fontSize: 9, fontWeight: '800', letterSpacing: 4, marginBottom: 8 },
  modalTitle: { 
    fontSize: 28, 
    fontWeight: '300', 
    color: '#FFF',
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
  },
  closeBtn: {
    marginTop: -10,
    marginRight: -10,
    padding: 10,
  },
  list: {
    gap: 2,
  },
  item: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 20, 
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255,255,255,0.01)',
    gap: 25,
  },
  itemActive: { 
    backgroundColor: COLORS.secondary,
  },
  itemIndex: {
    color: 'rgba(212, 175, 55, 0.5)',
    fontSize: 11,
    fontWeight: '700',
    width: 25,
  },
  itemText: { 
    fontSize: 13, 
    fontWeight: '400', 
    color: 'rgba(255,255,255,0.6)', 
    letterSpacing: 2 
  },
  itemTextActive: {
    color: COLORS.primary,
    fontWeight: '900',
  }
});

export default FilterSection;

