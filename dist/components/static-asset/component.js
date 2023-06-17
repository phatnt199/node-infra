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
exports.StaticAssetComponent = void 0;
const base_application_1 = require("../../base/base.application");
const base_component_1 = require("../../base/base.component");
const common_1 = require("../../common");
const helpers_1 = require("../../helpers");
const utilities_1 = require("../../utilities");
const core_1 = require("@loopback/core");
const controller_1 = require("./controller");
let StaticAssetComponent = class StaticAssetComponent extends base_component_1.BaseComponent {
    constructor(application) {
        super({ scope: StaticAssetComponent.name });
        this.application = application;
        this.bindings = [core_1.Binding.bind(common_1.MinioKeys.CONNECTION_OPTIONS).to(null)];
        this.binding();
    }
    defineControllers() {
        this.application.controller(controller_1.StaticAssetController);
    }
    binding() {
        if (!this.application) {
            throw (0, utilities_1.getError)({
                statusCode: 500,
                message: '[binding] Invalid application to bind AuthenticateComponent',
            });
        }
        this.logger.info('[binding] Binding static asset for application...');
        const connectionOptions = this.application.getSync(common_1.MinioKeys.CONNECTION_OPTIONS);
        const minioHelper = new helpers_1.MinioHelper(connectionOptions);
        this.application.bind(common_1.MinioKeys.MINIO_INSTANCE).to(minioHelper);
        this.defineControllers();
    }
};
StaticAssetComponent = __decorate([
    __param(0, (0, core_1.inject)(core_1.CoreBindings.APPLICATION_INSTANCE)),
    __metadata("design:paramtypes", [base_application_1.BaseApplication])
], StaticAssetComponent);
exports.StaticAssetComponent = StaticAssetComponent;
//# sourceMappingURL=component.js.map