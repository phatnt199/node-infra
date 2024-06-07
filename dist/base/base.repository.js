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
exports.TextSearchTzCrudRepository = exports.TzCrudRepository = exports.ViewRepository = exports.KVRepository = exports.AbstractKVRepository = exports.AbstractTzRepository = void 0;
const utilities_1 = require("../utilities");
const repository_1 = require("@loopback/repository");
const get_1 = __importDefault(require("lodash/get"));
const helpers_1 = require("../helpers");
// ----------------------------------------------------------------------------------------------------------------------------------------
class AbstractTzRepository extends repository_1.DefaultCrudRepository {
    constructor(entityClass, dataSource, scope) {
        super(entityClass, dataSource);
        this.logger = helpers_1.LoggerFactory.getLogger([scope !== null && scope !== void 0 ? scope : '']);
    }
    beginTransaction(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.dataSource.beginTransaction(options !== null && options !== void 0 ? options : {}));
        });
    }
}
exports.AbstractTzRepository = AbstractTzRepository;
// ----------------------------------------------------------------------------------------------------------------------------------------
class AbstractKVRepository extends repository_1.DefaultKeyValueRepository {
    constructor(entityClass, dataSource) {
        super(entityClass, dataSource);
    }
}
exports.AbstractKVRepository = AbstractKVRepository;
// ----------------------------------------------------------------------------------------------------------------------------------------
class KVRepository extends AbstractKVRepository {
    constructor(entityClass, dataSource) {
        super(entityClass, dataSource);
    }
}
exports.KVRepository = KVRepository;
// ----------------------------------------------------------------------------------------------------------------------------------------
class ViewRepository extends repository_1.DefaultCrudRepository {
    constructor(entityClass, dataSource) {
        super(entityClass, dataSource);
    }
    existsWith(where, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield this.findOne({ where }, options);
            return rs !== null && rs !== undefined;
        });
    }
    create(_data, _options) {
        throw (0, utilities_1.getError)({
            statusCode: 500,
            message: 'Cannot manipulate entity with view repository!',
        });
    }
    createAll(_datum, _options) {
        throw (0, utilities_1.getError)({
            statusCode: 500,
            message: 'Cannot manipulate entity with view repository!',
        });
    }
    save(_entity, _options) {
        throw (0, utilities_1.getError)({
            statusCode: 500,
            message: 'Cannot manipulate entity with view repository!',
        });
    }
    update(_entity, _options) {
        throw (0, utilities_1.getError)({
            statusCode: 500,
            message: 'Cannot manipulate entity with view repository!',
        });
    }
    delete(_entity, _options) {
        throw (0, utilities_1.getError)({
            statusCode: 500,
            message: 'Cannot manipulate entity with view repository!',
        });
    }
    updateAll(_data, _where, _options) {
        throw (0, utilities_1.getError)({
            statusCode: 500,
            message: 'Cannot manipulate entity with view repository!',
        });
    }
    updateById(_id, _data, _options) {
        throw (0, utilities_1.getError)({
            statusCode: 500,
            message: 'Cannot manipulate entity with view repository!',
        });
    }
    replaceById(_id, _data, _options) {
        throw (0, utilities_1.getError)({
            statusCode: 500,
            message: 'Cannot manipulate entity with view repository!',
        });
    }
    deleteAll(_where, _options) {
        throw (0, utilities_1.getError)({
            statusCode: 500,
            message: 'Cannot manipulate entity with view repository!',
        });
    }
    deleteById(_id, _options) {
        throw (0, utilities_1.getError)({
            statusCode: 500,
            message: 'Cannot manipulate entity with view repository!',
        });
    }
}
exports.ViewRepository = ViewRepository;
// ----------------------------------------------------------------------------------------------------------------------------------------
class TzCrudRepository extends AbstractTzRepository {
    constructor(entityClass, dataSource, scope) {
        super(entityClass, dataSource, scope);
    }
    existsWith(where, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield this.findOne({ where }, options);
            return rs !== null && rs !== undefined;
        });
    }
    create(data, options) {
        var _a;
        let enriched = this.mixTimestamp(data, { newInstance: true, ignoreModified: (_a = options === null || options === void 0 ? void 0 : options.ignoreModified) !== null && _a !== void 0 ? _a : false });
        enriched = this.mixUserAudit(enriched, { newInstance: true, authorId: options === null || options === void 0 ? void 0 : options.authorId });
        return super.create(enriched, options);
    }
    createAll(datum, options) {
        const enriched = datum.map(data => {
            var _a;
            const tmp = this.mixTimestamp(data, { newInstance: true, ignoreModified: (_a = options === null || options === void 0 ? void 0 : options.ignoreModified) !== null && _a !== void 0 ? _a : false });
            return this.mixUserAudit(tmp, { newInstance: true, authorId: options === null || options === void 0 ? void 0 : options.authorId });
        });
        return super.createAll(enriched, options);
    }
    createWithReturn(data, options) {
        const _super = Object.create(null, {
            findById: { get: () => super.findById }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const saved = yield this.create(data, options);
            const rs = yield _super.findById.call(this, saved.id);
            return rs;
        });
    }
    updateById(id, data, options) {
        var _a;
        let enriched = this.mixTimestamp(data, { newInstance: false, ignoreModified: (_a = options === null || options === void 0 ? void 0 : options.ignoreModified) !== null && _a !== void 0 ? _a : false });
        enriched = this.mixUserAudit(enriched, { newInstance: false, authorId: options === null || options === void 0 ? void 0 : options.authorId });
        return super.updateById(id, enriched, options);
    }
    updateWithReturn(id, data, options) {
        const _super = Object.create(null, {
            findById: { get: () => super.findById }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateById(id, data, options);
            const rs = yield _super.findById.call(this, id);
            return rs;
        });
    }
    updateAll(data, where, options) {
        var _a;
        let enriched = this.mixTimestamp(data, { newInstance: false, ignoreModified: (_a = options === null || options === void 0 ? void 0 : options.ignoreModified) !== null && _a !== void 0 ? _a : false });
        enriched = this.mixUserAudit(enriched, { newInstance: false, authorId: options === null || options === void 0 ? void 0 : options.authorId });
        return super.updateAll(enriched, where, options);
    }
    upsertWith(data, where, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const isExisted = yield this.existsWith(where);
            if (isExisted) {
                yield this.updateAll(data, where, options);
                const rs = yield this.findOne({ where });
                return rs;
            }
            const rs = yield this.create(data, options);
            return rs;
        });
    }
    replaceById(id, data, options) {
        var _a;
        let enriched = this.mixTimestamp(data, { newInstance: false, ignoreModified: (_a = options === null || options === void 0 ? void 0 : options.ignoreModified) !== null && _a !== void 0 ? _a : false });
        enriched = this.mixUserAudit(enriched, { newInstance: false, authorId: options === null || options === void 0 ? void 0 : options.authorId });
        return super.replaceById(id, enriched, options);
    }
    softDelete(where, options) {
        return new Promise((resolve, reject) => {
            var _a, _b;
            const tableName = this.modelClass.definition.tableName((_a = options === null || options === void 0 ? void 0 : options.connectorType) !== null && _a !== void 0 ? _a : 'postgresql');
            const isSoftDeleteFieldExist = (0, get_1.default)(this.modelClass.definition.rawProperties, (_b = options === null || options === void 0 ? void 0 : options.softDeleteField) !== null && _b !== void 0 ? _b : 'isDeleted');
            if (!isSoftDeleteFieldExist) {
                throw (0, utilities_1.getError)({ message: `[softDelete] Model: ${this.modelClass.name} | Soft delete is not supported!` });
            }
            this.find({ fields: { id: true }, where })
                .then(rs => {
                const sql = helpers_1.QueryBuilderHelper.getPostgresQueryBuilder()
                    .from(tableName)
                    .update({ is_deleted: true })
                    .whereIn('id', rs.map(el => el.id))
                    .toQuery();
                this.execute(sql, null, options).then(resolve).catch(reject);
            })
                .catch(reject);
        });
    }
    mixTimestamp(entity, options = {
        newInstance: false,
        ignoreModified: false,
    }) {
        if (options === null || options === void 0 ? void 0 : options.newInstance) {
            entity.createdAt = new Date();
        }
        if (!options.ignoreModified) {
            entity.modifiedAt = new Date();
        }
        return entity;
    }
    mixUserAudit(entity, options) {
        if (!(options === null || options === void 0 ? void 0 : options.authorId)) {
            return entity;
        }
        if (options === null || options === void 0 ? void 0 : options.newInstance) {
            entity.createdBy = options.authorId;
        }
        entity.modifiedBy = options.authorId;
        return entity;
    }
}
exports.TzCrudRepository = TzCrudRepository;
// ----------------------------------------------------------------------------------------------------------------------------------------
class TextSearchTzCrudRepository extends TzCrudRepository {
    constructor(entityClass, dataSource) {
        super(entityClass, dataSource);
    }
    existsWith(where, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield this.findOne({ where }, options);
            return rs !== null && rs !== undefined;
        });
    }
    create(data, options) {
        const enriched = this.mixTextSearch(data, options);
        return super.create(enriched, options);
    }
    createAll(datum, options) {
        const enriched = datum.map(data => {
            return this.mixTextSearch(data, options);
        });
        return super.createAll(enriched, options);
    }
    createWithReturn(data, options) {
        const _super = Object.create(null, {
            findById: { get: () => super.findById }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const saved = yield this.create(data, options);
            return _super.findById.call(this, saved.id);
        });
    }
    updateById(id, data, options) {
        const enriched = this.mixTextSearch(data, options);
        return super.updateById(id, enriched, options);
    }
    updateWithReturn(id, data, options) {
        const _super = Object.create(null, {
            findById: { get: () => super.findById }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateById(id, data, options);
            return _super.findById.call(this, id);
        });
    }
    updateAll(data, where, options) {
        const enriched = this.mixTextSearch(data, options);
        return super.updateAll(enriched, where, options);
    }
    upsertWith(data, where) {
        return __awaiter(this, void 0, void 0, function* () {
            const isExisted = yield this.existsWith(where);
            if (isExisted) {
                yield this.updateAll(data, where);
                const rs = yield this.findOne({ where });
                return rs;
            }
            return this.create(data);
        });
    }
    replaceById(id, data, options) {
        const enriched = this.mixTextSearch(data, options);
        return super.replaceById(id, enriched, options);
    }
    mixTextSearch(entity, options) {
        const moreData = (0, get_1.default)(options, 'moreData');
        const ignoreUpdate = (0, get_1.default)(options, 'ignoreUpdate');
        if (ignoreUpdate) {
            return entity;
        }
        entity.textSearch = this.renderTextSearch(entity, moreData);
        return entity;
    }
}
exports.TextSearchTzCrudRepository = TextSearchTzCrudRepository;
//# sourceMappingURL=base.repository.js.map