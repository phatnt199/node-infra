import { BaseTzEntity } from '@/base';
import { AnyType, EntityClassType } from '@/common';
import { applicationLogger } from '@/helpers';
import { getError } from './error.utility';
import { snakeCase, get, pick } from 'lodash';

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

// --------------------------------------------------------------------------------
export const getValue = (value: AnyType) => {
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
export const buildBatchUpdateQuery = <E>(opts: {
  tableName: string;
  keys: (keyof E)[];
  data: AnyType[];
  setKeys: (keyof E | { sourceKey: keyof E; targetKey: keyof E })[];
  whereKeys: (keyof E | { sourceKey: keyof E; targetKey: keyof E })[];
  whereRaws?: string[];
}): string => {
  const { data, tableName, keys, setKeys, whereKeys, whereRaws = [] } = opts;
  const withAlias = 't';

  if (!data.length || !keys.length || !setKeys.length || !whereKeys.length) {
    applicationLogger.error(
      '[batchUpdate] Missing required fields | Data: %d | Keys: %d | Set Keys: %d | Where Keys: %d',
      data.length,
      keys.length,
      setKeys.length,
      whereKeys.length,
    );
    throw getError({
      message: '[batchUpdate] Missing required fields',
    });
  }

  // ----------------------------------------
  const formattedData = data.map(obj => pick(obj, ...keys));
  const withValues = formattedData.map(obj => {
    const values: string[] = [];
    for (const k of Object.keys(obj).sort()) {
      values.push(getValue(get(obj, k, null)));
    }

    return `(${values.toString()})`;
  });

  const withKeys = keys.map(key => snakeCase(String(key))).sort();

  // ----------------------------------------
  let updateSets: string[] = [];
  for (const key of setKeys) {
    switch (typeof key) {
      case 'string': {
        updateSets.push(`"${snakeCase(key)}" = ${withAlias}."${snakeCase(key)}"`);
        break;
      }
      case 'object': {
        updateSets.push(
          `"${snakeCase(String(key.targetKey))}" = ${withAlias}."${snakeCase(String(key.sourceKey))}"::JSONB`,
        );
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
        updateWheres.push(`"${tableName}"."${snakeCase(key)}" = ${withAlias}."${snakeCase(key)}"`);
        break;
      }
      case 'object': {
        updateWheres.push(
          `${snakeCase(String(key.targetKey))} = ${withAlias}."${snakeCase(String(key.sourceKey))}"`,
        );
        break;
      }
      default: {
        break;
      }
    }
  }

  // ----------------------------------------
  return `WITH ${withAlias} (${withKeys}) AS (VALUES ${withValues})
UPDATE "${tableName}"
SET ${updateSets.join(', ')}
FROM ${withAlias}
WHERE ${updateWheres.join(' AND ')}
${whereRaws.length ? `AND ${whereRaws.join(', AND')}` : ''};`;
};
