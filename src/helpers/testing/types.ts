import { AnyObject, AnyType, Promisable } from '@/common';
import { DIContainerHelper } from '../di-container.helper';

export interface ITestContext<R extends object> {
  scope: string;

  getRegistry: () => DIContainerHelper<R>;

  bind: <T>(opts: { key: string; value: T }) => void;
  getSync: <E = AnyType>(opts: { key: keyof R }) => E;
}

export type TTestCaseDecision = '000_UNKNOWN' | '000_FAIL' | '200_SUCCESS';

export interface ITestCaseInput {}

export interface ITestCaseHandler<R extends object = {}, I extends object = {}> {
  context: ITestContext<R>;
  args: I | null;
  validator?: (...args: any[]) => Promisable<TTestCaseDecision>;
}

export interface ITestCase<R extends object = {}, I extends object = {}> {
  name?: string;
  description: string;
  handler: ITestCaseHandler<R, I>;

  run: () => Promisable<void>;
}

export type TTestHook<R extends object> = (testPlan: ITestPlan<R>) => Promisable<void>;

export interface ITestHooks<R extends object> {
  before?: TTestHook<R>;
  beforeEach?: TTestHook<R>;
  after?: TTestHook<R>;
  afterEach?: TTestHook<R>;
}

export interface ITestPlanOptions<R extends object> {
  scope: string;
  hooks?: ITestHooks<R>;
  testCases?: Array<ITestCase<R>>;
  testCaseResolver?: (opts: { context: ITestContext<R> }) => Array<ITestCase<R>>;
}

export interface ITestPlan<R extends object = AnyObject> extends ITestContext<R> {
  getTestCases: () => Array<ITestCase<R>>;
  getContext: () => ITestContext<R>;

  getHooks: () => ITestHooks<R>;
  getHook: (opts: { key: keyof ITestHooks<R> }) => TTestHook<R> | null;

  execute: () => Promisable<void>;
}
