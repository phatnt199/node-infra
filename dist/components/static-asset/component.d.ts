import { BaseApplication } from '../../base/base.application';
import { BaseComponent } from '../../base/base.component';
import { Binding } from '@loopback/core';
export declare class StaticAssetComponent extends BaseComponent {
    protected application: BaseApplication;
    bindings: Binding[];
    constructor(application: BaseApplication);
    defineControllers(opts: {
        useMinioAsset: boolean;
        useStaticResource: boolean;
    }): void;
    binding(): void;
}
