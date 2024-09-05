export class CrashReportKeys {
  static readonly MT_REST_OPTIONS = '@app/crash-report/mt/rest-options';
}

export class CrashReportProviderKeys {
  static readonly THIRD_PARTY_PROVIDERS = '@app/crash-report/third-party-providers';
  static readonly PROVIDERS = '@app/crash-report/providers';
  static readonly MT_PROVIDER = '@app/crash-report/mt-provider';
  static readonly TYPE_SET = new Set([this.MT_PROVIDER]);

  static isValid(orgType: string): boolean {
    return this.TYPE_SET.has(orgType);
  }
}
