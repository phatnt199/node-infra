"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuth2ApplicationServer = void 0;
const helpers_1 = require("../../../helpers");
const oauth2_server_1 = require("@node-oauth/oauth2-server");
class OAuth2ApplicationServer extends oauth2_server_1.OAuth2Server {
    constructor(opts) {
        const { scope, serverOptions } = opts;
        super(serverOptions);
        this.logger = helpers_1.LoggerFactory.getLogger([scope !== null && scope !== void 0 ? scope : OAuth2ApplicationServer.name]);
    }
}
exports.OAuth2ApplicationServer = OAuth2ApplicationServer;
//# sourceMappingURL=oauth2-server.js.map