"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineOAuth2Strategy = void 0;
const common_1 = require("../../../common");
const helpers_1 = require("../../../helpers");
const services_1 = require("../../../services");
const utilities_1 = require("../../../utilities");
const security_1 = require("@loopback/security");
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
class AuthProviderNetworkRequest extends services_1.BaseNetworkRequest {
}
const defineOAuth2Strategy = (opts) => {
    class Strategy {
        constructor() {
            var _a;
            this.name = opts.name;
            const baseURL = helpers_1.applicationEnvironment.get(common_1.EnvironmentKeys.APP_ENV_REMOTE_AUTH_SERVER_URL);
            if (!baseURL || (0, isEmpty_1.default)(baseURL)) {
                throw (0, utilities_1.getError)({
                    message: `[RemoteAuthenticationStrategy][DANGER] INVALID baseURL | Missing env: APP_ENV_REMOTE_AUTH_SERVER_URL`,
                });
            }
            this.authPath = (_a = helpers_1.applicationEnvironment.get(common_1.EnvironmentKeys.APP_ENV_REMOTE_AUTH_PATH)) !== null && _a !== void 0 ? _a : '/auth/who-am-i';
            this.authProvider = new AuthProviderNetworkRequest({
                name: AuthProviderNetworkRequest.name,
                scope: `${Strategy.name}_${opts.name}`,
                networkOptions: { baseURL },
            });
        }
        authenticate(request) {
            return __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
                const networkService = this.authProvider.getNetworkService();
                const rs = yield networkService.send({
                    url: this.authProvider.getRequestUrl({ paths: [this.authPath] }),
                    headers: { Authorization: request.headers['authorization'] },
                });
                if ((_a = rs === null || rs === void 0 ? void 0 : rs.data) === null || _a === void 0 ? void 0 : _a.error) {
                    throw (0, utilities_1.getError)(rs.data.error);
                }
                return Object.assign(Object.assign({}, rs === null || rs === void 0 ? void 0 : rs.data), { [security_1.securityId]: (_c = (_b = rs === null || rs === void 0 ? void 0 : rs.data) === null || _b === void 0 ? void 0 : _b.userId) === null || _c === void 0 ? void 0 : _c.toString() });
            });
        }
    }
    return Strategy;
};
exports.defineOAuth2Strategy = defineOAuth2Strategy;
//# sourceMappingURL=oauth2.strategy.js.map