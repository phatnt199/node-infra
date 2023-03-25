import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import { EnvironmentValidationResult, IApplication } from '@/common/types';
import { applicationLogger } from '@/helpers';
import { CrudRestComponent } from '@loopback/rest-crud';
import { BaseApplicationSequence } from './base.sequence';

import path from 'path';

export abstract class BaseApplication
  extends BootMixin(ServiceMixin(RepositoryMixin(RestApplication)))
  implements IApplication {
  models: Set<string>;

  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(BaseApplicationSequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));
    this.projectRoot = __dirname;
    this.component(CrudRestComponent);

    const applicationEnv = process.env.NODE_ENV ?? 'unknown';
    applicationLogger.log('info', '[application] Starting application with ENV "%s"...', applicationEnv);

    // Validate whole application environment args.
    applicationLogger.log('info', '[application] Validating application environments...');
    const envValidation = this.validateEnv();
    if (!envValidation.result) {
      throw new Error(envValidation?.message ?? 'Invalid application environment!');
    } else {
      applicationLogger.log('info', '[application] All application environments are valid...');
    }

    applicationLogger.log('info', '[application] Declare application models...');
    this.models = new Set([]);
    this.models = this.declareModels();

    // Do configure while modules for application.
    applicationLogger.log('info', '[application] Executing Pre-Configure...');
    this.preConfigure();

    applicationLogger.log('info', '[application] Executing Post-Configure...');
    this.postConfigure();
  }

  abstract validateEnv(): EnvironmentValidationResult;
  abstract declareModels(): Set<string>;
  abstract preConfigure(): void;
  abstract postConfigure(): void;
}
