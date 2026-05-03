# 📜 DOCUMENTATION DÉTAILLÉE - RESTAURANT DU MONDE

Cette documentation explique l'architecture technique, les fonctionnalités et le flux de données de l'application **Restaurant du Monde**.

---

## 🏗️ 1. ARCHITECTURE TECHNIQUE

Le projet est organisé selon une structure modulaire pour garantir la séparation des préoccupations (SOC - Separation of Concerns). Chaque dossier a un rôle spécifique :

Voir aussi **`restaurant/GUIDE_FICHIERS.md`** pour le récapitulatif fichier par fichier.

### 📁 `restaurant/logique/constants/`
- **`theme.js`** : **Design system** — couleurs globales (`COLORS`) utilisées dans toute l'application.

### 📁 `restaurant/logique/services/`
- **`api.js`** : Réexport central des appels **TheMealDB**.
- **`cuisines.js`** : `fetchCuisines` — liste des régions / zones culinaires.
- **`dishes.js`** : `fetchDishesByCountry` — plats par zone (+ champ `area`).
- **`recipes.js`** : `fetchRecipeById` — détail d'une recette (ingrédients, instructions brutes).

### 📁 `restaurant/logique/utils/`
- **`layout.js`** : **Responsive** — drapeaux, colonnes grille, paddings, largeur des cartes.
- **`recipeFormatter.js`** : Transformation du JSON MealDB en objet `recipe` affichable.

### 📁 `restaurant/composants_partages/components/`
- **`Header.js`**, **`Breadcrumbs.js`**, **`BottomNav.js`**, **`LoadingScreen.js`** : enveloppe commune (navigation, fil d'Ariane, chargement).

### 📁 `restaurant/ecrans/` (une page = un dossier)
- **`ecrans/accueil/HomePage.js`** : Accueil (hero + régions + stats).
- **`ecrans/exploration/ExplorePage.js`** : Liste des cuisines ou des plats d'une cuisine ; filtre par zone.
- **`ecrans/recette/RecipePage.js`** : Détail recette (ingrédients + étapes).
- **`ecrans/favoris/FavoritesPage.js`** : Liste des favoris persistés.

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
2. **Chargement** : `restaurant/logique/services/` envoie des requêtes à TheMealDB. Les pays sont stockés dans `areas`.
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

