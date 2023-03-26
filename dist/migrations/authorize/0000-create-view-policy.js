"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createViewPolicy = void 0;
const helpers_1 = require("../../helpers");
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
                  'p,user_' || user_id || ',' || LOWER(p.code) || ',${helpers_1.EnforcerDefinitions.ACTION_EXECUTE}, ' || effect
              WHEN role_id IS NOT NULL THEN
                  'p,role_' || role_id || ',' || LOWER(p.code) || ',${helpers_1.EnforcerDefinitions.ACTION_EXECUTE}, ' || effect
              ELSE NULL
          END) AS policy
      FROM "PermissionMapping" AS pm INNER JOIN "Permission" AS p ON pm.permission_id = p.id
  ) AS p GROUP BY p.subject_type, p.subject_id, subject);`,
];
exports.createViewPolicy = {
    name: __filename.slice(__dirname.length + 1),
    fn: (_, datasource) => __awaiter(void 0, void 0, void 0, function* () {
        for (const sql of sqls) {
            helpers_1.applicationLogger.info('[creatViewPolicy] START | Execute SQL: %s', sql);
            yield datasource.execute(sql);
            helpers_1.applicationLogger.info('[createViewPolicy] DONE | Execute SQL: %s', sql);
        }
    }),
};
//# sourceMappingURL=0000-create-view-policy.js.map