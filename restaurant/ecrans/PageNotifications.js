/**
 * PAGE NOTIFICATIONS - Avec compte à rebours temps réel et support thème.
 */
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../logique/design/ThemeContext.js';
import { sendEmail } from '../logique/gestionnaires/email.js';
import { Alert, ActivityIndicator } from 'react-native';

const PageNotifications = ({ isMobile, user }) => {
  const { theme } = useTheme();
  const [timeLeft, setTimeLeft] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleTestEmail = async () => {
    if (!user) {
      Alert.alert("Connexion Requise", "Veuillez vous connecter pour tester l'envoi d'email.");
      return;
    }

    setIsSending(true);
    setSentSuccess(false);

    // On envoie juste l'email et le nom, EmailJS s'occupe du reste !
    const userName = user.user_metadata?.full_name || user.email.split('@')[0];
    const result = await sendEmail(user.email, userName);
    
    setIsSending(false);
    if (result.success) {
      setSentSuccess(true);
      setTimeout(() => setSentSuccess(false), 5000);
      Alert.alert("Succès ! 🍽️", `Email envoyé à ${user.email}. Vérifiez votre boîte de réception !`);
    } else {
      Alert.alert("Erreur ❌", "Impossible d'envoyer l'email via EmailJS. Vérifiez votre configuration.");
    }
  };

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

      {/* SECTION EMAIL TEST */}
      <View style={[styles.emailSection, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.emailHeader}>
          <MaterialCommunityIcons name="email-check-outline" size={24} color={theme.secondary} />
          <View>
            <Text style={[styles.notifTitle, { color: theme.text }]}>Notifications par Email</Text>
            <Text style={[styles.notifDesc, { color: theme.textSecondary }]}>Testez l'envoi vers : {user?.email || 'votre email'}</Text>
          </View>
        </View>
        <TouchableOpacity 
          key="email-test-button"
          style={[styles.testBtn, { backgroundColor: sentSuccess ? '#4CAF50' : theme.secondary }]} 
          onPress={handleTestEmail}
          disabled={isSending || sentSuccess}
        >
          {isSending ? (
            <ActivityIndicator key="loader" color="#FFF" size="small" />
          ) : (
            <Text style={[styles.testBtnText, { color: theme.isDark ? theme.primary : '#FFF' }]}>
              {sentSuccess ? 'EMAIL ENVOYÉ ! ✅' : 'ENVOYER UN TEST MAINTENANT'}
            </Text>
          )}
        </TouchableOpacity>

        {sentSuccess && (
          <View style={styles.successMessage}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={{ color: '#4CAF50', fontSize: 12, fontWeight: '600' }}>
              Vérifiez votre boîte de réception !
            </Text>
          </View>
        )}
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
  emailSection: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 0.5,
    marginBottom: 24,
    gap: 20,
  },
  emailHeader: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  testBtn: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testBtnText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: -10,
    paddingBottom: 10,
  },
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
