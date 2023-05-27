"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationKeys = exports.SocketIOKeys = exports.AuthorizerKeys = exports.AuthenticateKeys = exports.RouteKeys = exports.BindingKeys = void 0;
class BindingKeys {
}
BindingKeys.APPLICATION_ENVIRONMENTS = '@qt/application/environments';
exports.BindingKeys = BindingKeys;
// -----------------------------------------------------------------------------
class RouteKeys {
}
RouteKeys.ALWAYS_ALLOW_PATHS = '@app/application/always_allow_paths';
exports.RouteKeys = RouteKeys;
// -----------------------------------------------------------------------------
class AuthenticateKeys {
}
AuthenticateKeys.APPLICATION_SECRET = '@app/authenticate/application_secret';
AuthenticateKeys.TOKEN_OPTIONS = '@app/authenticate/token_options';
exports.AuthenticateKeys = AuthenticateKeys;
// -----------------------------------------------------------------------------
class AuthorizerKeys {
}
AuthorizerKeys.APPLICATION_NAME = '@app/authorize/component/application_name';
AuthorizerKeys.ROLE_MODEL = '@app/authorize/component/models/user';
AuthorizerKeys.PERMISSION_MODEL = '@app/authorize/component/models/permission';
AuthorizerKeys.PERMISSION_MAPPING_MODEL = '@app/authorize/component/models/permission_mapping';
AuthorizerKeys.USER_ROLE_MODEL = '@app/authorize/component/models/user_role';
AuthorizerKeys.ROLE_REPOSITORY = '@app/authorize/component/repositories/user';
AuthorizerKeys.PERMISSION_REPOSITORY = '@app/authorize/component/repositories/permission';
AuthorizerKeys.PERMISSION_MAPPING_REPOSITORY = '@app/authorize/component/repositories/permission_mapping';
AuthorizerKeys.USER_ROLE_REPOSITORY = '@app/authorize/component/repositories/user_role';
AuthorizerKeys.PROVIDER = '@app/authorize/provider';
AuthorizerKeys.ENFORCER = '@app/authorize/enforcer';
AuthorizerKeys.ALWAYS_ALLOW_ROLES = '@app/authorize/always_allow_roles';
AuthorizerKeys.AUTHORIZE_DATASOURCE = '@app/authorize/enforcer/adapter/datasource';
AuthorizerKeys.CONFIGURE_OPTIONS = '@app/authorize/configure_options';
exports.AuthorizerKeys = AuthorizerKeys;
// -----------------------------------------------------------------------------
class SocketIOKeys {
}
SocketIOKeys.SOCKET_IO_INSTANCE = '@app/socket-io/instance';
SocketIOKeys.IDENTIFIER = '@app/socket-io/identifier';
SocketIOKeys.SERVER_OPTIONS = '@app/socket-io/server-options';
SocketIOKeys.REDIS_CONNECTION = '@app/socket-io/redis-connection';
SocketIOKeys.AUTHENTICATE_HANDLER = '@app/socket-io/authenticate-handler';
SocketIOKeys.CLIENT_CONNECTED_HANDLER = '@app/socket-io/client-connected-handler';
exports.SocketIOKeys = SocketIOKeys;
// -----------------------------------------------------------------------------
class MigrationKeys {
}
MigrationKeys.MIGRATION_MODEL = '@app/migration/component/models/migration';
MigrationKeys.MIGRATION_REPOSITORY = '@app/migration/component/repositories/migration';
MigrationKeys.MIGRATION_DATASOURCE = '@app/migration/datasource';
exports.MigrationKeys = MigrationKeys;
//# sourceMappingURL=keys.js.map