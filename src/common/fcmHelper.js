import firebase from 'react-native-firebase';
import _ from 'lodash';
import walletManager from './wallet/walletManager';

/**
 * Firebase Cloud Messaging Helper
 */
class FcmHelper {
  parseUrl = (url) => {
    if (!url) {
      return null;
    }
    try {
      const queryParams = {};
      const questionMaskPos = url.indexOf('?', 0);
      const path = url.substring(0, questionMaskPos);
      const queryString = url.substr(questionMaskPos + 1, url.length);
      const querys = queryString.split('&');
      _.each(querys, (query) => {
        const [key, value] = query.split('=');
        queryParams[key] = value;
      });
      return { path, queryParams };
    } catch (error) {
      console.log('parseUrl, url is not valid');
    }
    return null;
  }

  getNavigateParams = () => {
    const urlObject = this.parseUrl(this.openUrl);
    if (!urlObject) {
      return null;
    }
    if (urlObject.path === 'WalletHistory') {
      let coin = null;
      const { address, symbol } = urlObject.queryParams;
      for (let i = 0; i < walletManager.wallets.length; i += 1) {
        const wallet = walletManager.wallets[i];
        coin = _.find(wallet.coins, { address, symbol });
      }
      return {
        routeName: 'WalletHistory',
        routeParams: { coin },
      };
    }
    return null;
  }

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
    const { title, body, data } = notification;
    console.log(`FirebaseMessaging, onFireMessagingNotification, title: ${title}, body: ${body} `);
    this.openUrl = data && data.openUrl ? data.openUrl : null;
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
    console.log('notificationOpen: ', notificationOpen);
    if (notificationOpen) {
      this.openUrl = 'WalletHistory?address=1M9LM3nSy7XMDKFoYQYMjN9Uos77bLJatn&symbol=BTC';
      this.onFireMessagingNotification(notificationOpen.notification);
    }

    this.messageListener = firebase.messaging().onMessage((message) => {
      console.log('firebaseMessaging, onMessage, message: ', message);
    });
  }

  resetOpenUrl = () => {
    this.openUrl = null;
  }
}

export default new FcmHelper();
