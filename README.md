# 🍽️ Saveurs du Monde (Restaurant du Monde)

[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![EmailJS](https://img.shields.io/badge/EmailJS-F1C40F?style=for-the-badge&logo=mail.ru&logoColor=black)](https://www.emailjs.com/)
[![TheMealDB](https://img.shields.io/badge/TheMealDB-API-FF9800?style=for-the-badge)](https://www.themealdb.com/)

**Saveurs du Monde** est une application mobile gastronomique multi-plateforme conçue pour les passionnés de cuisine. Elle offre une expérience premium et immersive pour découvrir, sauvegarder et recevoir des recettes authentiques du monde entier.

---

## ✨ Fonctionnalités Clés

- 🌍 **Exploration Globale** : Découvrez des recettes classées par régions culinaires grâce à l'intégration fluide de l'API TheMealDB.
- ❤️ **Favoris Locaux & Persistants** : Sauvegardez vos pépites culinaires grâce à `AsyncStorage`. Vos favoris sont stockés localement et toujours disponibles.
- 📱 **Responsive Design Multi-Plateforme** : Une interface intelligente qui s'adapte parfaitement à votre écran :
  - *Mobile* : Affichage vertical optimisé
  - *Tablette* : Grilles à 2 colonnes
  - *Desktop* : Grilles à 3 colonnes et vue détaillée côte-à-côte
- 🌓 **Interface Premium** : Système de thème dynamique avec micro-animations, mode sombre/clair et un design soigné.
- 📧 **Notifications Automatisées** : Recevez chaque jour à 16h00 une dose d'inspiration culinaire dans votre boîte mail.
- 📊 **Statistiques en Temps Réel** : Suivez le nombre de cuisines et de recettes explorées dynamiquement depuis l'accueil.

---

## 🛠️ Technologies Utilisées

- **Frontend** : React Native, Expo, React Navigation (`@react-navigation/native`)
- **Backend & Auth** : Supabase (Authentification & Edge Functions)
- **Stockage Local** : AsyncStorage (`@react-native-async-storage/async-storage`)
- **Source de Données** : TheMealDB API
- **Emails** : EmailJS relayé par Supabase Edge Functions (Deno runtime)
- **Design & UI** : `@expo/vector-icons` (Feather, MaterialIcons), Design System personnalisé

---

## 🚀 Installation & Démarrage

### 1. Prérequis
- [Node.js](https://nodejs.org/) installé
- Expo CLI (`npm install -g expo-cli`)
- Un compte Supabase et EmailJS (si vous souhaitez activer les notifications)

### 2. Cloner le projet
```bash
git clone https://github.com/Amine-NAHLI/recette-du-monde-avec-API-mobile-expo.git
cd recette-du-monde-avec-API-mobile-expo
```

### 3. Installer les dépendances
```bash
npm install
```

### 4. Variables d'Environnement
Créez un fichier `.env` à la racine (ou configurez vos clés dans le code, ex: `auth.js`) pour lier Supabase :
```env
SUPABASE_URL=votre_supabase_url
SUPABASE_ANON_KEY=votre_supabase_anon_key
```

### 5. Lancer l'application
```bash
npx expo start
```
*Scannez le QR code généré avec l'application **Expo Go** sur votre smartphone, ou lancez l'application sur un simulateur iOS / émulateur Android ou sur le Web.*

---

## 🏗️ Architecture du Projet

Le projet adopte une architecture modulaire stricte garantissant la séparation des préoccupations (SOC) :

```text
├── restaurant/
│   ├── composants_partages/ # Composants UI globaux (Header, Breadcrumbs, BottomNav)
│   ├── ecrans/              # Pages (HomePage, ExplorePage, RecipePage, FavoritesPage)
│   └── logique/             # Cœur métier et données
│       ├── constants/       # Design system (thème, couleurs)
│       ├── services/        # Appels API (TheMealDB) isolés par domaine
│       └── utils/           # Utilitaires (responsive layout, formatage de recettes)
├── supabase/
│   └── functions/           # Supabase Edge Functions (Ex: Email Relay)
├── App.js                   # Point d'entrée principal
└── DOCUMENTATION.md         # Documentation détaillée
```
*💡 Pour des informations plus poussées sur la structure technique, consultez le fichier [`DOCUMENTATION.md`](DOCUMENTATION.md).*

---

## 🔄 Flux de Données (Data Flow)

1. **Initialisation** : Au lancement (`App.js`), les données initiales sont chargées et mises en cache.
2. **Exploration** : Les régions et plats sont récupérés via `TheMealDB` et conservés en mémoire (`recipeCache`, `cuisinesDict`) pour éviter des rechargements inutiles.
3. **Persistance** : À chaque interaction avec le bouton ❤️, `AsyncStorage` est mis à jour en temps réel.
4. **Notifications** : Une fonction Edge hébergée sur Supabase communique de façon sécurisée avec EmailJS pour l'envoi d'emails HTML personnalisés.

---

## 👤 Auteur

**Amine NAHLI**  
*Développeur mobile et passionné de gastronomie.*
- [GitHub](https://github.com/Amine-NAHLI)

---

⭐ *Si vous appréciez cette application ou trouvez le code utile, n'hésitez pas à laisser une étoile sur GitHub !*
