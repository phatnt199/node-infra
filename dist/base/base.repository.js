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
exports.TzCrudRepository = exports.ViewRepository = exports.AbstractTzRepository = void 0;
const repository_1 = require("@loopback/repository");
const utilities_1 = require("@/utilities");
// ----------------------------------------------------------------------------------------------------------------------------------------
class AbstractTzRepository extends repository_1.DefaultCrudRepository {
    constructor(entityClass, dataSource) {
        super(entityClass, dataSource);
    }
}
exports.AbstractTzRepository = AbstractTzRepository;
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
        let enriched = this.mixTimestamp(data, { newInstance: true });
        enriched = this.mixUserAudit(enriched, { newInstance: true, authorId: options === null || options === void 0 ? void 0 : options.authorId });
        return super.create(enriched, options);
    }
    createAll(datum, options) {
        const enriched = datum.map(data => {
            const tmp = this.mixTimestamp(data, { newInstance: true });
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
            return _super.findById.call(this, saved.id);
        });
    }
    updateById(id, data, options) {
        let enriched = this.mixTimestamp(data, { newInstance: false });
        enriched = this.mixUserAudit(enriched, { newInstance: false, authorId: options === null || options === void 0 ? void 0 : options.authorId });
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
        let enriched = this.mixTimestamp(data, { newInstance: false });
        enriched = this.mixUserAudit(enriched, { newInstance: false, authorId: options === null || options === void 0 ? void 0 : options.authorId });
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
        let enriched = this.mixTimestamp(data, { newInstance: false });
        enriched = this.mixUserAudit(enriched, { newInstance: false, authorId: options === null || options === void 0 ? void 0 : options.authorId });
        return super.replaceById(id, enriched, options);
    }
    mixTimestamp(entity, options = { newInstance: false }) {
        if (options === null || options === void 0 ? void 0 : options.newInstance) {
            entity.createdAt = new Date();
        }
        entity.modifiedAt = new Date();
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
//# sourceMappingURL=base.repository.js.map