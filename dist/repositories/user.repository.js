"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const core_1 = require("@loopback/core");
const models_1 = require("../models");
const __1 = require("..");
class UserRepository extends __1.TimestampCrudRepository {
    constructor(dataSource, userIdentifierRepositoryGetter, userCredentialRepositoryGetter, userRoleRepositoryGetter, roleRepositoryGetter, permissionMappingRepositoryGetter, permissionRepositoryGetter) {
        super(models_1.User, dataSource);
        this.userIdentifierRepositoryGetter = userIdentifierRepositoryGetter;
        this.userCredentialRepositoryGetter = userCredentialRepositoryGetter;
        this.userRoleRepositoryGetter = userRoleRepositoryGetter;
        this.roleRepositoryGetter = roleRepositoryGetter;
        this.permissionMappingRepositoryGetter = permissionMappingRepositoryGetter;
        this.permissionRepositoryGetter = permissionRepositoryGetter;
        this.credentials = this.createHasManyRepositoryFactoryFor('credentials', this.userCredentialRepositoryGetter);
        // this.registerInclusionResolver('credentials', this.credentials.inclusionResolver);
        this.identifiers = this.createHasManyRepositoryFactoryFor('identifiers', this.userIdentifierRepositoryGetter);
        this.registerInclusionResolver('identifiers', this.identifiers.inclusionResolver);
        this.children = this.createHasManyRepositoryFactoryFor('children', core_1.Getter.fromValue(this));
        this.registerInclusionResolver('children', this.children.inclusionResolver);
        this.parent = this.createHasOneRepositoryFactoryFor('parent', core_1.Getter.fromValue(this));
        this.registerInclusionResolver('parent', this.parent.inclusionResolver);
        this.roles = this.createHasManyThroughRepositoryFactoryFor('roles', this.roleRepositoryGetter, this.userRoleRepositoryGetter);
        this.registerInclusionResolver('roles', this.roles.inclusionResolver);
        this.permissions = this.createHasManyThroughRepositoryFactoryFor('permissions', this.permissionRepositoryGetter, this.permissionMappingRepositoryGetter);
        this.registerInclusionResolver('permissions', this.permissions.inclusionResolver);
        this.policies = this.createHasManyRepositoryFactoryFor('policies', this.permissionMappingRepositoryGetter);
        this.registerInclusionResolver('policies', this.policies.inclusionResolver);
    }
    // -----------------------------------------------------------------------------------------------------------------
    getSignInCredential(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, identifierScheme, credentialScheme } = opts;
            const identifiers = yield this.identifiers(userId).find({
                where: { scheme: identifierScheme },
            });
            const credentials = yield this.credentials(userId).find({
                where: { scheme: credentialScheme },
            });
            return {
                userId,
                identifier: identifiers === null || identifiers === void 0 ? void 0 : identifiers[0],
                credential: credentials === null || credentials === void 0 ? void 0 : credentials[0],
            };
        });
    }
    // -----------------------------------------------------------------------------------------------------------------
    findCredential(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, scheme, provider } = opts;
            try {
                const where = { scheme };
                if (provider) {
                    where.provider = provider;
                }
                const credentials = yield this.credentials(userId).find({ where });
                if ((credentials === null || credentials === void 0 ? void 0 : credentials.length) > 1) {
                    throw (0, __1.getError)({
                        statusCode: 400,
                        message: '[findCredential] Please specify credential provider!',
                    });
                }
                return credentials === null || credentials === void 0 ? void 0 : credentials[0];
            }
            catch (err) {
                if (err.code === 'ENTITY_NOT_FOUND') {
                    return undefined;
                }
                throw err;
            }
        });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map