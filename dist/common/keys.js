"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizerKeys = exports.AuthenticateKeys = void 0;
class AuthenticateKeys {
}
exports.AuthenticateKeys = AuthenticateKeys;
AuthenticateKeys.APPLICATION_SECRET = '@app/authenticate/application_secret';
class AuthorizerKeys {
}
exports.AuthorizerKeys = AuthorizerKeys;
AuthorizerKeys.APPLICATION_NAME = '@app/authorize/component/application_name';
// -----------------------------------------------------------------------------
AuthorizerKeys.ROLE_MODEL = '@app/authorize/component/models/user';
AuthorizerKeys.PERMISSION_MODEL = '@app/authorize/component/models/permission';
AuthorizerKeys.PERMISSION_MAPPING_MODEL = '@app/authorize/component/models/permission_mapping';
AuthorizerKeys.USER_ROLE_MODEL = '@app/authorize/component/models/user_role';
// -----------------------------------------------------------------------------
AuthorizerKeys.ROLE_REPOSITORY = '@app/authorize/component/repositories/user';
AuthorizerKeys.PERMISSION_REPOSITORY = '@app/authorize/component/repositories/permission';
AuthorizerKeys.PERMISSION_MAPPING_REPOSITORY = '@app/authorize/component/repositories/permission_mapping';
AuthorizerKeys.USER_ROLE_REPOSITORY = '@app/authorize/component/repositories/user_role';
// -----------------------------------------------------------------------------
AuthorizerKeys.PROVIDER = '@app/authorize/provider';
AuthorizerKeys.ENFORCER = '@app/authorize/enforcer';
AuthorizerKeys.ALWAYS_ALLOW_ROLES = '@app/authorize/always_allow_roles';
AuthorizerKeys.AUTHORIZE_DATASOURCE = '@app/authorize/enforcer/adapter/datasource';
AuthorizerKeys.CONFIGURE_OPTIONS = '@app/authorize/configure_options';
//# sourceMappingURL=keys.js.map