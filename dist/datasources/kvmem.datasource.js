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
var KvMemDataSource_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KvMemDataSource = void 0;
const base_datasource_1 = require("@/base/base.datasource");
const core_1 = require("@loopback/core");
const databaseConfigs = {
    name: 'kvmem',
    connector: 'kv-memory',
};
let KvMemDataSource = KvMemDataSource_1 = class KvMemDataSource extends base_datasource_1.BaseDataSource {
    constructor(dsConfig = databaseConfigs) {
        super({ dsConfig, scope: KvMemDataSource_1.name });
        this.logger.info('[Datasource] KvMem Datasource Config: %j', dsConfig);
    }
};
exports.KvMemDataSource = KvMemDataSource;
KvMemDataSource.dataSourceName = databaseConfigs.name;
KvMemDataSource.defaultConfig = databaseConfigs;
exports.KvMemDataSource = KvMemDataSource = KvMemDataSource_1 = __decorate([
    __param(0, (0, core_1.inject)(`datasources.config.${databaseConfigs.name}`, { optional: true })),
    __metadata("design:paramtypes", [Object])
], KvMemDataSource);
//# sourceMappingURL=kvmem.datasource.js.map