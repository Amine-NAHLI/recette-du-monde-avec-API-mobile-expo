import { useState, useEffect } from 'react';
import { Platform, DevSettings } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { supabase } from '../appels_api/supabase';

WebBrowser.maybeCompleteAuthSession();

export default function useAuth() {
  const [user, setUser] = useState(null);

  const promptAsync = async () => {
    try {
      const redirectUri = AuthSession.makeRedirectUri();
      console.log("Utilisation de Redirect URI:", redirectUri);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUri,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
        
        // LOGIQUE CRUCIALE : On récupère les tokens de l'URL
        if (result.type === 'success' && result.url) {
          console.log("Extraction de la session depuis l'URL...");
          const params = extractParams(result.url);
          
          if (params.access_token && params.refresh_token) {
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: params.access_token,
              refresh_token: params.refresh_token,
            });
            if (sessionError) throw sessionError;
            console.log("Session établie avec succès !");
          }
        }
      }
    } catch (error) {
      console.error("Erreur de connexion:", error.message);
    }
  };

  // Fonction pour extraire les tokens de l'URL (format #access_token=...&refresh_token=...)
  const extractParams = (url) => {
    const params = {};
    const anchor = url.split('#')[1];
    if (anchor) {
      anchor.split('&').forEach((part) => {
        const [key, value] = part.split('=');
        params[key] = value;
      });
    }
    return params;
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Nouvel état Auth:", _event);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    if (Platform.OS === 'web') {
      window.location.reload();
    } else {
      DevSettings.reload();
    }
  };

  return { user, promptAsync, logout };
}
