"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationEnvironment = exports.ApplicationEnvironment = void 0;
class ApplicationEnvironment {
    constructor(props) {
        this.arguments = {};
        for (const key in props) {
            if (!key.startsWith('APP_ENV_')) {
                continue;
            }
            this.arguments[key] = props[key];
        }
    }
    get(key) {
        return this.arguments[key];
    }
    set(key, value) {
        this.arguments[key] = value;
    }
    keys() {
        return Object.keys(this.arguments);
    }
}
exports.ApplicationEnvironment = ApplicationEnvironment;
exports.applicationEnvironment = new ApplicationEnvironment(process.env);
//# sourceMappingURL=application-environment.helper.js.map