"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuth2PasswordHandler = void 0;
const base_1 = require("./base");
class OAuth2PasswordHandler extends base_1.AbstractOAuth2AuthenticationHandler {
    static newInstance() {
        return new OAuth2PasswordHandler({ scope: OAuth2PasswordHandler.name });
    }
    generateRefreshToken(_client, _user, _scope) {
        return Promise.resolve('N/A');
    }
    getUser(_username, _password, _client) {
        return Promise.resolve(null);
    }
    validateScope(_user, _client, _scope) {
        return Promise.resolve(null);
    }
    generateAccessToken(_client, _user, _scope) {
        return Promise.resolve('tmp_access_token');
    }
    getClient(_clientId, _clientSecret) {
        return Promise.resolve(null);
    }
    saveToken(_token, _client, _user) {
        return Promise.resolve(null);
    }
    getAccessToken(_accessToken) {
        return Promise.resolve(null);
    }
    verifyScope(_token, _scope) {
        return Promise.resolve(false);
    }
}
exports.OAuth2PasswordHandler = OAuth2PasswordHandler;
//# sourceMappingURL=password.handler.js.map