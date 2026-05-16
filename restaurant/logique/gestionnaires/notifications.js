import { Platform } from 'react-native';
import Constants from 'expo-constants';

// On vérifie si on est dans Expo Go (qui ne supporte plus les notifs sur Android SDK 53)
const isExpoGo = Constants.appOwnership === 'expo';
const shouldSkipNotifications = Platform.OS === 'android' && isExpoGo;

let Notifications = null;
if (!shouldSkipNotifications && Platform.OS !== 'web') {
  // On ne charge la bibliothèque QUE si on n'est pas sur Expo Go Android
  Notifications = require('expo-notifications');
  
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export const setupNotifications = async () => {
  if (Platform.OS === 'web' || shouldSkipNotifications || !Notifications) {
    return;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') return;

    await Notifications.cancelAllScheduledNotificationsAsync();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "✨ L'Heure Gourmet de 16h",
        body: "Votre inspiration culinaire du jour est prête. Quel pays allons-nous explorer aujourd'hui ?",
        data: { screen: 'home' },
        sound: true,
      },
      trigger: { hour: 16, minute: 0, repeats: true },
    });
  } catch (error) {
    console.log("Notifs non supportées.");
  }
};
