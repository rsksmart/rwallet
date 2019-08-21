export interface IStorage {
    secure_set(key: string, value: string): Promise<void>;
    secure_get(key: string): Promise<string | null>;
    set(key: string, value: string): Promise<void>;
    get(key: string): Promise<string | null>;
}

export class DummyStorage implements IStorage {
    secure_set(key: string, value: string): Promise<void> {
        return this.set(key, value);
    }
    secure_get(key: string): Promise<string | null> {
        return this.get(key);
    }
    set(key: string, value: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            resolve();
        });
    }
    get(key: string): Promise<string | null> {
        return new Promise<string | null>((resolve, reject) => {
            resolve(null);
        });
    }
}
