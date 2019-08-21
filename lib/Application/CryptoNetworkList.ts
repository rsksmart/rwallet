import { CryptoNetwork } from './CryptoNetwork';
import { CryptoNetworkType } from './CryptoNetworkType';

export class CryptoNetworkList {
    private networks: CryptoNetwork[] = [];

    add(network: CryptoNetwork) {
        this.networks.push(network);
    }

    find(name: string): CryptoNetwork | null {
        for (let n of this.networks) if (n.name == name) return n;
        return null;
    }

    find_by_symbol(symbol: string): CryptoNetwork | null {
        for (let n of this.networks) if (n.symbol == symbol) return n;
        return null;
    }

    get_list(): Promise<CryptoNetwork[]> {
        return new Promise<CryptoNetwork[]>((resolve, reject) => resolve(this.networks));
    }
}
