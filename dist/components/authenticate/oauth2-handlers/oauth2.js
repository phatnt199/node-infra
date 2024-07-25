"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuth2Handler = void 0;
const helpers_1 = require("../../../helpers");
const oauth2_server_1 = __importDefault(require("@node-oauth/oauth2-server"));
const authorization_code_handler_1 = require("./authorization-code.handler");
const utilities_1 = require("../../../utilities");
class OAuth2Handler extends oauth2_server_1.default {
    constructor(opts) {
        const { scope, handlerOptions, serverOptions } = opts;
        let authHandler = null;
        const { type: authType, authServiceKey } = handlerOptions;
        switch (authType) {
            case 'authorization_code': {
                authHandler = new authorization_code_handler_1.OAuth2AuthorizationCodeHandler({
                    authServiceKey,
                    injectionGetter: handlerOptions.injectionGetter,
                });
                break;
            }
            default: {
                break;
            }
        }
        if (!authHandler) {
            throw (0, utilities_1.getError)({ message: '[defineOAuth2] Invalid OAuth2 model handler!' });
        }
        super(Object.assign(Object.assign({}, serverOptions), { model: authHandler }));
        this.logger = helpers_1.LoggerFactory.getLogger([scope !== null && scope !== void 0 ? scope : OAuth2Handler.name]);
    }
}
exports.OAuth2Handler = OAuth2Handler;
//# sourceMappingURL=oauth2.js.map