export class DIContainerHelper {
  private container: Record<string, any> = {};

  constructor() {
    this.container = {};
  }

  get<ReturnType>(key: string): ReturnType {
    return this.container[key] as ReturnType;
  }

  set<ValueType>(key: string, value: ValueType) {
    this.container[key] = value;
  }

  keys() {
    return Object.keys(this.container);
  }
}
