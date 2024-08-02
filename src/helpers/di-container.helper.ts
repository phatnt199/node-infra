export class DIContainerHelper {
  private static instance: DIContainerHelper;
  private container: Record<string, any> = {};

  private constructor() {
    this.container = {};
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DIContainerHelper();
    }

    return this.instance;
  }

  get<ReturnType>(key: string) {
    return this.container[key] as ReturnType;
  }

  set<ValueType>(key: string, value: ValueType) {
    this.container[key] = value;
  }

  keys() {
    return Object.keys(this.container);
  }
}
