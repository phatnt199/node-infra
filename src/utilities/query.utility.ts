import { BaseTzEntity } from '@/base';
import { AnyType, EntityClassType } from '@/common';
import { applicationLogger } from '@/helpers';
import { getError } from './error.utility';
import { snakeCase, get } from 'lodash';

export const getTableDefinition = <T extends BaseTzEntity>(opts: {
  model: EntityClassType<T>;
  alias?: string;
}) => {
  const { model, alias } = opts;

  const tableAlias = alias ?? model.name.toLowerCase();

  const tableNameWithAlias = `"${model.name}" ${tableAlias}`;

  const tableColumns = Object.entries(model.definition.properties)
    .map(([key, value]) => {
      const columnName = value?.name ?? value?.postgresql?.columnName ?? key;
      return {
        [`${key}`]: `${tableAlias}.${columnName}`,
      };
    })
    .reduce((acc, cur) => {
      return { ...acc, ...cur };
    }, {});

  const tableColumnsNoAlias = Object.entries(model.definition.properties)
    .map(([key, value]) => {
      const columnName = value?.name ?? value?.postgresql?.columnName ?? key;
      return {
        [`${key}`]: `${columnName}`,
      };
    })
    .reduce((acc, cur) => {
      return { ...acc, ...cur };
    }, {});

  return {
    table: { name: model.name, alias: tableAlias, nameWithQuotation: `"${model.name}"` },
    tableWithAlias: tableNameWithAlias,
    columns: tableColumns,
    columnsNoAlias: tableColumnsNoAlias,
  } as {
    table: { name: string; alias: string; nameWithQuotation: string };
    tableWithAlias: string;
    columns: { [key in keyof T]: string };
    columnsNoAlias: { [key in keyof T]: string };
  };
};

export const getValue = <T>(value: T) => {
  switch (typeof value) {
    case null: {
      return 'null';
    }
    case 'number': {
      return value?.toString();
    }
    case 'boolean': {
      return value;
    }
    case 'string': {
      if (value?.toString().trim() === '') {
        return "''";
      }
      return `'${value?.toString().replace(/'/g, "''")}'`;
    }
    default: {
      return `'${value}'`;
    }
  }
};

// --------------------------------------------------------------------------------
export const bulkUpdateKnex = (opts: {
  tableName: string;
  data: AnyType[];
  setKeys: (string | { resourceKey: string; targetKey: string })[];
  whereKeys: (string | { resourceKey: string; targetKey: string })[];
  whereRaws?: string[];
}) => {
  const { data, tableName, setKeys, whereKeys, whereRaws = [] } = opts;
  const withAlias = 't';

  if (!data.length) {
    applicationLogger.error('[bulkUpdateKnex] No data to update');
    throw getError({
      message: '[bulkUpdateKnex] No data to update',
    });
  }

  // ----------------------------------------
  const keys = Object.keys(data[0]).map(key => snakeCase(key));
  const values = data.map(obj => {
    const values: string[] = [];
    for (const k in obj) {
      values.push(getValue(get(obj, k, null)));
    }
    return `(${values})`;
  });

  // ----------------------------------------
  let updateSets: string[] = [];
  for (const key of setKeys) {
    switch (typeof key) {
      case 'string': {
        updateSets.push(`"${key}" = ${withAlias}."${key}"`);
        break;
      }
      case 'object': {
        updateSets.push(`"${key.targetKey}" = ${withAlias}."${key.resourceKey}"::JSONB`);
        break;
      }
      default: {
        break;
      }
    }
  }

  // ----------------------------------------
  let updateWheres: string[] = [];
  for (const key of whereKeys) {
    switch (typeof key) {
      case 'string': {
        updateWheres.push(`"${tableName}"."${key}" = ${withAlias}."${key}"`);
        break;
      }
      case 'object': {
        updateWheres.push(`${key.targetKey} = ${withAlias}."${key.resourceKey}"`);
        break;
      }
      default: {
        break;
      }
    }
  }

  const query = `WITH ${withAlias} (${keys}) AS (VALUES ${values})
UPDATE "${tableName}"
SET ${updateSets.join(', ')}
FROM ${withAlias}
WHERE ${updateWheres.join(', AND')} ${whereRaws.length ? `AND ${whereRaws.join(', AND')}` : ''};`;

  return query;
};
