/**
 * Point d entree Expo : enregistre App comme composant racine (`main`).
 * Obligatoire pour Expo Go et les builds natives.
 */
import { registerRootComponent } from 'expo';

import App from './App';

registerRootComponent(App);
