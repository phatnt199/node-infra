"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuth2PasswordHandler = void 0;
const base_1 = require("./base");
class OAuth2PasswordHandler extends base_1.AbstractOAuth2AuthenticationHandler {
    constructor(opts) {
        super({ scope: opts.scope, authServiceKey: opts.authServiceKey, injectionGetter: opts.injectionGetter });
    }
    getUser(username, password, _client) {
        const service = this.injectionGetter(this.authServiceKey);
        return service.signIn({
            identifier: { scheme: 'username', value: username },
            credential: { scheme: 'basic', value: password },
        });
    }
}
exports.OAuth2PasswordHandler = OAuth2PasswordHandler;
//# sourceMappingURL=password.handler.js.map