"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CasbinRedisAdapter = void 0;
const base_adapter_1 = require("./base.adapter");
class CasbinRedisAdapter extends base_adapter_1.AbstractCasbinAdapter {
    constructor(datasource) {
        super({ scope: CasbinRedisAdapter.name, datasource });
    }
    loadFilteredPolicy(_model, _filter) {
        throw new Error('Method not implemented.');
    }
    isFiltered() {
        throw new Error('Method not implemented.');
    }
    loadPolicy(_model) {
        throw new Error('Method not implemented.');
    }
    savePolicy(_model) {
        throw new Error('Method not implemented.');
    }
    addPolicy(_sec, _ptype, _rule) {
        throw new Error('Method not implemented.');
    }
    removePolicy(_sec, _ptype, _rule) {
        throw new Error('Method not implemented.');
    }
    removeFilteredPolicy(_sec, _ptype, _fieldIndex, ..._fieldValues) {
        throw new Error('Method not implemented.');
    }
}
exports.CasbinRedisAdapter = CasbinRedisAdapter;
//# sourceMappingURL=casbin-redis-adapter.helper.js.map