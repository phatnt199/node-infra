import { Binding } from '@loopback/core';
import { BaseApplication } from '../../base/base.application';
import { BaseComponent } from '../../base/base.component';
export declare class AuthenticateComponent extends BaseComponent {
    protected application: BaseApplication;
    bindings: Binding[];
    constructor(application: BaseApplication);
    defineMiddlewares(): void;
    defineServices(): void;
    defineControllers(): void;
    defineOAuth2(): void;
    registerComponent(): void;
    binding(): void;
}
