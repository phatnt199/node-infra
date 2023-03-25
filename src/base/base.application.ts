import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import { EnvironmentValidationResult, IApplication } from '@/common/types';
import { ApplicationLogger, LoggerFactory } from '@/helpers';

import { BaseApplicationSequence } from './base.sequence';

export abstract class BaseApplication
  extends BootMixin(ServiceMixin(RepositoryMixin(RestApplication)))
  implements IApplication {
  protected logger: ApplicationLogger;
  models: Set<string>;

  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.logger = LoggerFactory.getLogger(['Application']);

    this.sequence(BaseApplicationSequence);

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

  abstract validateEnv(): EnvironmentValidationResult;
  abstract declareModels(): Set<string>;
  abstract preConfigure(): void;
  abstract postConfigure(): void;
}
