class Address {
  static isSameAddr(addr1, addr2) {
    const keys = ['address', 'type', 'chain', 'symbol'];
    return keys.every((key) => addr1[key] === addr2[key]);
  }
}

export default Address;
