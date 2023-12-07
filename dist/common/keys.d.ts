export declare class BindingKeys {
    static readonly APPLICATION_ENVIRONMENTS = "@qt/application/environments";
    static readonly APPLICATION_MIDDLEWARE_OPTIONS = "@app/application/middleware_options";
}
export declare class RouteKeys {
    static readonly ALWAYS_ALLOW_PATHS = "@app/application/always_allow_paths";
}
export declare class AuthenticateKeys {
    static readonly APPLICATION_SECRET = "@app/authenticate/application_secret";
    static readonly TOKEN_OPTIONS = "@app/authenticate/token_options";
}
export declare class AuthorizerKeys {
    static readonly APPLICATION_NAME = "@app/authorize/component/application_name";
    static readonly ROLE_MODEL = "@app/authorize/component/models/user";
    static readonly PERMISSION_MODEL = "@app/authorize/component/models/permission";
    static readonly PERMISSION_MAPPING_MODEL = "@app/authorize/component/models/permission_mapping";
    static readonly USER_ROLE_MODEL = "@app/authorize/component/models/user_role";
    static readonly ROLE_REPOSITORY = "@app/authorize/component/repositories/user";
    static readonly PERMISSION_REPOSITORY = "@app/authorize/component/repositories/permission";
    static readonly PERMISSION_MAPPING_REPOSITORY = "@app/authorize/component/repositories/permission_mapping";
    static readonly USER_ROLE_REPOSITORY = "@app/authorize/component/repositories/user_role";
    static readonly PROVIDER = "@app/authorize/provider";
    static readonly ENFORCER = "@app/authorize/enforcer";
    static readonly ALWAYS_ALLOW_ROLES = "@app/authorize/always_allow_roles";
    static readonly AUTHORIZE_DATASOURCE = "@app/authorize/enforcer/adapter/datasource";
    static readonly CONFIGURE_OPTIONS = "@app/authorize/configure_options";
}
export declare class SocketIOKeys {
    static readonly SOCKET_IO_INSTANCE = "@app/socket-io/instance";
    static readonly IDENTIFIER = "@app/socket-io/identifier";
    static readonly SERVER_OPTIONS = "@app/socket-io/server-options";
    static readonly REDIS_CONNECTION = "@app/socket-io/redis-connection";
    static readonly AUTHENTICATE_HANDLER = "@app/socket-io/authenticate-handler";
    static readonly CLIENT_CONNECTED_HANDLER = "@app/socket-io/client-connected-handler";
}
export declare class MigrationKeys {
    static readonly MIGRATION_MODEL = "@app/migration/component/models/migration";
    static readonly MIGRATION_REPOSITORY = "@app/migration/component/repositories/migration";
    static readonly MIGRATION_DATASOURCE = "@app/migration/datasource";
}
export declare class MinioKeys {
    static readonly MINIO_INSTANCE = "@app/minio/instance";
    static readonly CONNECTION_OPTIONS = "@app/minio/connection-options";
}
