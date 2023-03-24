import { Socket as IOSocket } from 'socket.io';
import { Handshake } from 'socket.io/dist/socket';
import Redis from 'ioredis';
import { BaseApplication } from '..';
export interface ISocketIOServerOptions {
    identifier: string;
    useAuth: boolean;
    path?: string;
    application: BaseApplication;
    redisConnection: Redis;
    authenticateFn: (args: Handshake) => Promise<boolean>;
    defaultRooms?: string[];
}
export declare class SocketIOServerHelper {
    private logger;
    private identifier;
    private path;
    private authenticateFn;
    private defaultRooms;
    private io;
    private emitter?;
    private application;
    private redisConnection;
    private clients;
    constructor(opts: ISocketIOServerOptions);
    configure(): void;
    add(opts: {
        socket: IOSocket;
    }): Promise<void>;
    ping(opts: {
        socket: IOSocket;
        ignoreAuth: boolean;
    }): void;
    disconnect(opts: {
        socket: IOSocket;
    }): void;
    send(opts: {
        room: string;
        payload: any;
        log?: boolean;
    }): void;
}
