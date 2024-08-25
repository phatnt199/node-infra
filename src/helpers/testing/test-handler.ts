import { Promisable } from '@/common';
import { TestCaseDecisions } from './common';
import { ITestCaseHandler, ITestCaseInput, ITestContext, TTestCaseDecision } from './types';

export interface ITestCaseHandlerOptions<R extends object, I extends ITestCaseInput = {}> {
  context: ITestContext<R>;

  args?: I | null;
  argResolver?: (...args: any[]) => I | null;

  validator?: (...args: any[]) => Promisable<TTestCaseDecision>;
}

export abstract class BaseTestCaseHandler<R extends object = {}, I extends ITestCaseInput = {}>
  implements ITestCaseHandler<R, I>
{
  context: ITestContext<R>;
  args: I | null;
  validator?: (...args: any[]) => Promisable<TTestCaseDecision>;

  constructor(opts: ITestCaseHandlerOptions<R, I>) {
    this.context = opts.context;
    this.args = opts.args ?? opts.argResolver?.() ?? null;
    this.validator = opts.validator;
  }

  abstract validate(...args: any[]): Promisable<TTestCaseDecision>;
  abstract execute(): Promisable<void>;
}

export abstract class TestCaseHandler<R extends object = {}, I extends ITestCaseInput = {}> extends BaseTestCaseHandler<
  R,
  I
> {
  constructor(opts: ITestCaseHandlerOptions<R, I>) {
    super(opts);
  }

  validate(...args: any[]) {
    return Promise.resolve(this.validator?.(args) ?? TestCaseDecisions.UNKNOWN);
  }
}
