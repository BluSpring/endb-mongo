/// <reference types="node" />
import { Element, EndbAdapter } from 'endb';
import { EventEmitter } from 'events';
import { Collection } from 'mongodb';
export interface EndbMongoOptions {
    uri: string;
    collection: string;
}
export default class EndbMongo<TVal> extends EventEmitter implements EndbAdapter<TVal> {
    namespace: string;
    protected readonly db: Promise<Collection<Element<string>>>;
    constructor(options?: Partial<EndbMongoOptions>);
    all(): Promise<Element<string>[]>;
    clear(): Promise<void>;
    delete(key: string): Promise<boolean>;
    get(key: string): Promise<void | string>;
    has(key: string): Promise<boolean>;
    set(key: string, value: string): Promise<unknown>;
}
