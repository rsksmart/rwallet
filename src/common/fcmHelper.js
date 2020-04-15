import firebase from 'react-native-firebase';

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
      this.setMessagingListener();
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

  onFireMessagingNotification = (notification) => {
    const { title, body } = notification;
    console.log(`FirebaseMessaging, onFireMessagingNotification, title: ${title}, body: ${body} `);
  }

  setMessagingListener = async () => {
    // App in foreground, onNotification triggered
    this.notificationListener = firebase.notifications().onNotification((notification) => {
      this.onFireMessagingNotification(notification);
    });

    // App in background, onNotificationOpened Triggered if the notification is tapped
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
      this.onFireMessagingNotification(notificationOpen.notification);
    });

    // When a notification from FCM has triggered the application to open from a quit state,
    // this method will return a RemoteMessage containing the notification data,
    // or null if the app was opened via another method.
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      this.onFireMessagingNotification(notificationOpen.notification);
    }

    this.messageListener = firebase.messaging().onMessage((message) => {
      console.log('firebaseMessaging, onMessage, message: ', message);
    });
  }
}

export default new FcmHelper();
