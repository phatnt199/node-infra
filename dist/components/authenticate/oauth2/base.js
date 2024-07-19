"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractOAuth2AuthenticationHandler = void 0;
const helpers_1 = require("../../../helpers");
class AbstractOAuth2AuthenticationHandler {
    constructor(opts) {
        var _a;
        this.logger = helpers_1.LoggerFactory.getLogger([(_a = opts === null || opts === void 0 ? void 0 : opts.scope) !== null && _a !== void 0 ? _a : AbstractOAuth2AuthenticationHandler.name]);
    }
}
exports.AbstractOAuth2AuthenticationHandler = AbstractOAuth2AuthenticationHandler;
//# sourceMappingURL=base.js.map