# Guide des fichiers simplifié

Ce projet est organisé pour être facile à comprendre, avec un fichier principal par page.

## 📁 Racine du projet
- **`App.js`** : Point d'entrée principal. Il assemble les pages et gère la navigation globale.

## 📂 Dossier `restaurant/ecrans/` (Les Pages)
Chaque fichier ici représente une page complète de l'application :
- **`PageAccueil.js`** : Page d'accueil (Bannière Hero, régions de prestige, statistiques).
- **`PageExploration.js`** : Page pour découvrir les cuisines du monde et la liste des plats par pays.
- **`PageFavoris.js`** : Page affichant vos recettes sauvegardées.
- **`PageRecette.js`** : Page de détail d'une recette (Ingrédients, préparation).

## 📂 Dossier `restaurant/logique/` (Le Cerveau)
- **`appels_api/`** : Communication avec le serveur (MealDB).
- **`gestionnaires/`** : Gestion de l'état (Navigation, Favoris).
- **`outils/`** : Outils d'aide (Affichage responsive, Formatage des données).
- **`design/couleurs.js`** : Couleurs globales du projet.
- **`styles_globaux/styles_partages.js`** : Styles utilisés partout.

## 📂 Dossier `restaurant/composants_partages/`
- **`Header.js`** : Barre du haut.
- **`BottomNav.js`** : Barre de navigation du bas.
- **`Breadcrumbs.js`** : Fil d'ariane (Accueil > ...).
- **`LoadingScreen.js`** : Écran de chargement au démarrage.

## 📄 Autres
- **`restaurant/data.js`** : Données sur les pays et drapeaux.
