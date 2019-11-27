# RWallet

## Introduction
This is a multi-cryptocurrency wallet application. Supports both english and spanish.

## Prerequisite

### To run on Android
1. In order to run this App in Android Simulator, **Android Studio** needs to be installed. Please refer to [https://developer.android.com/studio](https://developer.android.com/studio)
1. Open Android Studio, create a device via `Tools > AVD Manager > Create Virtual Device`. After downloading required dependencies, start the device by clicking on Play icon.
1. Now we are testing if you can invoke `adb` in terminial. This is for running rWallet Android App on Android virtual device.
    1. Since we already have Android Studio installed we can add `platform-tools` to path
        ```
        echo 'export ANDROID_HOME=/Users/$USER/Library/Android/sdk' >> ~/.bash_profile
        echo 'export PATH=${PATH}:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools' >> ~/.bash_profile
        ```
    1. Then, refresh bash profile by `source ~/.bash_profile`
    1. Start using adb with `adb devices`
    1. If you have a virtual device running, it should show
        ```
        List of devices attached
        emulator-5554	device
        ```
### To run on iOS Devices
1. XCode needs to be installed. iOS simulator will be install along with XCode.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

The first three steps are needed for both Android and iOS devices.

1. `npm install` to install dependencies
1. `./node_modules/.bin/rn-nodeify --hack --install`
1. `npm run android` or `npm run ios`. The script will first start server daemon in a separate terminal window, the same effect as `npm run start`. You should see console output like below.
    ```
    > rwallet@0.0.1 start /Users/mikasa/Documents/repos/rwallet
    > node node_modules/react-native/local-cli/cli.js start

    ┌──────────────────────────────────────────────────────────────────────────────┐
    │                                                                              │
    │  Running Metro Bundler on port 8081.                                         │
    │                                                                              │
    │  Keep Metro running while developing on any JS projects. Feel free to        │
    │  close this tab and run your own Metro instance if you prefer.               │
    │                                                                              │
    │  https://github.com/facebook/react-native                                    │
    │                                                                              │
    └──────────────────────────────────────────────────────────────────────────────┘

    Looking for JS files in
      /Users/mikasa/Documents/repos/rwallet 

    Loading dependency graph, done.
    ```
    * For Android, `npm run android` will start the app in your physical device or Android virtual device. You need to check what device are available by running `adb devices` in terminal. To test the app in a physical Android device, you need to make sure **Developer Options -> Enable Debugging via USB** is turned on for that device.
        Note: If you encounter an error like below then you need to create a **local.properties** file under ./android and add one line `sdk.dir = /Users/<username>/Library/Android/sdk` in it.
        ```
        SDK location not found. Define location with an ANDROID_SDK_ROOT environment variable or by setting the sdk.dir path in your project's local properties file at '/Users/<usernmae>/Documents/repos/rwallet/android/local.properties'.
        ```
    * For iOS device, `npm run ios` will start the App in iOS physical or virtual device.

1. Hot reload code change - Press Command + m on virtual device and select `Enable Hot Reloading` to hot reload file changes.

## Devleopment
### Remote Debugging
#### Remote Debugging on iOS Simulator
1. Run `npm run ios` to start the app in Simulator.
1. Wait for the build


#### Remote Debugging on Android Devices
__Step 1: Discover your Android device__
1. Open the Developer Options screen on your Android. See [Configure On-Device Developer Options](https://developer.android.com/studio/debug/dev-options.html).
1. Select Enable USB Debugging
1. On your development machine, open Chrome.
1. Open DevTools.
1. In DevTools, click the Main Menu Main Menu then select More tools > Remote devices.
![Chrome Remote Debug Tools](docs/images/chrome-remote-debug-1.png)
1. In DevTools, open the Settings tab.
1. Make sure that the Discover USB devices checkbox is enabled.
1. Connect your Android device directly to your development machine using a USB cable. The first time you do this, you usually see that DevTools has detected an unknown device. If you see a green dot and the text Connected below the model name of your Android device, then DevTools has successfully established the connection to your device. 
![First Time Connect Android Device](docs/images/first-time-connect-android.png)
1. If your device is showing up as Unknown, accept the Allow USB Debugging permission prompt on your Android device.

__Step 2: Debug content on your Android device from your development machine__
TODO: How to debug android app with Mac OS is to be added


## Deployment



