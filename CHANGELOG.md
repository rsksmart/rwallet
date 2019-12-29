# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),

## [Unreleased]
## [1.0.0] - TBD

## [8.8.0] - 2019-12-26
### Added
1. Switching back from background, the App now shows a start screen with RSK logo instead of white screen.
1. Users now need to input passcode when navigate to Dashboard page and sending funds
1. Added custom gas option to Send page

### Changed
1. Examined translations for English, Spanish, Portuguese, Chinese
1. Hide Fingerprint options on Phones not supporting Fingerprint
1. Me page, “Join Community” -> "Join RSK's community”
1. Fixed a bug where Swipe left function on dashboard could crash the App
1. Fixed a bug where sending transaction to another rWallet app shows two transactions
1. Fixed backend saving duplicate wallet address in database issue
1. Fixed a bug where Bitcoin Testnet faucet transaction is not seen on rWallet
1. Adjusted button position on pages to ensure action buttion is always at bottom of the page
1. Adjusted "Slide to Confirm" button position on Send page to ensure it is always at bottom of the page
1. Optimized token logic in the App to be more smooth on UI
1. Optimized network transaction between the App and server
1. Optimized database read by adding indexes to table

### Removed
1. Audio permission has been removed from iOS and Android. 

[Unreleased]: https://github.com/olivierlacan/keep-a-changelog/compare/v0.8.0...HEAD
<!-- [1.0.0]: https://github.com/olivierlacan/keep-a-changelog/compare/v0.8.0...v1.0.0 -->
[0.8.0]: https://github.com/rootstock/rwallet/releases/tag/v0.8.0