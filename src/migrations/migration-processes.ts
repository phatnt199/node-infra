type MigrationProcess = {
  name: string;
  fn: Function;
};

export const migrationProcesses: Array<MigrationProcess> = [];
