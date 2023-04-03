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
exports.MigrationComponent = void 0;
const base_application_1 = require("../../base/base.application");
const base_component_1 = require("../../base/base.component");
const common_1 = require("../../common");
const models_1 = require("../../models");
const repositories_1 = require("../../repositories");
const core_1 = require("@loopback/core");
let MigrationComponent = class MigrationComponent extends base_component_1.BaseComponent {
    constructor(application) {
        super({ scope: MigrationComponent.name });
        this.application = application;
        this.bindings = [
            // Model bindings
            core_1.Binding.bind(common_1.MigrationKeys.MIGRATION_MODEL).toClass(models_1.Migration),
            // Datasource bindings
            // Binding.bind(MigrationKeys.MIGRATION_DATASOURCE).to(null),
            // Repository bindings
            core_1.Binding.bind(common_1.MigrationKeys.MIGRATION_REPOSITORY).toClass(repositories_1.MigrationRepository),
        ];
        this.binding();
    }
    defineModels() {
        this.application.model(models_1.Migration);
        this.application.models.add(models_1.Migration.name);
    }
    defineRepositories() {
        this.application.repository(repositories_1.MigrationRepository);
    }
    binding() {
        this.logger.info('[binding] Binding migration component for application...');
        this.defineModels();
        this.defineRepositories();
    }
};
MigrationComponent = __decorate([
    __param(0, (0, core_1.inject)(core_1.CoreBindings.APPLICATION_INSTANCE)),
    __metadata("design:paramtypes", [base_application_1.BaseApplication])
], MigrationComponent);
exports.MigrationComponent = MigrationComponent;
//# sourceMappingURL=component.js.map