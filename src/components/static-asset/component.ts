import { BaseApplication } from '@/base/base.application';
import { BaseComponent } from '@/base/base.component';
import { getError } from '@/utilities';
import { Binding, CoreBindings, inject } from '@loopback/core';
import { MinioKeys } from '@/common';
import { ClientOptions } from 'minio';
import { MinioHelper } from '@/helpers';
import { StaticAssetController } from './static-asset.controller';

export class StaticAssetComponent extends BaseComponent {
  bindings: Binding[] = [Binding.bind(MinioKeys.CONNECTION_OPTIONS).to(null)];

  constructor(@inject(CoreBindings.APPLICATION_INSTANCE) protected application: BaseApplication) {
    super({ scope: StaticAssetComponent.name });
    this.binding();
  }

  defineControllers() {
    this.application.controller(StaticAssetController);
  }

  binding() {
    if (!this.application) {
      throw getError({
        statusCode: 500,
        message: '[binding] Invalid application to bind AuthenticateComponent',
      });
    }

    this.logger.info('[binding] Binding static asset for application...');
    const connectionOptions = this.application.getSync<ClientOptions>(MinioKeys.CONNECTION_OPTIONS);
    const minioHelper = new MinioHelper(connectionOptions);
    this.application.bind(MinioKeys.MINIO_INSTANCE).to(minioHelper);

    this.defineControllers();
  }
}
