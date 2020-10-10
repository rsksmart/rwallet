/**
 * @format
 */

import { AppRegistry } from 'react-native';
import './shim'; // Provide global node types(global.Buffer, global.process) for node_modules packages(bitcoinjs-lib, bip32)
import crypto from 'crypto';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
