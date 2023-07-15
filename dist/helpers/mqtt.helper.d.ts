/// <reference types="node" />
import mqtt from 'mqtt';
export interface IMQTTClientOptions {
    identifier: string;
    url: string;
    options: mqtt.IClientOptions;
    onConnect?: () => void;
    onDisconnect?: () => void;
    onError?: (error: Error) => void;
    onClose?: (error?: Error) => void;
    onMessage: (opts: {
        topic: string;
        message: Buffer;
    }) => void;
}
export declare class MQTTClientHelper {
    private logger;
    private identifier;
    private url;
    private options;
    private client;
    private onConnect?;
    private onDisconnect?;
    private onError?;
    private onClose?;
    private onMessage;
    constructor(opts: IMQTTClientOptions);
    configure(): void;
    subscribe(opts: {
        topics: Array<string>;
    }): Promise<unknown>;
    publish(opts: {
        topic: string;
        message: string | Buffer;
    }): Promise<unknown>;
}
