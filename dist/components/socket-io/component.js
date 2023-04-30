"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketIOComponent = void 0;
const base_application_1 = require("../../base/base.application");
const base_component_1 = require("../../base/base.component");
const utilities_1 = require("../../utilities");
const core_1 = require("@loopback/core");
const common_1 = require("../../common");
const services_1 = require("../../services");
const helpers_1 = require("../../helpers");
let SocketIOComponent = class SocketIOComponent extends base_component_1.BaseComponent {
    constructor(application) {
        super({ scope: SocketIOComponent.name });
        this.application = application;
        this.bindings = [
            core_1.Binding.bind(common_1.SocketIOKeys.IDENTIFIER).to('SOCKET_IO_SERVER'),
            core_1.Binding.bind(common_1.SocketIOKeys.SERVER_OPTIONS).to({ path: '/io' }),
            core_1.Binding.bind(common_1.SocketIOKeys.REDIS_CONNECTION).to(null),
        ];
        this.binding();
    }
    defineServices() {
        this.application.service(services_1.BasicTokenService);
        this.application.service(services_1.JWTTokenService);
    }
    binding() {
        if (!this.application) {
            throw (0, utilities_1.getError)({
                statusCode: 500,
                message: '[binding] Invalid application to bind AuthenticateComponent',
            });
        }
        this.logger.info('[binding] Binding authenticate for application...');
        const identifier = this.application.getSync(common_1.SocketIOKeys.IDENTIFIER);
        const serverOptions = this.application.getSync(common_1.SocketIOKeys.SERVER_OPTIONS);
        const redisConnection = this.application.getSync(common_1.SocketIOKeys.REDIS_CONNECTION);
        const authenticateFn = this.application.getSync(common_1.SocketIOKeys.AUTHENTICATE_HANDLER);
        let clientConnectedFn = null;
        if (this.application.isBound(common_1.SocketIOKeys.CLIENT_CONNECTED_HANDLER)) {
            clientConnectedFn = this.application.getSync(common_1.SocketIOKeys.CLIENT_CONNECTED_HANDLER);
        }
        const restServer = this.application.restServer;
        const httpServer = restServer.httpServer;
        if (!httpServer) {
            throw (0, utilities_1.getError)({
                message: '[DANGER][SocketIOComponent] Invalid http server to setup io socket server!',
            });
        }
        const ioServer = new helpers_1.SocketIOServerHelper({
            identifier: identifier !== null && identifier !== void 0 ? identifier : `SOCKET_IO_SERVER`,
            server: httpServer.server,
            serverOptions,
            redisConnection,
            authenticateFn,
            clientConnectedFn,
        });
        this.application.bind(common_1.SocketIOKeys.SOCKET_IO_INSTANCE).to(ioServer);
    }
};
SocketIOComponent = __decorate([
    __param(0, (0, core_1.inject)(core_1.CoreBindings.APPLICATION_INSTANCE)),
    __metadata("design:paramtypes", [base_application_1.BaseApplication])
], SocketIOComponent);
exports.SocketIOComponent = SocketIOComponent;
//# sourceMappingURL=component.js.map