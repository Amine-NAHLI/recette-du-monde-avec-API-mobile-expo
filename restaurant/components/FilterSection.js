import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const FilterSection = ({ showFilter, setShowFilter, filterCountry, setFilterCountry, areas }) => (
  <View style={{ marginBottom: 24 }}>
    <TouchableOpacity style={styles.filterTrigger} onPress={() => setShowFilter(true)}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Feather name="map-pin" size={16} color={COLORS.secondary} />
        <Text style={styles.filterTriggerText}>
          {filterCountry === "Tous" ? "FILTRER PAR PAYS" : filterCountry.toUpperCase()}
        </Text>
      </View>
      <Feather name="chevron-down" size={16} color={COLORS.textLight} />
    </TouchableOpacity>
    
    <Modal visible={showFilter} transparent animationType="fade">
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowFilter(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>CHOISIR UNE RÉGION</Text>
          <ScrollView>
            <TouchableOpacity 
              style={[styles.filterItem, filterCountry === "Tous" && styles.filterItemActive]}
              onPress={() => { setFilterCountry("Tous"); setShowFilter(false); }}
            >
              <Feather name="globe" size={16} color={COLORS.secondary} style={{ marginRight: 12 }} />
              <Text style={styles.filterItemText}>TOUTES LES RÉGIONS</Text>
            </TouchableOpacity>
            {areas.map((area, i) => (
              <TouchableOpacity 
                key={i} style={[styles.filterItem, filterCountry === area && styles.filterItemActive]}
                onPress={() => { setFilterCountry(area); setShowFilter(false); }}
              >
                <Text style={styles.filterItemText}>{area.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  </View>
);

const styles = StyleSheet.create({
  filterTrigger: { 
    backgroundColor: COLORS.card, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, 
    padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' 
  },
  filterTriggerText: { color: COLORS.text, fontSize: 13, fontWeight: '700', letterSpacing: 1.5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(26,26,46,0.85)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFFFFF', width: '90%', maxHeight: '75%', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOpacity: 0.2 },
  modalTitle: { fontSize: 14, fontWeight: '900', letterSpacing: 2, color: COLORS.primary, marginBottom: 20, textAlign: 'center' },
  filterItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 8, marginBottom: 4 },
  filterItemActive: { backgroundColor: COLORS.background },
  filterItemText: { fontSize: 13, fontWeight: '700', color: COLORS.text, letterSpacing: 1.5 },
});

export default FilterSection;
