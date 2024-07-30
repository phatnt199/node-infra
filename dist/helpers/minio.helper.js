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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinioHelper = void 0;
const common_1 = require("../common");
const helpers_1 = require("../helpers");
const utilities_1 = require("../utilities");
const isEmpty_1 = __importDefault(require("lodash/isEmpty"));
const minio_1 = require("minio");
class MinioHelper {
    constructor(options) {
        this.logger = helpers_1.LoggerFactory.getLogger([MinioHelper.name]);
        this.client = new minio_1.Client(options);
    }
    isBucketExists(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = opts;
            if (!name || (0, isEmpty_1.default)(name)) {
                return false;
            }
            const isExists = yield this.client.bucketExists(name);
            return isExists;
        });
    }
    getBuckets() {
        return __awaiter(this, void 0, void 0, function* () {
            const buckets = yield this.client.listBuckets();
            return buckets;
        });
    }
    getBucket(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const isExists = yield this.isBucketExists(opts);
            if (!isExists) {
                return null;
            }
            const allBuckets = yield this.getBuckets();
            const bucket = allBuckets.find(el => el.name === opts.name);
            return bucket;
        });
    }
    createBucket(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = opts;
            if (!name || (0, isEmpty_1.default)(name)) {
                throw (0, utilities_1.getError)({ message: '[createBucket] Invalid name to create bucket!' });
            }
            yield this.client.makeBucket(name);
            const bucket = yield this.getBucket({ name });
            return bucket;
        });
    }
    removeBucket(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name } = opts;
            if (!name || (0, isEmpty_1.default)(name)) {
                throw (0, utilities_1.getError)({ message: '[removeBucket] Invalid name to remove bucket!' });
            }
            yield this.client.removeBucket(name);
            return true;
        });
    }
    getFileType(opts) {
        var _a, _b, _c;
        const { mimeType } = opts;
        if ((_a = mimeType === null || mimeType === void 0 ? void 0 : mimeType.toLowerCase()) === null || _a === void 0 ? void 0 : _a.startsWith(common_1.MimeTypes.IMAGE)) {
            return common_1.MimeTypes.IMAGE;
        }
        if ((_b = mimeType === null || mimeType === void 0 ? void 0 : mimeType.toLowerCase()) === null || _b === void 0 ? void 0 : _b.startsWith(common_1.MimeTypes.VIDEO)) {
            return common_1.MimeTypes.VIDEO;
        }
        if ((_c = mimeType === null || mimeType === void 0 ? void 0 : mimeType.toLowerCase()) === null || _c === void 0 ? void 0 : _c.startsWith(common_1.MimeTypes.TEXT)) {
            return common_1.MimeTypes.TEXT;
        }
        return common_1.MimeTypes.UNKNOWN;
    }
    upload(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { bucket, files } = opts;
            const isExists = yield this.isBucketExists({ name: bucket });
            if (!isExists) {
                return [];
            }
            if (!(files === null || files === void 0 ? void 0 : files.length)) {
                return [];
            }
            const rs = yield Promise.all(files === null || files === void 0 ? void 0 : files.map(file => {
                const { originalname: originalName, mimetype: mimeType, buffer, size, encoding } = file;
                if (!originalName || (0, isEmpty_1.default)(originalName)) {
                    this.logger.error('[upload] Invalid original name!');
                    return;
                }
                const normalizeName = originalName.toLowerCase().replace(/ /g, '_');
                return new Promise((resolve, reject) => {
                    const t = new Date().getTime();
                    this.client
                        .putObject(bucket, normalizeName, buffer, size, {
                        originalName,
                        normalizeName,
                        size,
                        encoding,
                        mimeType,
                    })
                        .then(uploadInfo => {
                        this.logger.info('[upload] Uploaded: %j | Took: %s (ms)', uploadInfo, new Date().getTime() - t);
                        resolve({
                            bucket,
                            fileName: normalizeName,
                            link: `/static-assets/${bucket}/${normalizeName.replace(/\//g, '%2')}`,
                        });
                    })
                        .catch(error => {
                        reject(error);
                    });
                });
            }));
            return rs;
        });
    }
    getFile(opts) {
        const { bucket, name, options } = opts;
        return this.client.getObject(bucket, name, options);
    }
    getStat(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const { bucket, name } = opts;
            const stat = yield this.client.statObject(bucket, name);
            return stat;
        });
    }
    removeObject(opts) {
        const { bucket, name } = opts;
        this.client.removeObject(bucket, name);
    }
    getListObjects(opts) {
        const { bucket, prefix = '', recursive = false } = opts;
        const listObjects = this.client.listObjects(bucket, prefix, recursive);
        return listObjects;
    }
}
exports.MinioHelper = MinioHelper;
//# sourceMappingURL=minio.helper.js.map