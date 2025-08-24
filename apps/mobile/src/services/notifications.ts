
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// --- Notification Handler Configuration ---

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Requests permissions for push notifications.
 * This is required on both iOS and Android.
 * @returns A promise that resolves with the permission status.
 */
export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    console.warn('Push notifications can only be tested on physical devices.');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return;
  }
  
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  console.log('Notification permissions granted.');
  return finalStatus;
}


/**
 * Schedules a test local notification.
 * @param title The title of the notification.
 * @param body The body text of the notification.
 */
export async function scheduleTestNotification(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: { chatId: '1' }, // Example data: navigating to chat with QuantumLeap
    },
    trigger: { seconds: 2 }, // Fire after 2 seconds
  });
  console.log('Test notification scheduled.');
}
