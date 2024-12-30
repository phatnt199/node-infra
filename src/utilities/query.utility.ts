import { BaseTzEntity } from '@/base';
import { EntityClassType } from '@/common';

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
