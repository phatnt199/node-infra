import { BaseComponent } from '../base/base.component';
import { Binding } from '@loopback/core';
import { BaseApplication } from '../base/base.application';
export declare class AuthorizeComponentKeys {
    static readonly APPLICATION_NAME = "authorize.component.application_name";
    static readonly USER_MODEL = "authorize.component.models.user";
}
export declare class AuthorizeComponent extends BaseComponent {
    protected application: BaseApplication;
    bindings: Binding[];
    constructor(application: BaseApplication);
    test(): void;
}
