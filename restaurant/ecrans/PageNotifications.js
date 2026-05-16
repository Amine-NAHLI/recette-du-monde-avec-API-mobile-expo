/**
 * PAGE NOTIFICATIONS - Avec compte à rebours temps réel et support thème.
 */
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../logique/design/ThemeContext.js';

const PageNotifications = ({ isMobile }) => {
  const { theme } = useTheme();
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const target = new Date();
      target.setHours(16, 0, 0, 0);

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
    calculateTime();

    return () => clearInterval(timer);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Ionicons name="notifications-outline" size={40} color={theme.secondary} />
        <Text style={[styles.title, { color: theme.text }]}>Centre de Notifications</Text>
        <Text style={[styles.subtitle, { color: theme.textMuted }]}>Gérez vos rappels et actualités</Text>
      </View>

      {/* COMPTE À REBOURS PREMIUM */}
      <View style={[styles.timerSection, { backgroundColor: theme.isDark ? 'rgba(212, 175, 55, 0.05)' : 'rgba(184, 134, 11, 0.06)', borderColor: theme.border }]}>
        <Text style={[styles.timerLabel, { color: theme.secondary }]}>PROCHAINE RECETTE DANS</Text>
        <Text style={[styles.timerValue, { color: theme.text }]}>{timeLeft}</Text>
        <View style={[styles.timerBarContainer, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }]}>
          <View style={[styles.timerBarActive, { backgroundColor: theme.secondary }]} />
        </View>
      </View>

      <View style={[styles.notifCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={[styles.iconCircle, { backgroundColor: theme.isDark ? 'rgba(212, 175, 55, 0.1)' : 'rgba(184, 134, 11, 0.1)' }]}>
          <Ionicons name="time-outline" size={24} color={theme.secondary} />
        </View>
        <View style={styles.notifContent}>
          <Text style={[styles.notifTitle, { color: theme.text }]}>Rappel Quotidien Activé</Text>
          <Text style={[styles.notifDesc, { color: theme.textSecondary }]}>Chaque jour à 16:00 : "Il est temps de découvrir votre nouvelle saveur du monde."</Text>
          <View style={[styles.statusBadge, { backgroundColor: theme.secondary }]}>
            <Text style={[styles.statusText, { color: theme.isDark ? theme.primary : '#FFF' }]}>PROGRAMMÉ</Text>
          </View>
        </View>
      </View>

      <View style={[styles.notifCard, { backgroundColor: theme.card, borderColor: theme.border, opacity: 0.5 }]}>
        <View style={[styles.iconCircle, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' }]}>
          <Ionicons name="gift-outline" size={24} color={theme.textLight} />
        </View>
        <View style={styles.notifContent}>
          <Text style={[styles.notifTitle, { color: theme.textLight }]}>Bienvenue sur Saveurs du Monde</Text>
          <Text style={[styles.notifDesc, { color: theme.textSecondary }]}>Explorez des milliers de recettes internationales dès maintenant.</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 24, paddingBottom: 100 },
  header: { alignItems: 'center', marginBottom: 40, marginTop: 20 },
  title: { fontSize: 24, fontWeight: '300', marginTop: 16, letterSpacing: 2 },
  subtitle: { fontSize: 13, marginTop: 8 },
  
  timerSection: {
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
  },
  timerLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 3, marginBottom: 15 },
  timerValue: { fontSize: 42, fontWeight: '200', letterSpacing: 5, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  timerBarContainer: { width: '100%', height: 2, marginTop: 20, borderRadius: 1 },
  timerBarActive: { width: '60%', height: '100%' },

  notifCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 0.5,
    alignItems: 'center',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notifContent: { flex: 1 },
  notifTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  notifDesc: { fontSize: 13, lineHeight: 18 },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  statusText: { fontSize: 9, fontWeight: '900' },
});

export default PageNotifications;
