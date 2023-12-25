"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getError = exports.ApplicationError = void 0;
class ApplicationError extends Error {
    constructor(opts) {
        const { message, messageCode, statusCode = 400 } = opts;
        super(message);
        this.statusCode = statusCode;
        this.messageCode = messageCode;
    }
}
exports.ApplicationError = ApplicationError;
const getError = (opts) => {
    const error = new ApplicationError(opts);
    return error;
};
exports.getError = getError;
//# sourceMappingURL=error.utility.js.map