import _ from 'lodash';
import BigNumber from 'bignumber.js';
import MultisigBTC from './multisig.btc';
import { WalletType } from '../constants';
import Wallet from './wallet';
import Coin from './btccoin';

export default class SharedWallet extends Wallet {
  constructor({
    id, name, mnemonic, type,
  }) {
    super({
      id, name, mnemonic, walletType: WalletType.Multisig,
    });
    this.walletDerivationTypes = [{ symbol: 'BTC', type }];
  }

  /**
   * Create multisig BTC and add it to coins list
   */
  addToken = ({
    invitationCode, address, type, objectId, balance, signatureNumber, copayerNumber,
  }) => {
    console.log(`addMultisigBTC, invitationCode: ${invitationCode}, address: ${address}, type: ${type}`);
    const multisigBTC = new MultisigBTC(invitationCode, type);
    const derivation = this.derivations[0];

    // Reuse address, private key of derivation
    multisigBTC.setupWithDerivation(derivation);

    // Restore other data
    multisigBTC.address = address || multisigBTC.address;
    multisigBTC.objectId = objectId || multisigBTC.objectId;
    multisigBTC.balance = balance ? new BigNumber(balance) : multisigBTC.balance;
    multisigBTC.signatureNumber = signatureNumber || multisigBTC.signatureNumber;
    multisigBTC.copayerNumber = copayerNumber || multisigBTC.copayerNumber;

    this.coins.push(multisigBTC);
    return multisigBTC;
  }

  setMultisigBTCAddress = (invitationCode, address) => {
    const coin = _.find(this.coins, { isMultisig: true, invitationCode });
    coin.address = address;
  }

  static async fromJSON(json) {
    const {
      id, name, coins, derivations,
    } = json;

    // use secure storage to restore phrase
    const phrase = await Wallet.restorePhrase(id);
    console.log(`Wallet.fromJSON: restored phrase for Id=${id}; ${phrase}.`);

    if (!_.isString(phrase)) { // We are be able to restore phrase; do not continue.
      console.log(`Wallet.fromJSON: phrase restored is not a string, Id=${id}; returning null.`);
      return null;
    }

    // restore derivations
    // use secure storage to restore private key
    if (derivations) {
      const promises = _.map(derivations, async (derivation, index) => {
        const coin = Coin.fromJSON(derivation);
        await coin.restorePrivateKey(id);
        derivations[index] = coin;
      });
      await Promise.all(promises);
    }

    console.log('Wallet.fromJSON: derivations: ', derivations);

    const wallet = SharedWallet.restore({
      id, name, phrase, coins, derivations,
    });

    return { isNeedSave: false, wallet };
  }

  static restore({
    id, name, phrase, coins, derivations,
  }) {
    const wallet = new SharedWallet({ id, name, mnemonic: phrase });
    wallet.restoreTokensWithDerivations(coins, derivations);
    return wallet;
  }

  static create(walletName, phrase, type) {
    const wallet = new SharedWallet({
      id: 0, name: walletName, mnemonic: phrase, type,
    });
    wallet.createTokensFromSeed([], []);
    return wallet;
  }
}
