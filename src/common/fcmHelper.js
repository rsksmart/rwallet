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
    if (this.onNotification) {
      this.onNotification(notification, fcmType);
    }
  }

  setMessagingListener = async () => {
    // App in foreground, onNotification triggered
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      this.onFireMessagingNotification(notification, FcmType.INAPP);
    });

    // App in background, onNotificationOpened Triggered if the notification is tapped
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      this.onFireMessagingNotification(notificationOpen.notification, FcmType.BACKGROUND);
    });

    // When a notification from FCM has triggered the application to open from a quit state,
    // this method will return a RemoteMessage containing the notification data,
    // or null if the app was opened via another method.
    const notificationOpen = await firebase.notifications().getInitialNotification();
    console.log('notificationOpen: ', notificationOpen);
    if (notificationOpen) {
      this.onFireMessagingNotification(notificationOpen.notification, FcmType.LAUNCH);
    }

    this.messageListener = firebase.messaging().onMessage((message) => {
      console.log('firebaseMessaging, onMessage, message: ', message);
    });
  }

  async startListen(listener) {
    this.onNotification = listener;
    await this.setMessagingListener();
  }

  async onAppResume() {
    const notificationOpen = await firebase.notifications().getInitialNotification();
    console.log('notificationOpen: ', notificationOpen);
    if (notificationOpen) {
      this.onFireMessagingNotification(notificationOpen.notification, FcmType.LAUNCH);
    }
  }
}

export default new FcmHelper();
