import { useState, useEffect } from 'react';
import { Platform, DevSettings } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from '../appels_api/supabase';

WebBrowser.maybeCompleteAuthSession();

// ======================================================================
// Extraction des tokens depuis une URL de redirection OAuth
// Gère à la fois les hash fragments (#access_token=...) et query params (?access_token=...)
// ======================================================================
const extractSessionParams = (url) => {
  const params = {};
  try {
    // 1. Essayer le hash fragment (méthode par défaut de Supabase implicit flow)
    const hashIndex = url.indexOf('#');
    if (hashIndex !== -1) {
      const hashStr = url.substring(hashIndex + 1);
      hashStr.split('&').forEach((pair) => {
        const eqIdx = pair.indexOf('=');
        if (eqIdx > 0) {
          params[pair.substring(0, eqIdx)] = decodeURIComponent(pair.substring(eqIdx + 1));
        }
      });
    }

    // 2. Si pas de tokens dans le hash, essayer les query parameters
    if (!params.access_token) {
      const qIdx = url.indexOf('?');
      if (qIdx !== -1) {
        const end = hashIndex !== -1 ? hashIndex : url.length;
        const queryStr = url.substring(qIdx + 1, end);
        queryStr.split('&').forEach((pair) => {
          const eqIdx = pair.indexOf('=');
          if (eqIdx > 0) {
            params[pair.substring(0, eqIdx)] = decodeURIComponent(pair.substring(eqIdx + 1));
          }
        });
      }
    }
  } catch (e) {
    console.error("❌ Erreur extraction parametres URL :", e.message);
  }
  return params;
};

export default function useAuth() {
  const [user, setUser] = useState(null);

  // ======================================================================
  // Traite une URL de redirection : extrait les tokens et établit la session
  // ======================================================================
  const createSessionFromUrl = async (url) => {
    console.log("=========================================");
    console.log("🔗 URL DE REDIRECTION RECUE");
    console.log("👉 URL :", url);
    console.log("=========================================");

    const params = extractSessionParams(url);
    console.log("👉 access_token trouvé :", params.access_token ? "OUI ✅" : "NON ❌");
    console.log("👉 refresh_token trouvé :", params.refresh_token ? "OUI ✅" : "NON ❌");

    if (params.error) {
      console.error("❌ Erreur OAuth dans l'URL :", params.error);
      console.error("   Description :", params.error_description);
      return;
    }

    if (params.access_token && params.refresh_token) {
      console.log("🔑 Etablissement de la session Supabase...");
      try {
        const { data, error } = await supabase.auth.setSession({
          access_token: params.access_token,
          refresh_token: params.refresh_token,
        });
        if (error) {
          console.error("❌ Erreur setSession :", error.message);
        } else {
          console.log("✅ CONNEXION REUSSIE !");
          console.log("👉 Utilisateur :", data?.user?.email);
        }
      } catch (e) {
        console.error("❌ Exception setSession :", e.message);
      }
    } else {
      console.warn("⚠️ Aucun token trouvé dans l'URL de retour.");
      console.warn("   Parametres disponibles :", Object.keys(params).join(', '));
    }
  };

  // ======================================================================
  // Lance la connexion Google via Supabase OAuth
  // Utilise expo-linking pour gérer la redirection (compatible Expo Go)
  // ======================================================================
  const promptAsync = async () => {
    console.log("=========================================");
    console.log("🚀 DEBUT CONNEXION GOOGLE");
    console.log("=========================================");
    try {
      // 1. Generer l'URL de redirection via expo-linking
      const redirectUrl = Linking.createURL('/');
      console.log("[Etape 1] Redirect URL :", redirectUrl);
      console.log("[Etape 1] Plateforme :", Platform.OS);

      // 2. Demander à Supabase de generer l'URL OAuth Google
      console.log("[Etape 2] Appel signInWithOAuth...");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        console.error("❌ Erreur signInWithOAuth :", error.message);
        throw error;
      }

      console.log("[Etape 2] ✅ URL OAuth obtenue :", data?.url);

      if (data?.url) {
        // 3. Ouvrir la page Google dans le navigateur externe
        //    On utilise Linking.openURL au lieu de WebBrowser.openAuthSessionAsync
        //    car openAuthSessionAsync ne gère pas correctement les redirections
        //    exp:// sur Expo Go Android (le Custom Chrome Tab ne capture pas le redirect)
        console.log("[Etape 3] Ouverture du navigateur externe via Linking.openURL...");
        await Linking.openURL(data.url);
        console.log("[Etape 3] ✅ Navigateur ouvert. En attente du retour via deep link...");
      } else {
        console.error("❌ URL OAuth vide ou non definie.");
      }
    } catch (err) {
      console.error("=========================================");
      console.error("❌ ERREUR AUTH GOOGLE");
      console.error("Message :", err.message);
      console.error("Stack :", err.stack);
      console.error("=========================================");
    }
  };

  // ======================================================================
  // useEffect : écoute les deep links et gère l'état d'authentification
  // ======================================================================
  useEffect(() => {
    console.log("🔔 Initialisation de useAuth...");

    // --- DEEP LINK LISTENER ---
    // Quand l'utilisateur revient de Google, l'URL contient les tokens.
    // Ce listener les capture et établit la session.
    const linkSubscription = Linking.addEventListener('url', ({ url }) => {
      console.log("🔗 Deep link reçu via addEventListener :", url);
      if (url && (url.includes('access_token') || url.includes('error'))) {
        createSessionFromUrl(url);
      }
    });

    // Vérifier si l'app a été ouverte via un deep link (cold start / après crash)
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log("🔗 URL initiale detectee :", url);
        if (url.includes('access_token') || url.includes('error')) {
          createSessionFromUrl(url);
        }
      } else {
        console.log("🔗 Aucune URL initiale.");
      }
    }).catch((err) => {
      console.error("❌ Erreur getInitialURL :", err.message);
    });

    // --- AUTH STATE ---
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("👉 Session existante :", session ? `Connecté (${session.user.email})` : "Aucune");
      setUser(session?.user ?? null);
    }).catch((err) => {
      console.error("❌ Erreur getSession :", err.message);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("🔔 Changement auth :", event, session?.user?.email || "deconnecte");
      setUser(session?.user ?? null);
    });

    return () => {
      linkSubscription.remove();
      subscription.unsubscribe();
    };
  }, []);

  // ======================================================================
  // Déconnexion
  // ======================================================================
  const logout = async () => {
    console.log("🔄 Deconnexion...");
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("❌ Erreur deconnexion :", error.message);
      } else {
        console.log("✅ Deconnexion reussie !");
      }
    } catch (e) {
      console.error("❌ Exception deconnexion :", e.message);
    }

    if (Platform.OS === 'web') {
      window.location.reload();
    } else {
      DevSettings.reload();
    }
  };

  return { user, promptAsync, logout };
}
