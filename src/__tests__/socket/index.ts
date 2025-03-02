import { TestCase, TestDescribe, TestPlan } from '@/helpers';
import * as TestCases from './test-cases';
import { getUID } from '@/utilities';

TestDescribe.withTestPlan({
  testPlan: TestPlan.newInstance({
    scope: '002_SOCKET',
    hooks: {},
    testCaseResolver: ({ context }) => {
      return [
        TestCase.withOptions({
          code: getUID(),
          description: 'Check initialize Network TCP Server/Client',
          expectation:
            'Network TCP Server/Client successfully init and Client be able to connect to Server',
          handler: new TestCases.TestSocket001Handler({
            context,
            args: { host: '0.0.0.0', port: 10011 },
          }),
        }),
      ];
    },
  }),
}).run();
