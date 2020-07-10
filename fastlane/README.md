fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

## Choose your installation method:

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

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
