import { BaseComponent } from '../base/base.component';
import { Binding } from '@loopback/core';
import { BaseApplication } from '../base/base.application';
export declare class AuthorizeComponentKeys {
    static readonly APPLICATION_NAME = "@app/authorize/component/application_name";
    static readonly USER_MODEL = "@app/authorize/component/models/user";
    static readonly AUTHORIZER: {
        PROVIDER: string;
        EFORCER: string;
        ADAPTER_DATASOURCE: string;
        CONFIGURE_PATH: string;
    };
}
export declare class AuthorizeComponent extends BaseComponent {
    protected application: BaseApplication;
    bindings: Binding[];
    constructor(application: BaseApplication);
    defineModels(): void;
    binding(): void;
}
