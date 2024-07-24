"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuth2ClientCredentialHandler = void 0;
const utilities_1 = require("../../../utilities");
const base_1 = require("./base");
class OAuth2ClientCredentialHandler extends base_1.AbstractOAuth2AuthenticationHandler {
    constructor(opts) {
        super({ scope: opts.scope, authServiceKey: opts.authServiceKey, injectionGetter: opts.injectionGetter });
    }
    getUserFromClient(client) {
        var _a;
        this.logger.debug('[getUserFromClient] Client: %j', client);
        const service = this.injectionGetter(this.authServiceKey);
        if (!(service === null || service === void 0 ? void 0 : service.getUserInformation)) {
            throw (0, utilities_1.getError)({ message: `${this.authServiceKey} has no 'getUserInformation' method!` });
        }
        const userInformation = (_a = service === null || service === void 0 ? void 0 : service.getUserInformation) === null || _a === void 0 ? void 0 : _a.call(service, client);
        return Promise.resolve(userInformation);
    }
}
exports.OAuth2ClientCredentialHandler = OAuth2ClientCredentialHandler;
//# sourceMappingURL=client-credential.handler.js.map