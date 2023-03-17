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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserIdentifierRepository = void 0;
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const __1 = require("..");
class UserIdentifierRepository extends __1.TimestampCrudRepository {
    constructor(entityClass, dataSource, userRepositoryGetter) {
        super(entityClass, dataSource);
        this.userRepositoryGetter = userRepositoryGetter;
        this.user = this.createBelongsToAccessorFor('user', this.userRepositoryGetter);
        this.registerInclusionResolver('user', this.user.inclusionResolver);
    }
    findUser(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { scheme, identifier } = opts;
            if (!identifier || (0, isEmpty_1.default)(identifier)) {
                return null;
            }
            const where = { identifier };
            if (scheme) {
                where.scheme = scheme;
            }
            const userIdentifier = yield this.findOne({ where });
            if (!userIdentifier) {
                return null;
            }
            const userRepository = yield this.userRepositoryGetter();
            const user = yield userRepository.findById(userIdentifier.userId);
            return user;
        });
    }
}
exports.UserIdentifierRepository = UserIdentifierRepository;
//# sourceMappingURL=user-identifier.repository.js.map