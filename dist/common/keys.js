"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceAssetKeys = exports.MigrationKeys = exports.SocketIOKeys = exports.AuthorizerKeys = exports.AuthenticateKeys = exports.RouteKeys = exports.BindingKeys = void 0;
class BindingKeys {
}
exports.BindingKeys = BindingKeys;
BindingKeys.APPLICATION_ENVIRONMENTS = '@qt/application/environments';
BindingKeys.APPLICATION_MIDDLEWARE_OPTIONS = '@app/application/middleware_options';
// -----------------------------------------------------------------------------
class RouteKeys {
}
exports.RouteKeys = RouteKeys;
RouteKeys.ALWAYS_ALLOW_PATHS = '@app/application/always_allow_paths';
// -----------------------------------------------------------------------------
class AuthenticateKeys {
}
exports.AuthenticateKeys = AuthenticateKeys;
AuthenticateKeys.APPLICATION_SECRET = '@app/authenticate/application_secret';
AuthenticateKeys.TOKEN_OPTIONS = '@app/authenticate/token_options';
AuthenticateKeys.REST_OPTIONS = '@app/authenticate/rest_options';
// -----------------------------------------------------------------------------
class AuthorizerKeys {
}
exports.AuthorizerKeys = AuthorizerKeys;
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
AuthorizerKeys.NORMALIZE_PAYLOAD_FN = '@app/authorize/normalize_payload_fn';
// -----------------------------------------------------------------------------
class SocketIOKeys {
}
exports.SocketIOKeys = SocketIOKeys;
SocketIOKeys.SOCKET_IO_INSTANCE = '@app/socket-io/instance';
SocketIOKeys.IDENTIFIER = '@app/socket-io/identifier';
SocketIOKeys.SERVER_OPTIONS = '@app/socket-io/server-options';
SocketIOKeys.REDIS_CONNECTION = '@app/socket-io/redis-connection';
SocketIOKeys.AUTHENTICATE_HANDLER = '@app/socket-io/authenticate-handler';
SocketIOKeys.CLIENT_CONNECTED_HANDLER = '@app/socket-io/client-connected-handler';
// -----------------------------------------------------------------------------
class MigrationKeys {
}
exports.MigrationKeys = MigrationKeys;
MigrationKeys.MIGRATION_MODEL = '@app/migration/component/models/migration';
MigrationKeys.MIGRATION_REPOSITORY = '@app/migration/component/repositories/migration';
MigrationKeys.MIGRATION_DATASOURCE = '@app/migration/datasource';
// -----------------------------------------------------------------------------
class ResourceAssetKeys {
}
exports.ResourceAssetKeys = ResourceAssetKeys;
ResourceAssetKeys.COMPONENT_OPTIONS = '@app/minio/component-options';
ResourceAssetKeys.MINIO_INSTANCE = '@app/minio/instance';
ResourceAssetKeys.CONNECTION_OPTIONS = '@app/minio/connection-options';
ResourceAssetKeys.RESOURCE_BASE_PATH = '@app/resources/base-path';
//# sourceMappingURL=keys.js.map