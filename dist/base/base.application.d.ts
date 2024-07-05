import { ApplicationConfig, Constructor } from '@loopback/core';
import { Repository } from '@loopback/repository';
import { SequenceHandler } from '@loopback/rest';
import { EnvironmentValidationResult, IApplication } from '@/common/types';
import { ApplicationLogger } from '@/helpers';
import { BaseEntity } from '..';
declare const BaseApplication_base: any;
export declare abstract class BaseApplication extends BaseApplication_base implements IApplication {
    protected logger: ApplicationLogger;
    models: Set<string>;
    constructor(opts: {
        serverOptions: ApplicationConfig;
        sequence?: Constructor<SequenceHandler>;
    });
    abstract staticConfigure(): void;
    abstract getProjectRoot(): string;
    abstract validateEnv(): EnvironmentValidationResult;
    abstract declareModels(): Set<string>;
    abstract preConfigure(): void;
    abstract postConfigure(): void;
    getMigrateModels(opts: {
        ignoreModels?: string[];
        migrateModels?: string[];
    }): Promise<any[]>;
    classifyModelsByDs(opts: {
        reps: Array<Repository<BaseEntity>>;
    }): Record<string, string[]>;
    migrateModels(opts: {
        existingSchema: string;
        ignoreModels?: string[];
        migrateModels?: string[];
    }): Promise<void>;
}
export {};
