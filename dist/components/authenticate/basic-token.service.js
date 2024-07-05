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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicTokenService = void 0;
const base_service_1 = require("@/base/base.service");
const rest_1 = require("@loopback/rest");
// import { securityId } from '@loopback/security';
class BasicTokenService extends base_service_1.BaseService {
    constructor() {
        super({ scope: BasicTokenService.name });
    }
    verify(credential) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!credential) {
                this.logger.error('verify', 'Missing basic credential for validating request!');
                throw new rest_1.HttpErrors.Unauthorized('Invalid basic request credential!');
            }
            let tokenPayload;
            try {
                const { username, password } = credential;
                const basicCredential = {
                    identifier: { scheme: 'username', value: username },
                    credential: { scheme: 'basic', value: password },
                };
                tokenPayload = basicCredential;
            }
            catch (error) {
                throw new rest_1.HttpErrors.Unauthorized(`Error verifying token : ${error.message}`);
            }
            return tokenPayload;
        });
    }
}
exports.BasicTokenService = BasicTokenService;
//# sourceMappingURL=basic-token.service.js.map