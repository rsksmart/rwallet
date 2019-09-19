# RWallet

This is a multi-cryptocurrency wallet application. Supports both english and spanish.

This wallet is composed by two modules: the UI and the backend.

-   The UI is implemented using react-native, redux and expo.
-   The backend is written in typescript and must be compiled and bundled first.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine
for development and testing purposes. See deployment for notes on how
to deploy the project on a live system.

### Prerequisites

The front end is composed by two modules, both use `node` and `npm` to manage dependencies.

The UI uses Expo (https://expo.io/) check the instructions in their site to install `expo-cli`.

In order to test:

-   **Android**: You can both deploy in a USB device or in a virtual android device(**Android Studio**).
-   **iOS**: Run throught LAN connection with **expo iOS app** (find it in the apple store). Xcode is needed for native deployment and it only can be run on a MacOS.

### Installing

To install the dependencies and build the backend run the `build_first.sh` script in
the root directory the script does the following:

-   run `npm install`(recommend to use `yarn`) in the root directory, in the lib/Application and lib/postprocessor directories.
-   run the `build.sh` script that build the backend. This script executes the typescript compiler
    and browserify to compile and bundle the backend. The backend is bundled in the `lib/lib.js` file
    which later is included by UI project.
    After the installation run: `expo start` in the root directory of the project.
  - In addition,you can run `expo start -c` to empty your javascript transform cache to ensure that it will not be contaminated by old code, rebuilding (this may take a minute).It will not be contaminated by old code.

**Running in android emulator:**
We recommend you to use the Android Virtual Device (AVD Manager) from Android Studio.
_Notice_ that some important updates might not be in the stable updates channel, but instead in `canary channel`.
Once your virtual android device is up and running:

```
./build_first.sh
expo start
```

You will be prompted with expo's interactive menu. **Press 'a' to deploy on android device.**

## Deployment

During development the application uses Math.random to generate random numbers, this is **insecure!!!**.
Expo doesn't support the cryptographic secure random available in the devices. It is possible to
use `expo publish` to show the app, but to do a production build a process called "eject"
must be done; see: https://docs.expo.io/versions/latest/expokit/eject/ for details.

After eject you get two "native" projects: one for Android and one for IOS. We use the
`react-native-securerandom` library that must be linked to the project using `react-native link`
and then the projects must be build using Android Studio and XCode respectively.

## License
