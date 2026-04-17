# 📜 DOCUMENTATION DÉTAILLÉE - RESTAURANT DU MONDE

Cette documentation explique l'architecture technique, les fonctionnalités et le flux de données de l'application **Restaurant du Monde**.

---

## 🏗️ 1. ARCHITECTURE TECHNIQUE

Le projet est organisé selon une structure modulaire pour garantir la séparation des préoccupations (SOC - Separation of Concerns). Chaque dossier a un rôle spécifique :

### 📁 `restaurant/constants/`
- **`theme.js`** : Contient le **Design System**. Toutes les couleurs (Primaire, Secondaire, Background) sont centralisées ici. Cela permet un changement de charte graphique instantané sur toute l'application.

### 📁 `restaurant/services/`
- **`api.js`** : Gère toute la logique de communication avec l'API externe **TheMealDB**.
    - `fetchCuisines` : Récupère la liste des régions du monde.
    - `fetchDishesByCountry` : Récupère les plats associés à un pays spécifique.
    - `fetchRecipeById` : Récupère les détails complets d'une recette (ingrédients, instructions).

### 📁 `restaurant/utils/`
- **`layout.js`** : Regroupe les outils de calcul pour le **Responsive Design**.
    - `getCols` : Détermine le nombre de colonnes (1 pour mobile, 2 pour tablette, 3 pour desktop).
    - `getCardWidth` : Calcule la largeur exacte des cartes en pixels selon la taille de l'écran.

### 📁 `restaurant/components/` (UI Atomique)
- **`Header.js`** : Barre de navigation supérieure avec logo et compteur de favoris réactif.
- **`Card.js`** : Composant de carte réutilisable. Affiche une image, un badge de pays et le bouton favori.
- **`Breadcrumbs.js`** : Système de navigation hiérarchique (Fil d'Ariane) permettant de remonter les niveaux.
- **`FilterSection.js`** : Gère le filtrage des cuisines par pays avec une fenêtre modale élégante.
- **`LoadingScreen.js`** : Écran d'accueil animé avec barre de progression et messages cycliques.

### 📁 `restaurant/views/` (Screens dynamiques)
- **`HomeView.js`** : Mise en page de la page d'accueil (Hero cinématique + Statistiques API).
- **`RecipeView.js`** : Page de détail d'une recette avec gestion intelligente du double-colonne sur grand écran.

---

## 🌟 2. FONCTIONNALITÉS PRINCIPALES

### ❤️ Système de Favoris & Persistance
L'application utilise `@react-native-async-storage/async-storage` pour sauvegarder vos choix.
- **Ajout/Suppression** : La fonction `toggleFavorite` vérifie si le plat existe déjà pour l'ajouter ou le retirer.
- **Cycle de vie** : Au démarrage, l'application lit la mémoire locale. À chaque changement des favoris, elle ré-enregistre la liste automatiquement.

### 📱 Responsive Design Multi-Plateforme
Grâce à `useWindowDimensions`, l'application détecte en temps réel la taille de l'écran :
- **Mobile (<768px)** : Affichage vertical, images 4:3, menus simplifiés.
- **Tablet (768px - 1024px)** : Grilles de 2 colonnes.
- **Desktop (>1024px)** : Grilles de 3 colonnes, contenus larges (1200px max), détails de recettes en côte-à-côte.

### 📊 Statistiques Dynamiques
La barre de statistiques sur l'accueil n'est pas statique. Elle calcule :
- Le nombre exact de cuisines en comptant les clés de l'objet `areas`.
- Le nombre total de recettes uniques présentes dans le cache de l'application.

---

## 🔄 3. FLUX DE DONNÉES (DATA FLOW)

1. **Initialisation** : `App.js` monte le composant. `useEffect` déclenche `loadContent`.
2. **Chargement** : `api.js` envoie des requêtes à TheMealDB. Les pays sont stockés dans `areas`.
3. **Mise en cache** : Les plats de chaque pays sont stockés dans `cuisinesDict` pour éviter de recharger les données si l'utilisateur revient en arrière.
4. **Détail** : Lorsqu'une recette est ouverte, ses détails (ingrédients splittés, instructions découpées par étapes) sont stockés dans `recipeCache`.
5. **Rendu** : React ne redessine que les parties qui ont changé (ex: juste le chiffre des favoris ou la couleur du cœur).

---

## 🛠️ 4. TECHNOLOGIES UTILISÉES
- **React Native / Expo** : Framework de base.
- **Vector Icons (@expo/vector-icons)** : Utilisation de `Feather` et `MaterialIcons`.
- **AsyncStorage** : Base de données locale légère.
- **TheMealDB API** : Source de données culinaires internationale.

---

**Développé avec passion pour une expérience culinaire premium.**
