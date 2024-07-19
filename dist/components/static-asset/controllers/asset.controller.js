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
var StaticAssetController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticAssetController = void 0;
const base_1 = require("../../../base");
const common_1 = require("../../../common");
const helpers_1 = require("../../../helpers");
const utilities_1 = require("../../../utilities");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const multer_1 = __importDefault(require("multer"));
let StaticAssetController = StaticAssetController_1 = class StaticAssetController {
    constructor(application, response) {
        this.application = application;
        this.response = response;
        this.logger = helpers_1.LoggerFactory.getLogger([StaticAssetController_1.name]);
        this.temporaryStorage = multer_1.default.memoryStorage();
    }
    createBucket(bucketName) {
        const minioInstance = this.application.getSync(common_1.ResourceAssetKeys.MINIO_INSTANCE);
        return minioInstance.createBucket({ name: bucketName });
    }
    removeBucket(bucketName) {
        const minioInstance = this.application.getSync(common_1.ResourceAssetKeys.MINIO_INSTANCE);
        return minioInstance.removeBucket({ name: bucketName });
    }
    getBucket(bucketName) {
        const minioInstance = this.application.getSync(common_1.ResourceAssetKeys.MINIO_INSTANCE);
        return minioInstance.getBucket({ name: bucketName });
    }
    getBuckets() {
        const minioInstance = this.application.getSync(common_1.ResourceAssetKeys.MINIO_INSTANCE);
        return minioInstance.getBuckets();
    }
    uploadObject(request, bucketName) {
        const minioInstance = this.application.getSync(common_1.ResourceAssetKeys.MINIO_INSTANCE);
        return new Promise((resolve, reject) => {
            (0, multer_1.default)({ storage: this.temporaryStorage }).array('files')(request, this.response, error => {
                if (error) {
                    this.logger.error('[uploadObject] Fail to upload files! Error: %s', error);
                    reject(error);
                }
                const { files } = request;
                minioInstance.upload({ bucket: bucketName, files: files }).then(rs => {
                    resolve(rs);
                });
            });
        });
    }
    downloadObject(bucketName, objectName) {
        const minioInstance = this.application.getSync(common_1.ResourceAssetKeys.MINIO_INSTANCE);
        return new Promise(() => {
            minioInstance.getStat({ bucket: bucketName, name: objectName }).then(fileStat => {
                const { size, metaData } = fileStat;
                this.response.set(Object.assign(Object.assign({}, metaData), { 'Content-Length': size, 'Content-Disposition': `attachment; filename=${objectName}` }));
                minioInstance
                    .getFile({
                    bucket: bucketName,
                    name: objectName,
                })
                    .then(stream => {
                    stream.pipe(this.response);
                    stream.on('end', () => {
                        this.response.end();
                    });
                })
                    .catch(error => {
                    this.logger.error('[downloadObject] Error: %s', error);
                    throw (0, utilities_1.getError)({
                        message: `[downloadObject] Cannot download ${objectName}! Error while streaming data to client!`,
                        statusCode: 500,
                    });
                });
            });
        });
    }
    getStaticObject(bucketName, objectName) {
        const minioInstance = this.application.getSync(common_1.ResourceAssetKeys.MINIO_INSTANCE);
        return new Promise(() => {
            minioInstance.getStat({ bucket: bucketName, name: objectName }).then(fileStat => {
                const { size, metaData } = fileStat;
                this.response.writeHead(206, Object.assign(Object.assign({}, metaData), { 'Content-Length': size }));
                minioInstance
                    .getFile({
                    bucket: bucketName,
                    name: objectName,
                })
                    .then(stream => {
                    stream.pipe(this.response);
                })
                    .catch(error => {
                    this.logger.error('[getStaticObject] Error: %s', error);
                    throw (0, utilities_1.getError)({
                        message: `[getStaticObject] Cannot stream ${objectName}! Error while streaming data to client!`,
                        statusCode: 500,
                    });
                });
            });
        });
    }
};
exports.StaticAssetController = StaticAssetController;
__decorate([
    (0, rest_1.post)('/buckets/{bucket_name}', {
        responses: {
            '200': {
                description: 'Create minio bucket with name',
                content: { 'application/json': {} },
            },
        },
    }),
    __param(0, rest_1.param.path.string('bucket_name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StaticAssetController.prototype, "createBucket", null);
__decorate([
    (0, rest_1.del)('/buckets/{bucket_name}', {
        responses: {
            '200': {
                description: 'Delete minio bucket by name',
                content: { 'application/json': {} },
            },
        },
    }),
    __param(0, rest_1.param.path.string('bucket_name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StaticAssetController.prototype, "removeBucket", null);
__decorate([
    (0, rest_1.get)('/buckets/{bucket_name}', {
        responses: {
            '200': {
                description: 'Get minio bucket by name',
                content: { 'application/json': {} },
            },
        },
    }),
    __param(0, rest_1.param.path.string('bucket_name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StaticAssetController.prototype, "getBucket", null);
__decorate([
    (0, rest_1.get)('/buckets', {
        responses: {
            '200': {
                description: 'Get minio bucket by name',
                content: { 'application/json': {} },
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StaticAssetController.prototype, "getBuckets", null);
__decorate([
    (0, rest_1.post)('/buckets/{bucket_name}/upload', {
        responses: {
            '200': {
                description: 'Upload files to bucket',
                content: { 'application/json': {} },
            },
        },
    }),
    __param(0, (0, rest_1.requestBody)({
        description: 'Upload files to minio',
        required: true,
        content: {
            'multipart/form-data': {
                schema: {
                    type: 'object',
                    properties: {
                        files: {
                            type: 'array',
                            nullable: false,
                            items: {
                                type: 'string',
                                format: 'binary',
                            },
                        },
                    },
                },
            },
        },
    })),
    __param(1, rest_1.param.path.string('bucket_name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], StaticAssetController.prototype, "uploadObject", null);
__decorate([
    (0, rest_1.get)('/{bucket_name}/{object_name}/download'),
    __param(0, rest_1.param.path.string('bucket_name')),
    __param(1, rest_1.param.path.string('object_name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StaticAssetController.prototype, "downloadObject", null);
__decorate([
    (0, rest_1.get)('/{bucket_name}/{object_name}'),
    __param(0, rest_1.param.path.string('bucket_name')),
    __param(1, rest_1.param.path.string('object_name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StaticAssetController.prototype, "getStaticObject", null);
exports.StaticAssetController = StaticAssetController = StaticAssetController_1 = __decorate([
    (0, rest_1.api)({ basePath: '/static-assets' }),
    __param(0, (0, core_1.inject)(core_1.CoreBindings.APPLICATION_INSTANCE)),
    __param(1, (0, core_1.inject)(rest_1.RestBindings.Http.RESPONSE)),
    __metadata("design:paramtypes", [base_1.BaseApplication, Object])
], StaticAssetController);
//# sourceMappingURL=asset.controller.js.map