"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuth2AuthorizationCodeHandler = void 0;
const base_1 = require("./base");
const common_1 = require("../../../common");
class OAuth2AuthorizationCodeHandler extends base_1.AbstractOAuth2AuthenticationHandler {
    constructor(opts) {
        super({ scope: opts.scope, authServiceKey: opts.authServiceKey, injectionGetter: opts.injectionGetter });
    }
    getAuthorizationCode(authorizationCode) {
        return new Promise((resolve, reject) => {
            this._getToken({ type: common_1.AuthenticationTokenTypes.TYPE_AUTHORIZATION_CODE, token: authorizationCode })
                .then(rs => {
                var _a, _b;
                const { token: oauth2Token, client, user } = rs;
                resolve({
                    authorizationCode: oauth2Token.token,
                    expiresAt: new Date((_a = oauth2Token.details) === null || _a === void 0 ? void 0 : _a.expiresAt),
                    redirectUri: (_b = oauth2Token.details) === null || _b === void 0 ? void 0 : _b.redirectUri,
                    scope: oauth2Token.scopes,
                    client: Object.assign(Object.assign({}, client), { id: client.id.toString() }),
                    user,
                });
            })
                .catch(reject);
        });
    }
    saveAuthorizationCode(code, client, user) {
        return new Promise((resolve, reject) => {
            this._saveToken({
                token: code.authorizationCode,
                type: common_1.AuthenticationTokenTypes.TYPE_AUTHORIZATION_CODE,
                client,
                user,
                details: code,
            })
                .then(() => {
                resolve(Object.assign(Object.assign({}, code), { client, user }));
            })
                .catch(reject);
        });
    }
    revokeAuthorizationCode(code) {
        this.logger.debug('[revokeAuthorizationCode] Revoked code: %j', code);
        return Promise.resolve(true);
    }
}
exports.OAuth2AuthorizationCodeHandler = OAuth2AuthorizationCodeHandler;
//# sourceMappingURL=authorization-code.handler.js.map