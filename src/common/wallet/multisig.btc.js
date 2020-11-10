import BTCCoin from './btccoin';

class MultisigBtc extends BTCCoin {
  constructor(invitationCode, type) {
    super('BTC', type, "m/44'/0'/0'/0/0");
    this.isMultisig = true;
    this.invitationCode = invitationCode;
    this.signatureNumber = null;
    this.copayerNumber = null;
  }

  toJSON = () => {
    const obj = super.toJSON();
    return {
      ...obj,
      invitationCode: this.invitationCode,
      isMultisig: this.isMultisig,
      signatureNumber: this.signatureNumber,
      copayerNumber: this.copayerNumber,
    };
  }

  static fromJSON(json) {
    const {
      type, address, objectId, invitationCode, balance, addressType, signatureNumber, copayerNumber,
    } = json;
    const instance = new MultisigBtc(invitationCode, type);
    instance.address = address;
    instance.objectId = objectId;
    instance.balance = balance;
    instance.addressType = addressType;
    instance.signatureNumber = signatureNumber;
    instance.copayerNumber = copayerNumber;
    return instance;
  }

  setupWithDerivation = (derivation) => {
    const { addressType } = derivation;
    const {
      privateKey, publicKey,
    } = derivation.addresses[addressType];
    this.addressType = addressType;
    this.privateKey = privateKey;
    this.publicKey = publicKey;
  }
}

export default MultisigBtc;
