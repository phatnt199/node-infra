import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import { ServiceMixin } from '@loopback/service-proxy';
import { EnvironmentValidationResult, IApplication } from '@/common/types';
import { applicationLogger } from '@/helpers';

export abstract class BaseApplication
  extends BootMixin(ServiceMixin(RepositoryMixin(RestApplication)))
  implements IApplication
{
  constructor(options: ApplicationConfig = {}) {
    super(options);
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

    // Do configure while modules for application.
    applicationLogger.log('info', '[application] Executing Pre-Configure...');
    this.preConfigure();

    applicationLogger.log('info', '[application] Executing Post-Configure...');
    this.postConfigure();
  }

  abstract validateEnv(): EnvironmentValidationResult;
  abstract preConfigure(): void;
  abstract postConfigure(): void;
}
