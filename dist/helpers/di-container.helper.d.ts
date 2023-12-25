export declare class DIContainerHelper {
    private container;
    constructor();
    get<ReturnType>(key: string): ReturnType;
    set<ValueType>(key: string, value: ValueType): void;
    keys(): string[];
}
