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
exports.GeneratePermissionService = void 0;
const common_1 = require("../../../common");
const helpers_1 = require("../../../helpers");
const union_1 = __importDefault(require("lodash/union"));
const decorator_1 = require("../decorator");
class GeneratePermissionService {
    constructor() {
        this.generatePermissionBaseInherit = (opts) => {
            const { methodsChildClass, methodsParentsMethods, parentPermission, allPermissionDecoratorData } = opts !== null && opts !== void 0 ? opts : {};
            const defaultPermissions = [
                'count',
                'create',
                'find',
                'findOne',
                'findById',
                'replaceById',
                'updateById',
                'deleteById',
                'updateAll',
            ];
            // Controller not extended from any class
            if (methodsParentsMethods.includes('__proto__')) {
                return this.generatePermissions({
                    methods: methodsChildClass,
                    permissionSubject: parentPermission.subject,
                    parentId: parentPermission.id,
                    allPermissionDecoratorData,
                });
            }
            // Controller is extended from CrudController
            return this.generatePermissions({
                methods: (0, union_1.default)(defaultPermissions, methodsChildClass),
                permissionSubject: parentPermission.subject,
                parentId: parentPermission.id,
                allPermissionDecoratorData,
            });
        };
    }
    getMethodsClass(controllerPrototype) {
        return Reflect.ownKeys(controllerPrototype).slice(1);
    }
    generateParentPermissions(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { controller, permissionRepository } = opts !== null && opts !== void 0 ? opts : {};
            const controllerName = controller.name;
            const permissionSubject = (_a = controllerName.replace(/Controller/g, '')) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            const parentPermissions = {
                name: `All permissions of ${permissionSubject}`,
                code: `${permissionSubject}.*`,
                subject: permissionSubject,
                action: common_1.EnforcerDefinitions.ACTION_EXECUTE,
                pType: 'p',
            };
            yield permissionRepository.upsertWith(Object.assign({}, parentPermissions), { code: parentPermissions.code });
        });
    }
    generatePermissions(opts) {
        const { methods, permissionSubject, parentId, allPermissionDecoratorData } = opts !== null && opts !== void 0 ? opts : {};
        return methods.map(m => {
            return {
                name: `Permission ${m} ${permissionSubject}`,
                code: `${permissionSubject}.${m}`,
                subject: permissionSubject,
                action: common_1.EnforcerDefinitions.ACTION_EXECUTE,
                scope: m.match(/get|find|search|count/gim) ? common_1.EnforcerDefinitions.ACTION_READ : common_1.EnforcerDefinitions.ACTION_WRITE,
                pType: 'p',
                parentId,
                details: allPermissionDecoratorData === null || allPermissionDecoratorData === void 0 ? void 0 : allPermissionDecoratorData[m],
            };
        });
    }
    generatePermissionRecords(opts) {
        const { controller, parentPermission, allPermissionDecoratorData } = opts;
        const permissionRecords = [];
        const controllerPrototype = controller.prototype;
        const methodsChildClass = this.getMethodsClass(controllerPrototype);
        const parentClass = Reflect.getPrototypeOf(controllerPrototype);
        const methodsParentsMethods = this.getMethodsClass(parentClass);
        permissionRecords.push(...this.generatePermissionBaseInherit({
            methodsParentsMethods,
            methodsChildClass,
            parentPermission,
            allPermissionDecoratorData,
        }));
        return permissionRecords;
    }
    updatePermissionByChangeMethodName(permissionSubject, allPermissionDecoratorData, permissionRepository) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!Object.values(allPermissionDecoratorData).length) {
                return;
            }
            const allPermissionDecorators = Object.entries(allPermissionDecoratorData);
            for (const [key, value] of allPermissionDecorators) {
                const permissionsFound = yield permissionRepository.find({
                    where: {
                        subject: permissionSubject,
                        code: {
                            neq: `${permissionSubject}.*`,
                        },
                    },
                });
                for (const p of permissionsFound) {
                    if (!((_a = p === null || p === void 0 ? void 0 : p.details) === null || _a === void 0 ? void 0 : _a.idx) || ((_b = p === null || p === void 0 ? void 0 : p.details) === null || _b === void 0 ? void 0 : _b.idx) !== value.idx) {
                        continue;
                    }
                    yield permissionRepository.updateById(p.id, Object.assign(Object.assign({}, p), { code: `${permissionSubject}.${key}`, details: Object.assign({}, value) }));
                }
            }
        });
    }
    startMigration(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { permissionRepository, controllers } = opts;
            const permissions = [];
            for (const controller of controllers) {
                const permissionSubject = controller.name.replace(/Controller/g, '');
                const controllerPrototype = controller.prototype;
                const permissionSubjectLowerCase = permissionSubject === null || permissionSubject === void 0 ? void 0 : permissionSubject.toLowerCase();
                helpers_1.applicationLogger.info('[Migrate Permissions] Migration permissions for: %s', controller.name);
                yield this.generateParentPermissions({ controller, permissionRepository });
                const parentPermission = yield permissionRepository.findOne({
                    where: { subject: permissionSubjectLowerCase },
                });
                if (!parentPermission) {
                    continue;
                }
                const allPermissionDecoratorData = (_a = (0, decorator_1.getDecoratorData)(controllerPrototype, decorator_1.MetadataDecoratorKeys.PERMISSION)) !== null && _a !== void 0 ? _a : {};
                const permissionList = this.generatePermissionRecords({
                    controller,
                    parentPermission,
                    permissionRepository,
                    allPermissionDecoratorData,
                });
                yield this.updatePermissionByChangeMethodName(permissionSubjectLowerCase, allPermissionDecoratorData, permissionRepository);
                permissions.push(...permissionList);
            }
            for (const p of permissions) {
                yield permissionRepository.upsertWith(p, { code: p.code });
            }
        });
    }
}
exports.GeneratePermissionService = GeneratePermissionService;
//# sourceMappingURL=generator.service.js.map