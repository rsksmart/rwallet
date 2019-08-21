export class PathKeyPair {
    public path: string;
    public public_key: string;

    constructor(path: string = '', pk: string = '') {
        this.path = path;
        this.public_key = pk;
    }
}
