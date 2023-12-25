import { MetadataMap } from '@loopback/core';
import { Permission } from '../../models';
import { AbstractAuthorizeRepository, PermissionRepository } from '../../repositories';
import { BaseTzEntity } from '../../base';
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
    generateParentPermissions<T extends BaseTzEntity>(opts: {
        controller: Function;
        permissionRepository: AbstractAuthorizeRepository<T> | PermissionRepository;
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
    generatePermissionRecords<T extends BaseTzEntity>(opts: {
        controller: Function;
        parentPermission: Permission;
        permissionRepository: AbstractAuthorizeRepository<T> | PermissionRepository;
        allPermissionDecoratorData: MetadataMap<{
            idx: number;
        }>;
    }): IPermission[];
    updatePermissionByChangeMethodName(permissionSubject: string, allPermissionDecoratorData: MetadataMap<{
        idx: number;
    }>, permissionRepository: PermissionRepository): Promise<void>;
    startMigration<T extends BaseTzEntity>(opts: {
        permissionRepository: AbstractAuthorizeRepository<T> & PermissionRepository;
        controllers: Function[];
    }): Promise<void>;
}
