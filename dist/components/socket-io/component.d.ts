import { BaseApplication } from '../../base/base.application';
import { BaseComponent } from '../../base/base.component';
import { Binding } from '@loopback/core';
export declare class SocketIOComponent extends BaseComponent {
    protected application: BaseApplication;
    bindings: Binding[];
    constructor(application: BaseApplication);
    defineServices(): void;
    binding(): void;
}
