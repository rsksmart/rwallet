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
1. Create an environment variable file named `.env` in the root directory
    ```
    # Parse server configuration
    # Dogfood Server URL http://130.211.12.3/parse
    # Devbox Server URL for Android Simulator http://10.0.2.2:1338/parse
    # Devbox Server URL for iOS Simulator http://<YOUR_IP_ADDRESS>:1338/parse
    PARSE_SERVER_URL=
    RWALLET_API_KEY=
    ```
    If .env file is changed, manually edit the file importing react-native-dotenv by either adding an empty line or whitespace will work.

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

## Fastlane

### Set up Fastlane
<table width="100%" >
<tr>
<th width="33%"><a href="http://brew.sh">Homebrew</a></td>
<th width="33%">Installer Script</td>
<th width="33%">Rubygems</td>
</tr>
<tr>
<td width="33%" align="center">macOS</td>
<td width="33%" align="center">macOS</td>
<td width="33%" align="center">macOS or Linux with Ruby 2.0.0 or above</td>
</tr>
<tr>
<td width="33%"><code>brew cask install fastlane</code></td>
<td width="33%"><a href="https://download.fastlane.tools">Download the zip file</a>. Then double click on the <code>install</code> script (or run it in a terminal window).</td>
<td width="33%"><code>sudo gem install fastlane -NV</code></td>
</tr>
</table>

## Setup fastlane environment variable
```
APP_IDENTIFIER="com.rsk.rwallet.reactnative"


# Apple id
USERNAME=""

# Apple password
FASTLANE_PASSWORD=""

# Apple specific password
FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD=""

# Apple developer team id
TEAM_ID=""

# itunes connect team name
FASTLANE_ITC_TEAM_NAME=""

# Apple certs storage
GIT_URL="git@xxx.com:xxxx/xxxxx.git"
MATCH_PASSWORD=""


# Android sign file
ANDROID_SIGN_FILE="android/app/keystores/release.rwallet.jks"
ANDROID_SIGN_PASSWORD=""
ANDROID_SIGN_KEY_ALIAS="key0"
ANDROID_SIGN_KEY_PASSWORD=""


SLACK_URL=""
```

### Build on iOS
1. <a href="https://developer.apple.com/news/?id=12232019b">The App Store will no longer accept new apps using UIWebView as of April 2020 and app updates using UIWebView as of December 2020.</a> Remove `Libraries/React.xcodeproj/React/Views/RCTWebView.h、RCTWebView.m、RCTWebViewManager.h、RCTWebViewManager.m` in Xcode to remove UIWebView.
1. Make sure you have the latest version of the Xcode command line tools installed:
    ```
    xcode-select --install
    ```
1. Set up fastlane match by running `fastlane match init`. __match__ is the alias for the `sync_code_signing` action. It creates all required certificates & provisioning profiles and stores them in a separate git repository. 
1. Gernerate certificates by `fastlane match appstore`
1. Once match is set, run `fastlane ios beta version:<version_number> build:<build_number>` to push to TestFlight.
    For example, `fastlane ios beta version:0.8.1 build:3` (build parameter can be omitted for auto-increment)

### build on Android
1. Make sure you have Android Studio installed, so that it is easy to sync the gradle build config.
1. To build the APK, run `fastlane android build_apk version:<version_number> code:<version_code>`

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

## Debugging
1. Mac OS Dev environment
    * In Android Simulator, press **Command + M** to start remote debugging
    * In iOS Simulation, press **Command + D** to start remote debugging
1. Linux Dev environment
    * In Android Simulator

1. Windows Dev environment


## Deployment
1. Android
    1. Modify keystore setting in ./android/gradle.properties
    1. Run `npm run android` to build android apk. the apk file will be generated at the path: ./android/app/build/outputs/apk/release
1. iOS
    1. Remove `Libraries/React.xcodeproj/React/Views/RCTWebView.h、RCTWebView.m、RCTWebViewManager.h、RCTWebViewManager.m` in Xcode to remove UIWebView.
    1. Change signing team in the project settings
    ![signingTeam](https://user-images.githubusercontent.com/16951509/71573427-c7d72380-2b1e-11ea-9164-8d051b458570.png)
    1. Build ios app via Product -> Archive in Xcode
    1. Window -> Organizer, Distribute app to App Store Connect
    ![Distribute](https://user-images.githubusercontent.com/16951509/71651686-85018f80-2d5a-11ea-80ab-edb476400184.jpg) 
    1. Login App Store Connect, add new build to TestFlight 
    ![AddBuildToTestFlight](https://user-images.githubusercontent.com/16951509/71652854-b763ba80-2d63-11ea-8d8f-677ffd8e2d17.jpg)

## Testing Procedure

### Unit Testing
Unit Testing module is to be added.

### Manual Testing
Manual Testing has to be done on a real iOS/android device. This is to make sure we mimic real user's experience.

#### Steps
1. Create a wallet
    - Check Go Back Button
    - Enable all three testnet tokens
1. Import a wallet
    - Check Go Back Button
    - Enable all three testnet tokens
1. Delete a wallet
    - Goes to Me bottom tab and delete a Key
    - Go back to dashboard and make sure wallet is deleted
1. Receive Test BTC
    - Send Test BTC from an external wallet, and make sure transaction and balance correct in Address Detail page
    - Send Test BTC from rWallet, and make sure transaction and balance correctin Address Detail page
1. Receive Test RBTC
    - Send Test RBTC from an external wallet, and make sure transaction and balance correct in Address Detail page
    - Send Test RBTC from rWallet, and make sure transaction and balance correctin Address Detail page
1. Receive Test RIF
    - Send Test RIF from an external wallet, and make sure transaction and balance correct in Address Detail page
    - Send Test RIF from rWallet, and make sure transaction and balance correctin Address Detail page
1. Send Test BTC
    - Send Test BTC to an external wallet, and make sure transaction and balance correct in Address Detail page
    - Send Test BTC to another address in rWallet, and make sure transaction and balance correctin Address Detail page
1. Send Test RBTC
    - Send Test RBTC to an external wallet, and make sure transaction and balance correct in Address Detail page
    - Send Test RBTC to another address in rWallet, and make sure transaction and balance correctin Address Detail page
1. Send Test RIF
    - Send Test RIF to an external wallet, and make sure transaction and balance correct in Address Detail page
    - Send Test RIF to another address in rWallet, and make sure transaction and balance correctin Address Detail page
1. Change Language Settings
    - Change Language in Me tab, and make sure the App doesn't crash (We don't support any other launage yet)
1. Change Currency Settings
    - Change Currency in Me tab, and make sure the App doesn't crash (We don't support any other launage yet)
1. Click on Social Media Link
    - Click on all Social Media link, and make sure mobile phone could navigate to the correct webpage/app
