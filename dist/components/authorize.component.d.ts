import { BaseComponent } from '../base/base.component';
import { Binding } from '@loopback/core';
import { BaseApplication } from '../base/base.application';
export declare class AuthorizeComponentKeys {
    static readonly APPLICATION_NAME = "@app/authorize/component/application_name";
    static readonly USER_MODEL = "@app/authorize/component/models/user";
}
export declare class AuthorizerKeys {
    static readonly PROVIDER = "@app/authorize/provider";
    static readonly ENFORCER = "@app/authorize/enforcer";
    static readonly ADAPTER_DATASOURCE = "@app/authorize/enforcer/adapter/datasource";
    static readonly CONFIGURE_PATH = "@app/authorize/configure_path";
}
export declare class AuthorizeComponent extends BaseComponent {
    protected application: BaseApplication;
    bindings: Binding[];
    constructor(application: BaseApplication);
    defineModels(): void;
    binding(): void;
}
