import { TestCase, TestDescribe, TestPlan } from '@/helpers';
import * as TestCases from './test-cases';

TestDescribe.withTestPlan({
  testPlan: TestPlan.newInstance({
    scope: '000_CRYPTO',
    hooks: {},
    testCaseResolver: ({ context }) => {
      return [
        TestCase.withOptions({
          description: 'Check AES message successfully encrypt and decrypt',
          handler: new TestCases.TestAES001Handler({
            context,
            args: { secretKey: 'abc123qwe', message: 'hello world' },
          }),
        }),
        TestCase.withOptions({
          description: 'Check RSA message successfully encrypt and decrypt',
          handler: new TestCases.TestRSA001Handler({
            context,
            args: {
              message: 'hello world | minimal technology',
            },
          }),
        }),
      ];
    },
  }),
}).run();
