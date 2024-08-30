import { ValueOrPromise } from '@/common';
import { TestCaseDecisions, TestCaseHandler, TTestCaseDecision } from '@/helpers';
import { decrypt, encrypt, getError } from '@/utilities';

interface IArg {
  secretKey: string;
  message: string;
}

export const test001Validator = (opts: any) => {
  console.log('[test001Validator] RUN HERE');
  const { message, encrypted, decrypted } = opts;

  if (!encrypted) {
    return TestCaseDecisions.FAIL;
  }

  if (message !== decrypted) {
    return TestCaseDecisions.FAIL;
  }

  return TestCaseDecisions.SUCCESS;
};

export class Test001Handler extends TestCaseHandler<{}, IArg> {
  execute() {
    if (!this.args) {
      throw getError({
        message: '[Test001Handler][execute] Invalid input args!',
      });
    }

    const { secretKey, message } = this.args;

    const encrypted = encrypt(message, secretKey);
    console.log('[execute] encrypted message: %s', encrypted);

    const decrypted = decrypt(encrypted, secretKey);
    console.log('[execute] decrypted message: %s', decrypted);

    return { encrypted, decrypted, message };
  }

  getValidator(): ((opts: Awaited<ReturnType<typeof this.execute>>) => ValueOrPromise<TTestCaseDecision>) | null {
    return opts => {
      console.log('[getValidator] RUN HERE');
      const { message, encrypted, decrypted } = opts;

      if (!encrypted) {
        return TestCaseDecisions.FAIL;
      }

      if (message !== decrypted) {
        return TestCaseDecisions.FAIL;
      }

      return TestCaseDecisions.SUCCESS;
    };
  }
}
