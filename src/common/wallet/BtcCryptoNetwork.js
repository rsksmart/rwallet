import { CryptoNetworkType } from './CryptoNetworkType';
export class BtcCryptoNetwork {
    constructor() {
        super(
            'BTC',
            'Bitcoin',
            'BTC',
            CryptoNetworkType.BTC,
            false,
            'mellowallet/assets/coins/btc.png'
        );
    }

    protected get_network(): Network {
        return networks.bitcoin;
    }

    protected get_network_id(): number {
        return 0;
    }
}