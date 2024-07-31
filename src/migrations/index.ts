import { BaseApplication } from '@/base/base.application';
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

  logger.info('DONE | Clean up migrate database');
};

export const migration = async (application: BaseApplication, migrationProcesses: Array<MigrationProcess>) => {
  logger.info('START | Migrate database');
  const migrationRepository = application.getSync<MigrationRepository>('repositories.MigrationRepository');

  for (const migrationProcess of migrationProcesses) {
    const { name, fn, options } = migrationProcess;
    if (!name || !fn) {
      continue;
    }

    let migrated: Migration | null = null;
    let migrateStatus: string = MigrationStatuses.UNKNOWN;

    try {
      migrated = await migrationRepository.findOne({
        where: { name },
      });

      if (!options?.alwaysRun && migrated && migrated.status === MigrationStatuses.SUCCESS) {
        migrateStatus = migrated.status;
        logger.info('[%s] SKIP | Migrate process', name);
        continue;
      }

      logger.info('[%s] START | Migrate process', name);

      await fn(application);
      migrateStatus = MigrationStatuses.SUCCESS;

      logger.info('[%s] DONE | Migrate process', name);
    } catch (error) {
      migrateStatus = MigrationStatuses.FAIL;
      logger.error('[%s] FAILED | Migrate process | Error: %s', name, error);
    } finally {
      if (migrated) {
        await migrationRepository.updateById(migrated.id as number, { status: migrateStatus });
      } else {
        await migrationRepository.create({ name, status: migrateStatus });
      }
    }
  }

  logger.info('DONE | Migrate database');
};
