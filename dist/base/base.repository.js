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
exports.ViewCrudRepository = exports.TimestampCrudRepository = exports.AbstractTimestampRepository = void 0;
const repository_1 = require("@loopback/repository");
// ----------------------------------------------------------------------------------------------------------------------------------------
class AbstractTimestampRepository extends repository_1.DefaultCrudRepository {
    constructor(entityClass, dataSource) {
        super(entityClass, dataSource);
    }
}
exports.AbstractTimestampRepository = AbstractTimestampRepository;
// ----------------------------------------------------------------------------------------------------------------------------------------
class TimestampCrudRepository extends AbstractTimestampRepository {
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
        const enriched = this.mixTimestamp(data, { newInstance: true });
        return super.create(enriched, options);
    }
    createAll(datum, options) {
        const enriched = datum.map(data => {
            return this.mixTimestamp(data, { newInstance: true });
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
        const enriched = this.mixTimestamp(data);
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
        const enriched = this.mixTimestamp(data);
        return super.updateAll(enriched, where, options);
    }
    updateWith(data, where) {
        return this.updateAll(data, where);
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
        const enriched = this.mixTimestamp(data);
        return super.replaceById(id, enriched, options);
    }
    mixTimestamp(entity, options = { newInstance: false }) {
        if (options === null || options === void 0 ? void 0 : options.newInstance) {
            entity.createdAt = new Date();
        }
        entity.modifiedAt = new Date();
        return entity;
    }
}
exports.TimestampCrudRepository = TimestampCrudRepository;
// ----------------------------------------------------------------------------------------------------------------------------------------
class ViewCrudRepository extends repository_1.DefaultCrudRepository {
    constructor(entityClass, dataSource) {
        super(entityClass, dataSource);
    }
    existsWith(where, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const rs = yield this.findOne({ where }, options);
            return rs !== null && rs !== undefined;
        });
    }
}
exports.ViewCrudRepository = ViewCrudRepository;
//# sourceMappingURL=base.repository.js.map