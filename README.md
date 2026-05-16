# 🍽️ Saveurs du Monde

[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![EmailJS](https://img.shields.io/badge/EmailJS-F1C40F?style=for-the-badge&logo=mail.ru&logoColor=black)](https://www.emailjs.com/)

**Saveurs du Monde** est une application mobile gastronomique conçue pour les passionnés de cuisine. Elle offre une expérience immersive pour découvrir, sauvegarder et recevoir des recettes du monde entier, avec un système de notifications email élégant et automatisé.

---

## ✨ Fonctionnalités Clés

- 🌍 **Exploration Globale** : Découvrez des recettes authentiques classées par origines.
- ❤️ **Favoris Personnalisés** : Sauvegardez vos pépites culinaires pour les retrouver en un clic.
- 🌓 **Mode Sombre & Clair** : Une interface premium qui s'adapte à vos préférences.
- 📧 **Système de Notifications Email** : Recevez chaque jour à 16h00 une dose d'inspiration directement dans votre boîte mail (intégré avec **EmailJS** & **Supabase Edge Functions**).
- 📱 **Multi-plateforme** : Une expérience fluide sur iOS, Android et Web.

---

## 🛠️ Stack Technique

- **Frontend** : React Native / Expo
- **Backend** : Supabase (Auth & Database)
- **Email Service** : EmailJS via Edge Functions (Deno runtime)
- **Design** : Système de thème dynamique avec micro-animations

---

## 🚀 Installation & Lancement

### 1. Cloner le projet
```bash
git clone https://github.com/Amine-NAHLI/recette-du-monde-avec-API-mobile-expo.git
cd recette-du-monde-avec-API-mobile-expo
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer les variables d'environnement
Créez un fichier `.env` à la racine (ou configurez directement dans `auth.js`) :
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

### 4. Lancer l'application
```bash
npx expo start
```

---

## 🏗️ Architecture du Projet

```text
├── restaurant/
│   ├── ecrans/             # Pages de l'application (Notifications, Favoris, etc.)
│   ├── logique/
│   │   ├── design/         # ThemeContext & Styles
│   │   └── gestionnaires/  # API, Email, Auth, Notifications
├── supabase/
│   └── functions/          # Edge Functions (Email Relay)
└── App.js                  # Point d'entrée principal
```

---

## 📧 Service de Notifications

L'application utilise une architecture hybride pour l'envoi d'emails :
1. L'application appelle une **Edge Function** sécurisée sur Supabase.
2. La fonction relaie la demande à **EmailJS**.
3. L'utilisateur reçoit un email HTML premium personnalisé.

---

## 👤 Auteur

**Amine NAHLI**  
*Passionné par le développement mobile et la gastronomie.*

---
⭐ *N'hésitez pas à mettre une étoile au projet si vous l'aimez !*
