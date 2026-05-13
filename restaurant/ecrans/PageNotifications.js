import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../logique/design/couleurs.js';

const PageNotifications = ({ isMobile }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Ionicons name="notifications-outline" size={40} color={COLORS.secondary} />
        <Text style={styles.title}>Centre de Notifications</Text>
        <Text style={styles.subtitle}>Gérez vos rappels et actualités</Text>
      </View>

      <View style={styles.notifCard}>
        <View style={styles.iconCircle}>
          <Ionicons name="time-outline" size={24} color={COLORS.secondary} />
        </View>
        <View style={styles.notifContent}>
          <Text style={styles.notifTitle}>Rappel Quotidien Activé</Text>
          <Text style={styles.notifDesc}>Chaque jour à 16:00 : "N'oubliez pas votre recette du monde"</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>PLANIFIÉ</Text>
          </View>
        </View>
      </View>

      <View style={[styles.notifCard, { opacity: 0.5 }]}>
        <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
          <Ionicons name="gift-outline" size={24} color="#666" />
        </View>
        <View style={styles.notifContent}>
          <Text style={[styles.notifTitle, { color: '#888' }]}>Offre de Bienvenue</Text>
          <Text style={styles.notifDesc}>Merci d'avoir rejoint Saveurs du Monde !</Text>
          <Text style={styles.timeAgo}>Il y a 2 jours</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 24, paddingBottom: 100 },
  header: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
  title: { color: '#FFF', fontSize: 24, fontWeight: '300', marginTop: 16, letterSpacing: 2 },
  subtitle: { color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 8 },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: 'rgba(212, 175, 55, 0.1)',
    alignItems: 'center',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notifContent: { flex: 1 },
  notifTitle: { color: '#FFF', fontSize: 16, fontWeight: '600', marginBottom: 4 },
  notifDesc: { color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 18 },
  statusBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  statusText: { color: COLORS.primary, fontSize: 9, fontWeight: '900' },
  timeAgo: { color: 'rgba(255,255,255,0.2)', fontSize: 11, marginTop: 8 },
});

export default PageNotifications;
