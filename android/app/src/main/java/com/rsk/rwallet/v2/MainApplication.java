package com.rsk.rwallet.v2;

import android.content.Context;

import androidx.multidex.MultiDex;
import androidx.multidex.MultiDexApplication;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.List;

public class MainApplication extends MultiDexApplication implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      List<ReactPackage> packages = new PackageList(this).getPackages();
// Manually add any missing packages like this
// packages.add(new PostsnapPackage());
      return packages;
      /*return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNViewShotPackage(),
            new RNDeviceInfo(),
            new RNFirebasePackage(),
            new RNFSPackage(),
            new RNSharePackage(),
            new SpringScrollViewPackage(),
            new BlurViewPackage(),
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
      );*/
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
