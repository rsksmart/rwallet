import firebase from 'react-native-firebase';

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
     const notificationOpen = await firebase.notifications().getInitialNotification();
     if (notificationOpen) {
       return notificationOpen.notification;
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
    // App in foreground, onNotification triggered
    firebase.notifications().onNotification((notification) => {
      this.onFireMessagingNotification(notification, FcmType.INAPP);
    });

    // App in background, onNotificationOpened Triggered if the notification is tapped
    firebase.notifications().onNotificationOpened((notificationOpen) => {
      this.onFireMessagingNotification(notificationOpen.notification, FcmType.BACKGROUND);
    });

    firebase.messaging().onMessage((message) => {
      console.log('firebaseMessaging, onMessage, message: ', message);
    });
  }

  startListen(listener) {
    this.onNotification = listener;
    this.setMessagingListener();
  }
}

export default new FcmHelper();
