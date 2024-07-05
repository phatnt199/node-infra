import { IController } from '@/common';
import { Constructor, MetadataMap } from '@loopback/core';
import { Permission } from '@/models';
import { PermissionRepository } from '@/repositories';
export interface IPermission {
    code: string;
    subject: string;
    action: string;
    scope: string;
    name: string;
    parentId: number;
    pType: string;
    details?: {
        idx: number;
    };
}
export declare class GeneratePermissionService {
    getMethodsClass(controllerPrototype: object): string[];
    generateParentPermissions(opts: {
        controller: Constructor<IController>;
        permissionRepository: PermissionRepository;
    }): Promise<void>;
    generatePermissions(opts: {
        methods: string[];
        permissionSubject: string;
        parentId: number;
        allPermissionDecoratorData: MetadataMap<{
            idx: number;
        }>;
    }): IPermission[];
    generatePermissionBaseInherit: (opts: {
        methodsParentsMethods: string[];
        methodsChildClass: string[];
        parentPermission: Permission;
        allPermissionDecoratorData: MetadataMap<{
            idx: number;
        }>;
    }) => IPermission[];
    generatePermissionRecords(opts: {
        controller: Constructor<IController>;
        parentPermission: Permission;
        permissionRepository: PermissionRepository;
        allPermissionDecoratorData: MetadataMap<{
            idx: number;
        }>;
    }): IPermission[];
    updatePermissionByChangeMethodName(permissionSubject: string, allPermissionDecoratorData: MetadataMap<{
        idx: number;
    }>, permissionRepository: PermissionRepository): Promise<void>;
    startMigration(opts: {
        permissionRepository: PermissionRepository;
        controllers: Array<Constructor<IController>>;
    }): Promise<void>;
}
