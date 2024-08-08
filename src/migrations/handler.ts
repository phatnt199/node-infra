import { BaseApplication } from '@/base';
import { MigrationStatuses } from '@/common';
import { Migration, MigrationProcess, MigrationRepository } from '@/components/migration';
import { applicationLogger as logger } from '@/helpers';

export const cleanUpMigration = async (application: BaseApplication, migrationProcesses: Array<MigrationProcess>) => {
  logger.info('START | Clean up migrate database');

  for (const migrationProcess of migrationProcesses) {
    const { name, cleanFn } = migrationProcess;
    if (!cleanFn) {
      continue;
    }

    try {
      logger.info('[%s] DONE | Clean up migrate process', name);
      await cleanFn(application);
      logger.info('[%s] DONE | Clean up migrate process', name);
    } catch (error) {
      logger.error('[%s] FAILED | Clean up migrate process | Error: %s', name, error);
    }
  }
};

export const _migration = async (application: BaseApplication, migrationProcesses: Array<MigrationProcess>) => {
  logger.info('[migration] START Migrating database');
  const migrationRepository = application.getSync<MigrationRepository>('repositories.MigrationRepository');

  for (const migrationProcess of migrationProcesses) {
    const { name, fn, options } = migrationProcess;
    if (!name || !fn) {
      continue;
    }

    let migrated: Migration | null = null;
    let migrateStatus: string = MigrationStatuses.UNKNOWN;

    try {
      migrated = await migrationRepository.findOne({ where: { name } });

      if (!options?.alwaysRun && migrated && migrated.status === MigrationStatuses.SUCCESS) {
        migrateStatus = migrated.status;
        logger.info('[migration] SKIP | Migrate process: %s | status: %s', name, migrateStatus);
        continue;
      }

      logger.info('[migration] START | Migrate process: %s', name);

      await fn(application);
      migrateStatus = MigrationStatuses.SUCCESS;

      logger.info('[migration] DONE | Migrate process: %s', name);
    } catch (error) {
      migrateStatus = MigrationStatuses.FAIL;
      logger.error('[migration] FAILED | Migrate process: %s | Error: %s', name, error);
    } finally {
      if (migrated) {
        await migrationRepository.updateById(migrated.id as number, { status: migrateStatus });
      } else {
        await migrationRepository.create({ name, status: migrateStatus });
      }
    }
  }

  logger.info('[migration] DONE Migrating database');
};

export const migration = _migration;

export const migrate = async (opts: {
  scope: 'up' | 'down';
  application: BaseApplication;
  processes: Array<MigrationProcess>;
}) => {
  const { scope, application, processes } = opts;
  logger.info('[%s] START | Migrating database', scope.toUpperCase());
  await _migration(application, processes);
  logger.info('[%s] DONE | Migrating database', scope.toUpperCase());
};
