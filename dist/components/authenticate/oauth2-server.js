"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuth2ApplicationServer = void 0;
const helpers_1 = require("../../helpers");
const oauth2_server_1 = __importDefault(require("@node-oauth/oauth2-server"));
class OAuth2ApplicationServer extends oauth2_server_1.default {
    constructor(opts) {
        const { scope, serverOptions } = opts;
        super(serverOptions);
        this.logger = helpers_1.LoggerFactory.getLogger([scope !== null && scope !== void 0 ? scope : OAuth2ApplicationServer.name]);
        this.configure();
    }
    configure() {
        this.logger.info('[configure] START | Configuring application OAuth2 server...!');
        this.logger.info('[configure] DONE | Configured application OAuth2 server!');
    }
}
exports.OAuth2ApplicationServer = OAuth2ApplicationServer;
//# sourceMappingURL=oauth2-server.js.map