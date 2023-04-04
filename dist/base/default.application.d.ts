import { EnvironmentValidationResult } from '../common';
import { ApplicationConfig } from '@loopback/core';
import { BaseApplication } from './base.application';
export declare abstract class DefaultRestApplication extends BaseApplication {
    protected applicationRoles: string[];
    constructor(opts: ApplicationConfig);
    getApplicationRoles(): string[];
    validateEnv(): EnvironmentValidationResult;
    declareModels(): Set<string>;
    configureMigration(): void;
    preConfigure(): void;
    abstract staticConfigure(): void;
    abstract getProjectRoot(): string;
    abstract postConfigure(): void;
}
