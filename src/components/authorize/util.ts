import { EnforcerDefinitions } from '@/common';
import { applicationLogger } from '@/helpers';
import { MetadataMap } from '@loopback/core';
import { getDecoratorData, MetadataDecoratorKeys } from './decorator';
import { Permission } from '@/models';
import { PermissionRepository } from '@/repositories';
import union from 'lodash/union';

//---------------------------------------------------------------------------
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
 *     await generatePermissionService.startMigration({ permissionRepository, controllers });
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

export class GeneratePermissionService {
  getMethodsClass(controllerPrototype: object) {
    return Reflect.ownKeys(controllerPrototype).slice(1) as string[];
  }

  generatePermissions(opts: {
    methods: string[];
    permissionSubject: string;
    parentId: number;
    allPermissionDecoratorData: MetadataMap<unknown> | object | any;
  }) {
    const { methods, permissionSubject, parentId, allPermissionDecoratorData } = opts ?? {};

    return methods.map(m => {
      return {
        name: `Permission ${m} ${permissionSubject}`,
        code: `${permissionSubject}.${m}`,
        subject: permissionSubject,
        action: EnforcerDefinitions.ACTION_EXECUTE,
        scope: m.match(/get|find|search/gim) ? EnforcerDefinitions.ACTION_READ : EnforcerDefinitions.ACTION_WRITE,
        pType: 'p',
        parentId,
        details: allPermissionDecoratorData?.[m] as Record<string, unknown>,
      };
    }) as IPermission[];
  }

  generatePermissionBaseInherit = (opts: {
    methodsParentsMethods: string[];
    methodsChildClass: string[];
    parentPermission: Permission;
    allPermissionDecoratorData: MetadataMap<unknown> | object;
  }) => {
    const { methodsChildClass, methodsParentsMethods, parentPermission, allPermissionDecoratorData } = opts ?? {};

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
      methods: union(defaultPermissions, methodsChildClass),
      permissionSubject: parentPermission.subject,
      parentId: parentPermission.id,
      allPermissionDecoratorData,
    });
  };

  generatePermissionRecords(opts: {
    controller: Function;
    parentPermission: Permission;
    permissionRepository: PermissionRepository;
    allPermissionDecoratorData: MetadataMap<unknown> | object;
  }) {
    const { controller, parentPermission, allPermissionDecoratorData } = opts;
    const permissionRecords: IPermission[] = [];
    const controllerPrototype = controller.prototype;
    const methodsChildClass = this.getMethodsClass(controllerPrototype);

    const parentClass = Reflect.getPrototypeOf(controllerPrototype) as object;
    const methodsParentsMethods = this.getMethodsClass(parentClass);

    permissionRecords.push(
      ...this.generatePermissionBaseInherit({
        methodsParentsMethods,
        methodsChildClass,
        parentPermission,
        allPermissionDecoratorData,
      }),
    );

    return permissionRecords;
  }

  async updatePermissionByChangeMethodName(
    permissionSubject: string,
    allPermissionDecoratorData: Record<string, { idx: string }>,
    permissionRepository: PermissionRepository,
  ) {
    if (!Object.values(allPermissionDecoratorData).length) {
      return;
    }

    const allPermissionDecorators = Object.entries(allPermissionDecoratorData);

    for (const [key, value] of allPermissionDecorators) {
      const permissionsFound: Permission[] = await permissionRepository.find({
        where: {
          subject: permissionSubject,
          code: {
            neq: `${permissionSubject}.*`,
          },
        },
      });

      for (const p of permissionsFound) {
        if (!p?.details?.idx || p?.details?.idx !== value.idx) {
          continue;
        }

        await permissionRepository.updateById(p.id, {
          ...p,
          code: `${permissionSubject}.${key}`,
          details: { ...value },
        });
      }
    }
  }

  async startMigration(opts: { permissionRepository: any; controllers: object }) {
    const { permissionRepository, controllers } = opts;
    const permissions: IPermission[] = [];

    for (const controller of Object.values(controllers)) {
      const controllerClass = controller as Function;
      const permissionSubject = controllerClass.name.replace(/Controller/g, '');
      const controllerPrototype = controllerClass.prototype;
      const permissionSubjectLowerCase = permissionSubject?.toLowerCase();

      applicationLogger.info('[Migrate Permissions] Migration permissions for: %s', permissionSubject);
      const parentPermission = await permissionRepository.findOne({
        where: { subject: permissionSubjectLowerCase },
      });

      if (!parentPermission) {
        continue;
      }

      const allPermissionDecoratorData: Record<string, { idx: string }> =
        getDecoratorData(controllerPrototype, MetadataDecoratorKeys.PERMISSION) ?? {};

      const permissionList = this.generatePermissionRecords({
        controller: controllerClass,
        parentPermission,
        permissionRepository,
        allPermissionDecoratorData,
      });

      await this.updatePermissionByChangeMethodName(
        permissionSubjectLowerCase,
        allPermissionDecoratorData,
        permissionRepository,
      );

      permissions.push(...permissionList);
    }

    for (const p of permissions) {
      await permissionRepository.upsertWith(p, { code: p.code });
    }
  }
}
