import { migration } from '@/migrations';
import { applicationLogger } from './helpers';

const models = [];

export async function migrate(args: string[]) {
  const existingSchema = args.includes('--rebuild') ? 'drop' : 'alter';
  applicationLogger.info('Migrating schemas (%s existing schema)', existingSchema);

  const app = new DMAApplication();
  await app.boot();
  await app.migrateSchema({ existingSchema, models });

  //Migration by file
  await migration(app);
  process.exit(0);
}

migrate(process.argv).catch(error => {
  applicationLogger.error('[Migrate] Cannot migrate database schema | Error: %s', error);
  process.exit(1);
});
