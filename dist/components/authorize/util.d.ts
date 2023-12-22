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
