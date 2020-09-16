class MultisigBtc {
  constructor(invitationCode, type) {
    this.symbol = 'BTC';
    this.type = type;
    this.privateKey = undefined;
    this.publicKey = undefined;
    this.address = undefined;
    this.invitationCode = undefined;
  }

  get defaultName() {
    return this.metadata.defaultName;
  }
}

export default MultisigBtc;
