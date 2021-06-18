import firebase from '@react-native-firebase/app';
import { Notifications } from 'react-native-notifications';
import '@react-native-firebase/messaging';

export const FcmType = {
  LAUNCH: 'LAUNCH',
  INAPP: 'INAPP',
  BACKGROUND: 'BACKGROUND',
};

/**
 * Firebase Cloud Messaging Helper
 */
class FcmHelper {
  /**
   * initFirebaseMessaging
   * @returns {String} fcmToken. If something goes wrong, return null.
   */
  initFirebaseMessaging = async () => {
    try {
      await this.requestPermission();
      const fcmToken = await this.getFcmToken();
      return fcmToken;
    } catch (error) {
      console.log('initFirebaseMessaging, error: ', error);
      return null;
    }
  }

  getFcmToken = async () => {
    const fcmToken = await firebase.messaging().getToken();
    console.log('FirebaseMessaging, Your Firebase Token is: ', fcmToken);
    return fcmToken;
  }

   getInitialNotification = async () => {
     // When a notification from FCM has triggered the application to open from a quit state,
     // this method will return a RemoteMessage containing the notification data,
     // or null if the app was opened via another method.
     // const notificationOpen = await firebase.notifications().getInitialNotification();
     const notificationOpen = await Notifications.getInitialNotification();
     if (notificationOpen) {
       // return notificationOpen.notification;
       return notificationOpen;
     }
     return null;
   }

  requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
    } catch (error) {
      // User has rejected permissions
      console.log('firebaseMessaging, requestPermission, error: ', error);
    }
  }

  onFireMessagingNotification = (notification, fcmType) => {
    if (this.onNotification && notification) {
      this.onNotification(notification, fcmType);
    }
  }

  setMessagingListener = () => {
    Notifications.registerRemoteNotifications();

    Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
      console.log(`Notification received in foreground: ${notification.title} : ${notification.body}`);
      this.onFireMessagingNotification(notification, FcmType.INAPP);
      completion();
    });

    Notifications.events().registerNotificationOpened((notification, completion) => {
      console.log(`Notification opened: ${notification.payload}`);
      this.onFireMessagingNotification(notification, FcmType.BACKGROUND);
      completion();
    });

    firebase.messaging().onMessage((message) => {
      console.log('firebaseMessaging, onMessage, message: ', message);
    });
  }

  startListen(listener) {
    this.onNotification = listener;
    this.setMessagingListener();
  }

  refreshFcmToken = async () => {
    await firebase.messaging().deleteToken();
    const token = await this.getFcmToken();
    return token;
  }
}

export default new FcmHelper();
