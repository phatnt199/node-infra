import { EnvironmentValidationResult, IApplication } from '@/common/types';
import { ApplicationLogger, LoggerFactory } from '@/helpers';
import { BootMixin } from '@loopback/boot';
import { ApplicationConfig, Constructor } from '@loopback/core';
import { RepositoryMixin, RepositoryTags } from '@loopback/repository';
import { RestApplication, SequenceHandler } from '@loopback/rest';
import { CrudRestComponent } from '@loopback/rest-crud';
import { ServiceMixin } from '@loopback/service-proxy';

import { BaseDataSource, RouteKeys } from '..';
import { BaseApplicationSequence } from './base.sequence';

export abstract class BaseApplication
  extends BootMixin(ServiceMixin(RepositoryMixin(RestApplication)))
  implements IApplication {
  protected logger: ApplicationLogger;
  models: Set<string>;

  constructor(opts: { serverOptions: ApplicationConfig; sequence?: Constructor<SequenceHandler> }) {
    const { serverOptions, sequence } = opts;
    super(serverOptions);
    this.logger = LoggerFactory.getLogger(['Application']);

    this.bind(RouteKeys.ALWAYS_ALLOW_PATHS).to([]);
    this.sequence(sequence ?? BaseApplicationSequence);

    this.staticConfigure();
    this.projectRoot = this.getProjectRoot();
    this.component(CrudRestComponent);

    const applicationEnv = process.env.NODE_ENV ?? 'unknown';
    this.logger.info(' Starting application with ENV "%s"...', applicationEnv);

    // Validate whole application environment args.
    this.logger.info(' Validating application environments...');
    const envValidation = this.validateEnv();
    if (!envValidation.result) {
      throw new Error(envValidation?.message ?? 'Invalid application environment!');
    } else {
      this.logger.info(' All application environments are valid...');
    }

    this.logger.info(' Declare application models...');
    this.models = new Set([]);
    this.models = this.declareModels();

    // Do configure while modules for application.
    this.logger.info(' Executing Pre-Configure...');
    this.preConfigure();

    this.logger.info(' Executing Post-Configure...');
    this.postConfigure();
  }

  abstract staticConfigure(): void;
  abstract getProjectRoot(): string;
  abstract validateEnv(): EnvironmentValidationResult;
  abstract declareModels(): Set<string>;

  abstract preConfigure(): void;
  abstract postConfigure(): void;

  async getMigrateModels(opts: { ignoreModels: string[] }) {
    const { ignoreModels } = opts;

    const repoBindings = this.findByTag(RepositoryTags.REPOSITORY);
    const valids = repoBindings.filter(b => {
      const key = b.key;
      const modelName = key.slice(key.indexOf('.') + 1, key.indexOf('Repository'));
      return !ignoreModels.includes(modelName);
    });

    // Load models
    await Promise.all(valids.map(b => this.get(b.key)));
  }

  async migrateModels(opts: {
    application: BaseApplication;
    existingSchema: string;
    ignoreModels?: string[];
    migrateModels?: string[];
  }) {
    const { existingSchema, ignoreModels = [], migrateModels } = opts;

    await this.getMigrateModels({ ignoreModels });
    const operation = existingSchema === 'drop' ? 'automigrate' : 'autoupdate';

    const dsBindings = this.findByTag(RepositoryTags.DATASOURCE);
    for (const b of dsBindings) {
      const ds = await this.get<BaseDataSource>(b.key);
      if (!ds) {
        continue;
      }

      const isDisableMigration = ds.settings?.disableMigration ?? false;
      if (!(operation in ds) || isDisableMigration) {
        this.logger.info('[migrateSchema] Skip migrating datasource %s', b.key);
        continue;
      }

      this.logger.info('[migrateSchema] Migrating datasource %s', b.key);
      await ds[operation](migrateModels);
    }
  }
}
