import _ from 'lodash';
import references from '../../assets/references';

class MultisigBtc {
  constructor(invitationCode, type) {
    this.symbol = 'BTC';
    this.type = type;
    this.id = type === 'Mainnet' ? this.symbol : this.symbol + this.type;
    this.privateKey = undefined;
    this.publicKey = undefined;
    this.address = undefined;
    this.invitationCode = undefined;
    this.name = 'Multisig BTC';
    this.icon = references.images.BTC;
    this.isMultisig = true;
    this.invitationCode = invitationCode;
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
  })

  static fromJSON(json) {
    const {
      type, address, objectId, invitationCode, balance,
    } = json;
    const instance = new MultisigBtc(invitationCode, type);
    instance.address = address;
    instance.objectId = objectId;
    instance.balance = balance;
    return instance;
  }

  updateCoinObjectIds(addresses) {
    const that = this;

    let isDirty = false;

    _.each(addresses, (address) => {
      if (that.isEqual(address) && that.objectId !== address.objectId) {
        that.objectId = address.objectId;
        isDirty = true;
        return false; // return false break _.each loop
      }

      return true; // simply here because eslint requires returning something
    });

    return isDirty;
  }
}

export default MultisigBtc;
