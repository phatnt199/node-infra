import { MigrationProcess, MigrationStatuses } from '@/common';
import { MigrationRepository } from '@/repositories';
import { applicationLogger as logger } from '@/helpers';
import { BaseApplication } from '@/base/base.application';
import { Migration } from '@/models';

export const migration = async (application: BaseApplication, migrationProcesses: Array<MigrationProcess>) => {
  logger.info('START | Migrate database');
  const migrationRepository = application.getSync<MigrationRepository>('repositories.MigrationRepository');

  for (const mirgation of migrationProcesses) {
    const { name, fn, options } = mirgation;
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
