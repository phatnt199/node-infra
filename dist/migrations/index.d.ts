import { BaseApplication } from '../base/base.application';
import { MigrationProcess } from '../components/migration';
export declare const migration: (application: BaseApplication, migrationProcesses: Array<MigrationProcess>) => Promise<void>;
