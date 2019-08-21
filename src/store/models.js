async function Wallet(wallet) {
  try {
    this.originalWallet = wallet;
    this.id = await wallet.get_id();
    this.name = await wallet.get_name();
    this.balance = await wallet.get_balance();
    this.addresses = await wallet.get_addresses();
    this.network = await wallet.get_network();
    this.receive_address = await wallet.get_receive_address();
  } catch (e) {
    throw new Error(e);
  }
  return this;
}

export default Wallet;
