import { TestCase, TestDescribe, TestPlan } from '@/helpers';
import * as TestCases from './test-cases';

TestDescribe.withTestPlan({
  testPlan: TestPlan.newInstance({
    scope: '000_CRYPTO',
    hooks: {},
    testCaseResolver: ({ context }) => {
      return [
        TestCase.withOptions({
          description: 'Check message successfully encrypt and decrypt.1',
          handler: new TestCases.Test001Handler({
            context,
            args: { secretKey: 'abc123qwe', message: 'hello world' },
          }),
        }),
        TestCase.withOptions({
          description: 'Check message successfully encrypt and decrypt.2',
          handler: new TestCases.Test001Handler({
            context,
            args: { secretKey: 'abc123qwe', message: 'hello world' },
            validator: TestCases.test001Validator,
          }),
        }),
      ];
    },
  }),
}).run();
