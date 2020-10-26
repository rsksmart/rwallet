import BasicCoin from './basic.coin';
import coinType from './cointype';

class MultisigBtc extends BasicCoin {
  constructor(invitationCode, type) {
    super('Bitcoin', 'BTC', type);
    this.id = type === 'Mainnet' ? this.symbol : this.symbol + this.type;
    this.metadata = coinType[this.id];
    this.name = this.metadata.defaultName;
    this.icon = this.metadata.icon;
    this.privateKey = undefined;
    this.publicKey = undefined;
    this.address = undefined;
    this.isMultisig = true;
    this.invitationCode = invitationCode;
    this.signatureNumber = null;
    this.copayerNumber = null;
  }

  get defaultName() {
    return this.name;
  }

  toJSON = () => ({
    id: this.id,
    symbol: this.symbol,
    type: this.type,
    address: this.address,
    subdomain: this.subdomain,
    objectId: this.objectId,
    chain: this.chain,
    name: this.name,
    balance: this.balance ? this.balance.toString() : undefined,
    invitationCode: this.invitationCode,
    isMultisig: this.isMultisig,
    addressType: this.addressType,
    signatureNumber: this.signatureNumber,
    copayerNumber: this.copayerNumber,
  })

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
