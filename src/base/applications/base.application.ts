import { BindingKeys, EnvironmentKeys } from '@/common';
import { EnvironmentValidationResult, IApplication } from '@/common/types';
import { GrpcTags } from '@/components';
import { AuthenticateKeys } from '@/components/authenticate/common';
import { applicationEnvironment, ApplicationLogger, LoggerFactory } from '@/helpers';
import { RequestBodyParserMiddleware, RequestSpyMiddleware } from '@/middlewares';
import { int } from '@/utilities';
import { BootMixin } from '@loopback/boot';
import {
  ApplicationConfig,
  Binding,
  BindingFromClassOptions,
  BindingScope,
  Constructor,
  ControllerClass,
} from '@loopback/core';
import { Repository, RepositoryMixin, RepositoryTags } from '@loopback/repository';
import { MiddlewareSequence, RestApplication, SequenceHandler } from '@loopback/rest';
import { CrudRestComponent } from '@loopback/rest-crud';
import { ServiceMixin } from '@loopback/service-proxy';

import { BaseDataSource } from '../base.datasource';
import { BaseEntity } from '../base.model';
import { BaseApplicationSequence } from '../base.sequence';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

export abstract class BaseApplication
  extends BootMixin(ServiceMixin(RepositoryMixin(RestApplication)))
  implements IApplication
{
  protected logger: ApplicationLogger;
  models: Set<string>;

  constructor(opts: { serverOptions: ApplicationConfig; sequence?: Constructor<SequenceHandler> }) {
    const { serverOptions, sequence } = opts;
    super(serverOptions);
    this.logger = LoggerFactory.getLogger(['Application']);

    this.bind(AuthenticateKeys.ALWAYS_ALLOW_PATHS).to([]);
    this.bind(BindingKeys.APPLICATION_MIDDLEWARE_OPTIONS).to(MiddlewareSequence.defaultOptions);
    this.sequence(sequence ?? BaseApplicationSequence);

    this.staticConfigure();
    this.projectRoot = this.getProjectRoot();
    this.component(CrudRestComponent);

    const applicationEnv = process.env.NODE_ENV ?? 'unknown';
    this.logger.info('[Application] Starting application with ENV "%s"...', applicationEnv);

    // Validate whole application environment args.
    this.logger.info('[Application] Validating application environments...');
    const envValidation = this.validateEnv();
    if (!envValidation.result) {
      throw new Error(envValidation?.message ?? 'Invalid application environment!');
    } else {
      this.logger.info('[Application] All application environments are valid...');
    }

    this.logger.info('[Application] Declare application models...');
    this.models = new Set([]);
    this.models = this.declareModels();

    // Middlewares
    this.middleware(RequestBodyParserMiddleware);
    this.middleware(RequestSpyMiddleware);

    // Do configure while modules for application.
    this.logger.info('[Application] Executing Pre-Configure...');
    this.preConfigure();

    this.logger.info('[Application] Executing Post-Configure...');
    this.postConfigure();
  }

  abstract staticConfigure(): void;
  abstract getProjectRoot(): string;
  abstract validateEnv(): EnvironmentValidationResult;
  abstract declareModels(): Set<string>;

  abstract preConfigure(): void;
  abstract postConfigure(): void;

  getServerHost() {
    return applicationEnvironment.get<string>(EnvironmentKeys.APP_ENV_SERVER_HOST);
  }

  getServerPort() {
    return int(applicationEnvironment.get<number>(EnvironmentKeys.APP_ENV_SERVER_PORT));
  }

  getServerAddress() {
    return `${this.getServerHost()}:${this.getServerPort()}`;
  }

  getMigrateModels(opts: { ignoreModels?: string[]; migrateModels?: string[] }) {
    const { ignoreModels, migrateModels } = opts;

    const repoBindings = this.findByTag(RepositoryTags.REPOSITORY);
    const valids = repoBindings.filter(b => {
      const key = b.key;
      const modelName = key.slice(key.indexOf('.') + 1, key.indexOf('Repository'));

      if (ignoreModels?.includes(modelName)) {
        return false;
      }

      if (migrateModels && !migrateModels.includes(modelName)) {
        return false;
      }

      return true;
    });

    // Load models
    return Promise.all(valids.map(b => this.get(b.key)));
  }

  classifyModelsByDs(opts: { reps: Array<Repository<BaseEntity>> }) {
    const { reps } = opts;
    const modelByDs: Record<string, Array<string>> = {};

    for (const rep of reps) {
      const dsName = get(rep, 'dataSource.name');
      if (!dsName || isEmpty(dsName)) {
        continue;
      }

      const dsKey = `datasources.${dsName}`;
      if (!modelByDs?.[dsKey]) {
        modelByDs[dsKey] = [];
      }

      const modelName = get(rep, 'entityClass.definition.name', '') as string;
      if (isEmpty(modelName)) {
        continue;
      }

      modelByDs[dsKey].push(modelName);
    }

    return modelByDs;
  }

  async migrateModels(opts: { existingSchema: string; ignoreModels?: string[]; migrateModels?: string[] }) {
    const { existingSchema, ignoreModels = [], migrateModels } = opts;

    this.logger.info('[migrateModels] Loading legacy migratable models...!');
    const reps = (await this.getMigrateModels({
      ignoreModels,
      migrateModels,
    })) as Array<Repository<BaseEntity>>;
    const classified = this.classifyModelsByDs({ reps });

    const operation = existingSchema === 'drop' ? 'automigrate' : 'autoupdate';

    const dsBindings = this.findByTag(RepositoryTags.DATASOURCE);
    for (const b of dsBindings) {
      const t = new Date().getTime();
      this.logger.info('[migrateModels] START | Migrating datasource %s', b.key);

      const ds = await this.get<BaseDataSource>(b.key);
      if (!ds) {
        this.logger.error('[migrateModels] Invalid datasource with key %s', b.key);
        continue;
      }

      const isDisableMigration = ds.settings?.disableMigration ?? false;
      if (!(operation in ds) || isDisableMigration) {
        this.logger.info('[migrateModels] Skip migrating datasource %s', b.key);
        continue;
      }

      await ds[operation](classified?.[b.key]);
      this.logger.info(
        '[migrateModels] DONE | Migrating datasource %s | Took: %d(ms)',
        b.key,
        new Date().getTime() - t,
      );
    }
  }

  grpcController<T>(ctor: ControllerClass<T>, nameOrOptions?: string | BindingFromClassOptions): Binding<T> {
    return this.controller(ctor, nameOrOptions).tag(GrpcTags.CONTROLLERS).inScope(BindingScope.SINGLETON);
  }
}
