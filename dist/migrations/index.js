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
exports.migration = void 0;
const common_1 = require("../common");
const helpers_1 = require("../helpers");
const migration = (application, migrationProcesses) => __awaiter(void 0, void 0, void 0, function* () {
    helpers_1.applicationLogger.info('START | Migrate database');
    const migrationRepository = application.getSync('repositories.MigrationRepository');
    for (const mirgation of migrationProcesses) {
        const { name, fn } = mirgation;
        if (!name || !fn) {
            continue;
        }
        let migrated = null;
        let migrateStatus = common_1.MigrationStatuses.UNKNOWN;
        try {
            migrated = yield migrationRepository.findOne({
                where: { name },
            });
            if (migrated && migrated.status === common_1.MigrationStatuses.SUCCESS) {
                migrateStatus = migrated.status;
                helpers_1.applicationLogger.info('[%s] SKIP | Migrate process', name);
                continue;
            }
            helpers_1.applicationLogger.info('[%s] START | Migrate process', name);
            yield fn(application);
            migrateStatus = common_1.MigrationStatuses.SUCCESS;
            helpers_1.applicationLogger.info('[%s] DONE | Migrate process', name);
        }
        catch (error) {
            migrateStatus = common_1.MigrationStatuses.FAIL;
            helpers_1.applicationLogger.error('[%s] FAILED | Migrate process | Error: %s', name, error);
        }
        finally {
            if (migrated) {
                yield migrationRepository.updateById(migrated.id, { status: migrateStatus });
            }
            else {
                yield migrationRepository.create({ name, status: migrateStatus });
            }
        }
    }
    helpers_1.applicationLogger.info('DONE | Migrate database');
});
exports.migration = migration;
//# sourceMappingURL=index.js.map