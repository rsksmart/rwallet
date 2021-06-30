fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew install fastlane`

# Available Actions
## iOS
### ios get_version
```
fastlane ios get_version
```

### ios set_version
```
fastlane ios set_version
```

### ios get_build
```
fastlane ios get_build
```

### ios set_build
```
fastlane ios set_build
```

### ios certificates
```
fastlane ios certificates
```
Fetch certificates and provisioning profiles
### ios build
```
fastlane ios build
```
Build the iOS application.
### ios beta
```
fastlane ios beta
```
Ship to Testflight.

----

## Android
### android get_version_code
```
fastlane android get_version_code
```

### android get_version_name
```
fastlane android get_version_name
```

### android build_apk
```
fastlane android build_apk
```
Only build the APK.
### android beta
```
fastlane android beta
```
Ship to Play Store Beta.
### android alpha
```
fastlane android alpha
```
Ship to Play Store Alpha.
### android internal
```
fastlane android internal
```
Ship to Play Store Internal.

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
