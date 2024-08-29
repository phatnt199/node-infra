import { Promisable } from '@/common';
import { getError } from '@/utilities';
import assert from 'assert';
import { TestCaseDecisions } from './common';
import { ITestCaseHandler, ITestCaseInput, ITestContext, TTestCaseDecision } from './types';

export interface ITestCaseHandlerOptions<R extends object, I extends ITestCaseInput = {}> {
  context: ITestContext<R>;

  args?: I | null;
  argResolver?: (...args: any[]) => I | null;

  validator?: (opts: any) => Promisable<TTestCaseDecision>;
}

export abstract class BaseTestCaseHandler<R extends object = {}, I extends ITestCaseInput = {}>
  implements ITestCaseHandler<R, I>
{
  context: ITestContext<R>;
  args: I | null;

  validator?: (opts: any) => Promisable<TTestCaseDecision>;

  constructor(opts: ITestCaseHandlerOptions<R, I>) {
    this.context = opts.context;
    this.args = opts.args ?? opts.argResolver?.() ?? null;
    this.validator = opts?.validator;
  }

  getArguments() {
    return this.args;
  }

  abstract execute(): Promisable<any>;

  abstract getValidator(): ((opts: Awaited<ReturnType<typeof this.execute>>) => Promisable<TTestCaseDecision>) | null;
  abstract validate(opts: any): Promisable<TTestCaseDecision>;
}

export abstract class TestCaseHandler<R extends object = {}, I extends ITestCaseInput = {}> extends BaseTestCaseHandler<
  R,
  I
> {
  constructor(opts: ITestCaseHandlerOptions<R, I>) {
    super(opts);
  }

  async _execute() {
    const executeRs = await this.execute();
    const validateRs = await this.validate(executeRs);
    assert.equal(validateRs, TestCaseDecisions.SUCCESS);
  }

  validate(opts: any): Promisable<TTestCaseDecision> {
    const validator = this.validator ?? this.getValidator();

    if (!validator) {
      throw getError({
        message: '[validate] Invalid test case validator!',
      });
    }

    return validator(opts) ?? TestCaseDecisions.UNKNOWN;
  }
}
