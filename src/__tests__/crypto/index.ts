import { TestCase, TestDescribe, TestPlan } from '@/helpers';
import * as TestCases from './test-cases';

TestDescribe.withTestPlan({
  testPlan: TestPlan.newInstance<any>({
    scope: '000_Crypto_Utilities',
    hooks: {},
    testCaseResolver: ({ context }) => {
      return [
        TestCase.withOptions({
          description: 'Check successfully encrypt and decrypt',
          handler: new TestCases.Test001Handler({
            context,
            args: { secret: 'secret.key', message: 'Minimal Technology' },
          }),
        }),
      ];
    },
  }),
}).run();
