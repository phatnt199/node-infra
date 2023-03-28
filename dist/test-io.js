"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const client = (0, socket_io_client_1.io)('http://0.0.0.0:1199', {
    path: '/v1/api'
});
client.on('error', (error) => {
    console.log(error);
});
client.on('connect', () => {
    console.log('Connected');
});
client.on('ping', () => {
    console.log('PING');
});
console.log('establish');
//# sourceMappingURL=test-io.js.map