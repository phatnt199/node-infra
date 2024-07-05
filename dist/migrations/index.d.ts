import { MigrationProcess } from '@/common';
import { BaseApplication } from '@/base/base.application';
export declare const migration: (application: BaseApplication, migrationProcesses: Array<MigrationProcess>) => Promise<void>;
