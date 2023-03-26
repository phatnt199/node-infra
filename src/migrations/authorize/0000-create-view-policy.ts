import { BaseDataSource } from '@/base/base.datasource';
import { applicationLogger, EnforcerDefinitions } from '@/helpers';

const sqls = [
  `CREATE OR REPLACE VIEW "ViewAuthorizePolicy"
  AS (
  SELECT 
      uuid_generate_v4() as id,
      (p.subject_type || '_' || p.subject_id) as subject,
      p.subject_type,
      p.subject_id, 
      json_agg(p.policy)::JSONB as policies
  FROM (
      SELECT 
          pm.id as id,
          (CASE 
              WHEN user_id IS NOT NULL THEN 'user'
              WHEN role_id IS NOT NULL THEN 'role'
              ELSE NULL
          END) AS subject_type,
          (CASE 
              WHEN user_id IS NOT NULL THEN user_id
              WHEN role_id IS NOT NULL THEN role_id
              ELSE NULL
          END) AS subject_id,
          p.id AS permision_id,
          p.code AS permision_code,
          (CASE
              WHEN user_id IS NOT NULL THEN
                  'p,user_' || user_id || ',' || LOWER(p.code) || ',${EnforcerDefinitions.ACTION_EXECUTE}, ' || effect
              WHEN role_id IS NOT NULL THEN
                  'p,role_' || role_id || ',' || LOWER(p.code) || ',${EnforcerDefinitions.ACTION_EXECUTE}, ' || effect
              ELSE NULL
          END) AS policy
      FROM "PermissionMapping" AS pm INNER JOIN "Permission" AS p ON pm.permission_id = p.id
  ) AS p GROUP BY p.subject_type, p.subject_id, subject);`,
];

export const createViewPolicy = {
  name: __filename.slice(__dirname.length + 1),
  fn: async (_: any, datasource: BaseDataSource) => {
    for (const sql of sqls) {
      applicationLogger.info('[creatViewPolicy] START | Execute SQL: %s', sql);
      await datasource.execute(sql);
      applicationLogger.info('[createViewPolicy] DONE | Execute SQL: %s', sql);
    }
  },
};
