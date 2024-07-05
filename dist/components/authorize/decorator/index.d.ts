export declare class MetadataDecoratorKeys {
    static readonly PERMISSION = "metadata-key-for-permission-decorator";
}
export interface IPermissionDecorator {
    idx: number;
}
export declare function permission(spec: IPermissionDecorator): MethodDecorator;
export declare const getDecoratorData: (controllerPrototype: object, keyTargetDecorator: string) => any;
