import { IApplicationEnvironment } from '@/common';
export declare class ApplicationEnvironment implements IApplicationEnvironment {
    private arguments;
    constructor(props: Record<string, any>);
    get<ReturnType>(key: string): ReturnType;
    set<ValueType>(key: string, value: ValueType): void;
    keys(): string[];
}
export declare const applicationEnvironment: ApplicationEnvironment;
