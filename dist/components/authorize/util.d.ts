import { MetadataMap } from '@loopback/core';
import { Permission } from '../../models';
import { PermissionRepository } from '../../repositories';
export interface IPermission {
    code: string;
    subject: string;
    action: string;
    scope: string;
    name: string;
    parentId: number;
    pType: string;
    details?: Record<string, unknown>;
}
/**
 * Usage:
 * Step 1: Write a migratePermission file by your own
 * Step 2: Write a script for generate permission in package.json
 *
 *
 * STEP 1 >>>>
 * import GeneratePermissionService ....
 * import * as ControllerClasses from './your-controller-path'
 *
 * const migratePermissions = async () => {
 *   try {
 *     // your application
 *     const app = new Application();
 *     await app.boot();
 *
 *     const generatePermissionService = new GeneratePermissionService()
 *
 *     // your permission repository
 *     const permissionRepository = app.getSync<PermissionRepository>('repositories.PermissionRepository');
 *
     await generatePermissionService.startMigration({ permissionRepository, controllers: (ControllerClasses as any) });
*
 *     process.exit(0);
 *   } catch (e) {
 *     console.error('Cannot migrate controllers: ', e);
 *     process.exit(1);
 *   }
 * }
 *
 * migratePermissions()
 *
 * STEP 2 >>>>
 * eg:
 * In file -> package.json
 * "migrate-permission": "npm run build && node --trace-warnings -r dotenv-flow/config ./dist/migrate-permission",
 * "generatePermission:production": "NODE_ENV=production RUN_MODE=migrate-permission npm run migrate-permission",
 * "generatePermission:dev": "NODE_ENV=development RUN_MODE=migrate-permission npm run migrate-permission",
 * "generatePermission:local": "NODE_ENV=local RUN_MODE=migrate-permission npm run migrate-permission",
 */
export declare class GeneratePermissionService {
    getMethodsClass(controllerPrototype: object): string[];
    generateParentPermissions(opts: {
        controller: Function;
        permissionRepository: PermissionRepository;
    }): Promise<void>;
    generatePermissions(opts: {
        methods: string[];
        permissionSubject: string;
        parentId: number;
        allPermissionDecoratorData: MetadataMap<unknown> | object | any;
    }): IPermission[];
    generatePermissionBaseInherit: (opts: {
        methodsParentsMethods: string[];
        methodsChildClass: string[];
        parentPermission: Permission;
        allPermissionDecoratorData: MetadataMap<unknown> | object;
    }) => IPermission[];
    generatePermissionRecords(opts: {
        controller: Function;
        parentPermission: Permission;
        permissionRepository: PermissionRepository;
        allPermissionDecoratorData: MetadataMap<unknown> | object;
    }): IPermission[];
    updatePermissionByChangeMethodName(permissionSubject: string, allPermissionDecoratorData: Record<string, {
        idx: string;
    }>, permissionRepository: PermissionRepository): Promise<void>;
    startMigration(opts: {
        permissionRepository: any;
        controllers: object;
    }): Promise<void>;
}
