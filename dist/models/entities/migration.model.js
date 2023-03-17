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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration = void 0;
const repository_1 = require("@loopback/repository");
const base_1 = require("@/base");
const common_1 = require("@/common");
let Migration = class Migration extends base_1.BaseTzEntity {
    constructor(data) {
        super(data);
    }
};
__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    __metadata("design:type", String)
], Migration.prototype, "name", void 0);
__decorate([
    (0, repository_1.property)({
        type: 'string',
        default: common_1.MigrationStatuses.UNKNOWN,
    }),
    __metadata("design:type", String)
], Migration.prototype, "status", void 0);
Migration = __decorate([
    (0, repository_1.model)({
        settings: {
            postgresql: {
                schema: 'public',
                table: 'Migration',
            },
            strict: true,
            indexes: {
                INDEX_UNIQUE_NAME: {
                    keys: { name: 1 },
                    options: { unique: true },
                },
            },
        },
    }),
    __metadata("design:paramtypes", [Object])
], Migration);
exports.Migration = Migration;
//# sourceMappingURL=migration.model.js.map