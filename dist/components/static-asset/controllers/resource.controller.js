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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var StaticResourceController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticResourceController = void 0;
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const base_1 = require("../../../base");
const common_1 = require("../../../common");
const helpers_1 = require("../../../helpers");
const utilities_1 = require("../../../utilities");
const fs_1 = __importDefault(require("fs"));
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const multer_1 = __importDefault(require("multer"));
const path_1 = require("path");
let StaticResourceController = StaticResourceController_1 = class StaticResourceController {
    constructor(application, request, response) {
        this.application = application;
        this.request = request;
        this.response = response;
        this.logger = helpers_1.LoggerFactory.getLogger([StaticResourceController_1.name]);
        this.temporaryStorage = multer_1.default.memoryStorage();
    }
    uploadObject() {
        return new Promise((resolve, reject) => {
            (0, multer_1.default)({ storage: this.temporaryStorage }).array('files')(this.request, this.response, error => {
                var _a, _b;
                if (error) {
                    this.logger.error('[uploadObject] Fail to upload files! Error: %s', error);
                    reject(error);
                }
                const files = ((_b = (_a = this.request) === null || _a === void 0 ? void 0 : _a.files) !== null && _b !== void 0 ? _b : []);
                const basePath = this.application.getSync(common_1.ResourceAssetKeys.RESOURCE_BASE_PATH);
                Promise.all(files === null || files === void 0 ? void 0 : files.map(file => {
                    const { originalname: originalName, 
                    // mimetype: mimeType,
                    buffer,
                    // size,
                    // encoding
                     } = file;
                    if (!originalName || (0, isEmpty_1.default)(originalName)) {
                        this.logger.error('[uploadObject] Invalid original name!');
                        return;
                    }
                    const normalizeName = originalName.toLowerCase().replace(/ /g, '_');
                    return new Promise((resolve, reject) => {
                        const t = new Date().getTime();
                        try {
                            const savedName = `${(0, utilities_1.dayjs)().format(common_1.Formatters.DATE_TIME_2)}_${normalizeName}`;
                            const path = (0, path_1.join)(basePath, savedName);
                            fs_1.default.writeFileSync(path, buffer);
                            this.logger.info('[upload] Uploaded: %s | Took: %s (ms)', originalName, new Date().getTime() - t);
                            resolve({ fileName: savedName });
                        }
                        catch (error) {
                            reject(error);
                        }
                    });
                })).then(rs => {
                    resolve(rs);
                });
            });
        });
    }
    downloadObject(objectName) {
        return new Promise((_, reject) => {
            const basePath = this.application.getSync(common_1.ResourceAssetKeys.RESOURCE_BASE_PATH);
            const savedPath = (0, path_1.join)(basePath, objectName);
            fs_1.default.stat(savedPath, (error, stats) => {
                if (error) {
                    reject(error);
                    return;
                }
                const { size } = stats;
                this.response.set({
                    'Content-Length': size,
                    'Content-Disposition': `attachment; filename=${objectName}`,
                });
                const rs = fs_1.default.createReadStream(savedPath);
                rs.pipe(this.response);
                rs.on('error', error => {
                    this.logger.error('[downloadObject] Error: %s', error);
                    throw (0, utilities_1.getError)({
                        message: `[downloadObject] Cannot download ${objectName}! Error while streaming data to client!`,
                        statusCode: 500,
                    });
                });
                rs.on('end', () => {
                    this.response.end();
                });
            });
        });
    }
};
exports.StaticResourceController = StaticResourceController;
__decorate([
    (0, rest_1.post)('/upload', {
        responses: {
            '200': {
                description: 'Upload files to resource folder',
                content: { 'application/json': {} },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StaticResourceController.prototype, "uploadObject", null);
__decorate([
    (0, rest_1.get)('/{object_name}/download'),
    __param(0, rest_1.param.path.string('object_name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StaticResourceController.prototype, "downloadObject", null);
exports.StaticResourceController = StaticResourceController = StaticResourceController_1 = __decorate([
    (0, rest_1.api)({ basePath: '/static-resources' }),
    __param(0, (0, core_1.inject)(core_1.CoreBindings.APPLICATION_INSTANCE)),
    __param(1, (0, core_1.inject)(rest_1.RestBindings.Http.REQUEST)),
    __param(2, (0, core_1.inject)(rest_1.RestBindings.Http.RESPONSE)),
    __metadata("design:paramtypes", [base_1.BaseApplication, Object, Object])
], StaticResourceController);
//# sourceMappingURL=resource.controller.js.map