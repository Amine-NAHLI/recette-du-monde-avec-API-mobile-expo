/**
 * ThemeContext — fournit le thème courant (dark/light) à toute l'application.
 * Utilise AsyncStorage pour persister le choix de l'utilisateur.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';

let AsyncStorage;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  AsyncStorage = null;
}

const DARK = {
  primary: '#0A0A0B',
  secondary: '#D4AF37',
  accent: '#C5A028',
  background: '#050505',
  card: 'rgba(255, 255, 255, 0.03)',
  text: '#F5F5F0',
  textSecondary: 'rgba(255,255,255,0.6)',
  textMuted: 'rgba(255,255,255,0.4)',
  textLight: '#8E8E93',
  border: 'rgba(212, 175, 55, 0.15)',
  success: '#99CC00',
  glass: 'rgba(255, 255, 255, 0.01)',
  gradient: ['#161618', '#0A0A0B'],
  headerBg: 'rgba(5, 5, 5, 0.85)',
  bottomNavBg: 'rgba(10, 10, 11, 0.98)',
  cardBg: '#121214',
  navIcon: '#FFF',
  overlay: 'rgba(0,0,0,0.4)',
  modalBg: 'rgba(5,5,5,0.95)',
  inputBg: 'rgba(255,255,255,0.02)',
  isDark: true,
};

const LIGHT = {
  primary: '#FFFFFF',
  secondary: '#B8860B',
  accent: '#996515',
  background: '#F8F6F1',
  card: 'rgba(0, 0, 0, 0.03)',
  text: '#1A1A1A',
  textSecondary: 'rgba(0,0,0,0.6)',
  textMuted: 'rgba(0,0,0,0.4)',
  textLight: '#6B6B70',
  border: 'rgba(184, 134, 11, 0.2)',
  success: '#6B8E23',
  glass: 'rgba(0, 0, 0, 0.02)',
  gradient: ['#F0EDE6', '#F8F6F1'],
  headerBg: 'rgba(255, 255, 255, 0.92)',
  bottomNavBg: 'rgba(255, 255, 255, 0.97)',
  cardBg: '#FFFFFF',
  navIcon: '#333',
  overlay: 'rgba(0,0,0,0.25)',
  modalBg: 'rgba(248,246,241,0.97)',
  inputBg: 'rgba(0,0,0,0.03)',
  isDark: false,
};

// Valeur par défaut pour éviter les crashes si le contexte n'est pas prêt
const defaultValue = { theme: DARK, isDark: true, toggleTheme: () => {} };
const ThemeContext = createContext(defaultValue);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    try {
      if (AsyncStorage) {
        AsyncStorage.getItem('theme_mode').then(val => {
          if (val === 'light') setIsDark(false);
        }).catch(() => {});
      }
    } catch (e) {
      console.log('Theme load error:', e);
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    try {
      if (AsyncStorage) {
        AsyncStorage.setItem('theme_mode', next ? 'dark' : 'light').catch(() => {});
      }
    } catch (e) {}
  };

  const theme = isDark ? DARK : LIGHT;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  // Sécurité : retourner les valeurs par défaut si le contexte est vide
  if (!ctx || !ctx.theme) return defaultValue;
  return ctx;
}
