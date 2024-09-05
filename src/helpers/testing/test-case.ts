import { AnyObject } from '@loopback/repository';
import { TestCaseHandler } from './test-handler';
import { ITestCase } from './types';

export interface ITestCaseOptions<R extends object = {}, I extends object = {}> {
  code: string;
  name?: string;
  description: string;
  expectation?: string;

  handler: TestCaseHandler<R, I>;
}

export class TestCase<R extends object = {}, I extends object = {}> implements ITestCase<R, I> {
  code: string;
  name?: string;
  description: string;
  expectation?: string;

  handler: TestCaseHandler<R, I>;

  constructor(opts: ITestCaseOptions<R, I>) {
    this.code = opts.code;

    this.name = opts.name;
    this.description = opts.description;
    this.expectation = opts.expectation ?? opts.description;

    this.handler = opts.handler;
  }

  static withOptions<R extends object = AnyObject, I extends object = {}>(opts: ITestCaseOptions<R, I>) {
    return new TestCase(opts);
  }

  run() {
    return Promise.resolve(this.handler._execute());
  }
}
