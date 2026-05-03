/**
 * Styles globaux de l app (hors pages home / recipe / cartes explore).
 * Utilise par App.js, ExplorePage, FavoritesPage et BottomNav pour la barre du bas.
 */
import { Platform, StyleSheet } from 'react-native';
import { COLORS } from '../design/couleurs';

export const styles = StyleSheet.create({
  // --- Racine ecran : fond, zone scroll, marge sous le header fixe ---
  container: { flex: 1, backgroundColor: COLORS.background },
  mainScroll: { alignSelf: 'center', width: '100%', maxWidth: 1200 },
  pageBody: { paddingTop: 100 },

  // --- En-tete de section (page Explorer / Favoris : surtitre + titre) ---
  sectionHeader: { marginBottom: 32 },
  headerPreBadge: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  badgeLine: { width: 20, height: 1, backgroundColor: COLORS.secondary },
  headerPreText: { color: COLORS.secondary, fontSize: 10, fontWeight: '800', letterSpacing: 4 },
  mainTitle: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: '300',
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
  },

  // --- Erreur API + lien reessayer ---
  errorBanner: {
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.secondary,
  },
  errorText: { color: '#FFF', fontSize: 13, fontWeight: '400' },
  retryLink: {
    color: COLORS.secondary,
    fontWeight: '700',
    textDecorationLine: 'underline',
    fontSize: 12,
  },

  // --- Chargement plein contenu (petit indicateur sous le header) ---
  globalLoader: { padding: 60, alignItems: 'center' },

  // --- Plat mis en avant sur la page liste d une cuisine (premiere carte) ---
  heroDishBox: { marginBottom: 40, position: 'relative' },
  heroBadge: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 0,
  },
  heroBadgeText: { color: COLORS.primary, fontSize: 9, fontWeight: '900', letterSpacing: 2 },

  // --- Page favoris vide ---
  emptyState: { alignItems: 'center', paddingVertical: 100, gap: 24 },
  emptyText: { color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: '300', letterSpacing: 1 },

  // --- Barre de navigation inferieure (Accueil / Explorer / Favoris) ---
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: 'rgba(10, 10, 11, 0.98)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(212, 175, 55, 0.15)',
  },
  navItem: { alignItems: 'center', gap: 6 },
  navText: { color: 'rgba(255,255,255,0.5)', fontSize: 9, fontWeight: '600', letterSpacing: 1 },
  navBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.secondary,
  },
});

