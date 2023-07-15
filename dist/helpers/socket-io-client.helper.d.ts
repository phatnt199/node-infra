import { Socket, SocketOptions } from 'socket.io-client';
interface IOptions extends SocketOptions {
    path: string;
    extraHeaders: Record<string | symbol | number, any>;
}
export interface ISocketIOClientOptions {
    identifier: string;
    host: string;
    options: IOptions;
}
export declare class SocketIOClientHelper {
    private logger;
    private identifier;
    private host;
    private options;
    private client;
    constructor(opts: ISocketIOClientOptions);
    configure(): void;
    getSocketClient(): Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap>;
    subscribe(opts: {
        events: Record<string, (...props: any) => void>;
    }): void;
    unsubscribe(opts: {
        events: Array<string>;
    }): void;
    emit(opts: {
        topic: string;
        message: string;
        log?: boolean;
    }): void;
}
export {};
