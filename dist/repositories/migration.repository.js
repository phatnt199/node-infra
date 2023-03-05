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
exports.MigrationRepository = void 0;
const core_1 = require("@loopback/core");
const models_1 = require("../models");
const base_1 = require("../base");
const lodash_1 = require("lodash");
const __1 = require("..");
const migrationDs = process.env.DS_MIGRATION;
if (!migrationDs || (0, lodash_1.isEmpty)(migrationDs)) {
    throw (0, __1.getError)({ message: `[DANGER] INVALID MIGRATION DATASOURCE | Check again env DS_MIGRATION` });
}
let MigrationRepository = class MigrationRepository extends base_1.TimestampCrudRepository {
    constructor(dataSource) {
        super(models_1.Migration, dataSource);
    }
};
MigrationRepository = __decorate([
    __param(0, (0, core_1.inject)(`datasources.${migrationDs}`)),
    __metadata("design:paramtypes", [base_1.BaseDataSource])
], MigrationRepository);
exports.MigrationRepository = MigrationRepository;
//# sourceMappingURL=migration.repository.js.map