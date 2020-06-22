package com.rsk.rwallet.reactnative;

import android.app.Application;
import android.content.Context;
import android.support.multidex.MultiDex;
import android.support.multidex.MultiDexApplication;

import com.facebook.react.ReactApplication;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import cl.json.RNSharePackage;
import com.bolan9999.SpringScrollViewPackage;
import com.cmcewen.blurview.BlurViewPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.apsl.versionnumber.RNVersionNumberPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.tradle.react.UdpSocketsModule;
import com.peel.react.TcpSocketsModule;
import org.reactnative.camera.RNCameraPackage;
import io.github.traviskn.rnuuidgenerator.RNUUIDGeneratorPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;

import com.hieuvp.fingerprint.ReactNativeFingerprintScannerPackage;
import com.taluttasgiran.rnsecurestorage.RNSecureStoragePackage;
import com.horcrux.svg.SvgPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.swmansion.rnscreens.RNScreensPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.reactnativecommunity.slider.ReactSliderPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends MultiDexApplication implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNViewShotPackage(),
            new RNSharePackage(),
            new SpringScrollViewPackage(),
            new BlurViewPackage(),
            new RNFirebasePackage(),
            new RNVersionNumberPackage(),
            new LinearGradientPackage(),
            new VectorIconsPackage(),
            new UdpSocketsModule(),
            new TcpSocketsModule(),
            new RNCameraPackage(),
            new RNUUIDGeneratorPackage(),
            new ReactNativeFingerprintScannerPackage(),
            new RNSecureStoragePackage(),
            new SvgPackage(),
            new RandomBytesPackage(),
            new RNI18nPackage(),
            new AsyncStoragePackage(),
            new RNGestureHandlerPackage(),
            new RNScreensPackage(),
            new ReactSliderPackage(),
            new RNFirebaseMessagingPackage(),
            new RNFirebaseNotificationsPackage(),
            new RNCWebViewPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }

  @Override
  protected void attachBaseContext(Context newBase) {
      super.attachBaseContext(newBase);
      MultiDex.install(this);
  }
}
