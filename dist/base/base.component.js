"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseComponent = void 0;
const helpers_1 = require("../helpers");
class BaseComponent {
    constructor(opts) {
        var _a;
        this.logger = helpers_1.LoggerFactory.getLogger([(_a = opts === null || opts === void 0 ? void 0 : opts.scope) !== null && _a !== void 0 ? _a : BaseComponent.name]);
    }
}
exports.BaseComponent = BaseComponent;
//# sourceMappingURL=base.component.js.map