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
        throw new Error('Method not implemented.');
    }
    validateScope(_user, _client, _scope) {
        throw new Error('Method not implemented.');
    }
    generateAccessToken(_client, _user, _scope) {
        throw new Error('Method not implemented.');
    }
    getClient(_clientId, _clientSecret) {
        throw new Error('Method not implemented.');
    }
    saveToken(_token, _client, _user) {
        throw new Error('Method not implemented.');
    }
    getAccessToken(_accessToken) {
        throw new Error('Method not implemented.');
    }
    verifyScope(_token, _scope) {
        throw new Error('Method not implemented.');
    }
}
exports.OAuth2PasswordHandler = OAuth2PasswordHandler;
//# sourceMappingURL=password.handler.js.map