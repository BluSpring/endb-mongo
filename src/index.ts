
import {EventEmitter} from 'events';
import {MongoClient, Collection, ReplaceWriteOpResult} from 'mongodb';
import {Element, EndbAdapter} from 'endb';
import { EndbMongoOptions } from '../dist';

class EndbMongo<TVal> extends EventEmitter implements EndbAdapter<TVal> {
    namespace: string;
    protected readonly db: Promise<Collection<Element<string>>>;

    constructor(options: Partial<EndbMongoOptions> = {}) {
        super();

        const { uri = 'mongodb://127.0.0.1:27017', collection = 'endb' } = options;
        this.db = new Promise((resolve) => {
            MongoClient.connect(uri, (error, client) => {
                if (error !== null) {
                    return this.emit('error', error);
                }
                const db = client.db();
                const coll = db.collection(collection);
                db.on('error', (error) => this.emit('error', error));
                coll.createIndex({ key: 1 }, {
                    unique: true,
                    background: true,
                });
                resolve(coll);
            });
        });
    }

    async all(): Promise<Element<string>[]> {
        const collection = await this.db;
        return collection
            .find({ key: new RegExp(`^${this.namespace}:`) })
            .toArray();
    }

    async clear(): Promise<void> {
        await (await this.db).deleteMany({ key: new RegExp(`^${this.namespace}:`) });
    }

    async delete(key: string): Promise<boolean> {
        const collection = await this.db;
        const { deletedCount } = await collection.deleteOne({ key });
        return deletedCount !== undefined && deletedCount > 0;
    }

    async get(key: string): Promise<string | void | TVal> {
        const collection = await this.db;
        const doc = await collection.findOne({ key });
        return doc === null ? undefined : doc.value;
    }

    async has(key: string): Promise<boolean> {
        const collection = await this.db;
        const doc = await collection.findOne({ key });
        return Boolean(doc);
    }

    async set(key: string, value: string): Promise<ReplaceWriteOpResult> {
        return (await this.db).replaceOne({ key }, { key, value }, { upsert: true });
    }
}

declare namespace EndbMongo {
    export interface EndbMongoOptions {
        uri: string;
        collection: string;
    }
}

export = EndbMongo;