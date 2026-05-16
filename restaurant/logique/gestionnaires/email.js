/**
 * Gestionnaire d'envoi d'emails via l'API Resend (Mobile) et Mailto (Web).
 */
import { Platform } from 'react-native';
import { supabase } from './auth.js'; 

/**
 * Envoie un email via EmailJS (Appel Direct).
 * @param {string} to - Destinataire
 * @param {string} userName - Nom de l'utilisateur pour le template
 */
export const sendEmail = async (to, userName) => {
  if (!to) return { success: false, error: 'Pas de destinataire' };

  try {
    console.log("🚀 Envoi direct via EmailJS pour:", to);
    
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: 'service_ak3blgj',
        template_id: 'template_6khu0tl',
        user_id: 'GmFoXxOu7KlCueEto',
        template_params: {
          email: to,
          name: userName || 'Gourmet',
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erreur EmailJS:", errorText);
      throw new Error(errorText);
    }

    console.log("✅ Email envoyé avec succès !");
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur Envoi Email:', error.message);
    return { success: false, error: error.message };
  }
};
