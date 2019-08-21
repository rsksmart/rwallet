export class SendTxResult {
    success: boolean;
    tx_hash: string;

    constructor(success: boolean, tx_hash: string) {
        this.success = success;
        this.tx_hash = tx_hash;
    }
}
