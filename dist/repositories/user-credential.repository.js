"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCredentialRepository = void 0;
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const __1 = require("..");
let UserCredentialRepository = class UserCredentialRepository extends __1.TimestampCrudRepository {
    constructor(entityClass, dataSource, userRepositoryGetter) {
        super(entityClass, dataSource);
        this.userRepositoryGetter = userRepositoryGetter;
        this.user = this.createBelongsToAccessorFor('user', this.userRepositoryGetter);
        this.registerInclusionResolver('user', this.user.inclusionResolver);
    }
};
UserCredentialRepository = __decorate([
    __param(2, repository_1.repository.getter('UserRepository')),
    __metadata("design:paramtypes", [Object, __1.BaseDataSource, Function])
], UserCredentialRepository);
exports.UserCredentialRepository = UserCredentialRepository;
//# sourceMappingURL=user-credential.repository.js.map