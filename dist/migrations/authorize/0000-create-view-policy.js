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
const constants_1 = require("../../common/constants");
const sqls = [
    `
  CREATE OR REPLACE VIEW "ViewAuthorizePolicy"
  AS (
  SELECT 
      uuid_generate_v4() as id,
      (t.subject_type || '_' || t.subject_id) as subject,
      t.subject_type,
      t.subject_id, 
      json_agg(t.policy)::JSONB as policies
  FROM (
      SELECT 
          pm.id as id,
          (CASE 
              WHEN user_id IS NOT NULL THEN '${constants_1.EnforcerDefinitions.PREFIX_USER}'
              WHEN role_id IS NOT NULL THEN '${constants_1.EnforcerDefinitions.PREFIX_ROLE}'
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
                  'p,${constants_1.EnforcerDefinitions.PREFIX_USER}_' || user_id || ',' || LOWER(p.code) || ',${constants_1.EnforcerDefinitions.ACTION_EXECUTE},' || effect
              WHEN role_id IS NOT NULL THEN
                  'p,${constants_1.EnforcerDefinitions.PREFIX_ROLE}_' || role_id || ',' || LOWER(p.code) || ',${constants_1.EnforcerDefinitions.ACTION_EXECUTE},' || effect
              ELSE NULL
          END) AS policy
      FROM "PermissionMapping" AS pm INNER JOIN "Permission" AS p ON pm.permission_id = p.id
  ) AS t GROUP BY t.subject_type, t.subject_id, subject);`,
];
exports.createViewPolicy = {
    name: __filename.slice(__dirname.length + 1),
    fn: (_, datasource) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(constants_1.EnforcerDefinitions.PREFIX_ROLE, constants_1.EnforcerDefinitions.PREFIX_USER, constants_1.EnforcerDefinitions.ACTION_EXECUTE);
        for (const sql of sqls) {
            helpers_1.applicationLogger.info('[creatViewPolicy] START | Execute SQL: %s', sql);
            yield datasource.execute(sql);
            helpers_1.applicationLogger.info('[createViewPolicy] DONE | Execute SQL: %s', sql);
        }
    }),
};
//# sourceMappingURL=0000-create-view-policy.js.map