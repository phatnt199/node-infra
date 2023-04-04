import { IApplicationEnvironment } from '@/common';

export class ApplicationEnvironment implements IApplicationEnvironment {
  private arguments: Record<string, any> = {};

  constructor(props: Record<string, any>) {
    for (const key in props) {
      if (!key.startsWith('APP_ENV_')) {
        continue;
      }

      this.arguments[key] = props[key];
    }
  }

  get<ReturnType>(key: string): ReturnType {
    return this.arguments[key] as ReturnType;
  }

  set<ValueType>(key: string, value: ValueType) {
    this.arguments[key] = value;
  }

  keys() {
    return Object.keys(this.arguments);
  }
}

export const applicationEnvironment = new ApplicationEnvironment(process.env);
