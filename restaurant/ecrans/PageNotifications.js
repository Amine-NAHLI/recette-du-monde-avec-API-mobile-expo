import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../logique/design/couleurs.js';

const PageNotifications = ({ isMobile }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(16, 0, 0, 0);

      // Si il est déjà passé 16h, on cible 16h demain
      if (now > target) {
        target.setDate(target.getDate() + 1);
      }

      const diff = target - now;
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    const timer = setInterval(calculateTime, 1000);
    calculateTime(); // Appel initial

    return () => clearInterval(timer);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Ionicons name="notifications-outline" size={40} color={COLORS.secondary} />
        <Text style={styles.title}>Centre de Notifications</Text>
        <Text style={styles.subtitle}>Gérez vos rappels et actualités</Text>
      </View>

      {/* COMPTE À REBOURS PREMIUM */}
      <View style={styles.timerSection}>
        <Text style={styles.timerLabel}>PROCHAINE RECETTE DANS</Text>
        <Text style={styles.timerValue}>{timeLeft}</Text>
        <View style={styles.timerBarContainer}>
          <View style={styles.timerBarActive} />
        </View>
      </View>

      <View style={styles.notifCard}>
        <View style={styles.iconCircle}>
          <Ionicons name="time-outline" size={24} color={COLORS.secondary} />
        </View>
        <View style={styles.notifContent}>
          <Text style={styles.notifTitle}>Rappel Quotidien Activé</Text>
          <Text style={styles.notifDesc}>Chaque jour à 16:00 : "Il est temps de découvrir votre nouvelle saveur du monde."</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>PROGRAMMÉ</Text>
          </View>
        </View>
      </View>

      <View style={[styles.notifCard, { opacity: 0.5 }]}>
        <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
          <Ionicons name="gift-outline" size={24} color="#666" />
        </View>
        <View style={styles.notifContent}>
          <Text style={[styles.notifTitle, { color: '#888' }]}>Bienvenue sur Saveurs du Monde</Text>
          <Text style={styles.notifDesc}>Explorez des milliers de recettes internationales dès maintenant.</Text>
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
  
  timerSection: {
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  timerLabel: { color: COLORS.secondary, fontSize: 10, fontWeight: '800', letterSpacing: 3, marginBottom: 15 },
  timerValue: { color: '#FFF', fontSize: 42, fontWeight: '200', letterSpacing: 5, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  timerBarContainer: { width: '100%', height: 2, backgroundColor: 'rgba(255,255,255,0.1)', marginTop: 20, borderRadius: 1 },
  timerBarActive: { width: '60%', height: '100%', backgroundColor: COLORS.secondary },

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
});

export default PageNotifications;
