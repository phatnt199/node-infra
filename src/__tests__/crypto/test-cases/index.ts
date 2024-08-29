import { Promisable } from '@/common';
import { TestCaseDecisions, TestCaseHandler, TTestCaseDecision } from '@/helpers';
import { decrypt, encrypt, getError } from '@/utilities';

export class Test001Handler extends TestCaseHandler<any, { secret: string; message: string }> {
  execute() {
    if (!this.args) {
      throw getError({ message: '[Test001Handler][execute] Invalid args!' });
    }

    const { message, secret } = this.args;
    const encrypted = encrypt(message, secret);
    const decrypted = decrypt(encrypted, secret);

    return { message, encrypted, decrypted };
  }

  getValidator(): (opts: Awaited<ReturnType<typeof this.execute>>) => Promisable<TTestCaseDecision> {
    return opts => {
      if (!opts.encrypted) {
        return TestCaseDecisions.FAIL;
      }

      if (opts.decrypted !== opts.message) {
        return TestCaseDecisions.FAIL;
      }

      return TestCaseDecisions.SUCCESS;
    };
  }
}
