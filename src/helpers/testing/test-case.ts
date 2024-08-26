import { AnyObject } from '@loopback/repository';
import { TestCaseHandler } from './test-handler';
import { ITestCase } from './types';

export interface ITestCaseOptions<R extends object = {}, I extends object = {}> {
  name?: string;
  description: string;

  handler: TestCaseHandler<R, I>;
}

export class TestCase<R extends object = {}, I extends object = {}> implements ITestCase<R, I> {
  name?: string;
  description: string;
  handler: TestCaseHandler<R, I>;

  constructor(opts: ITestCaseOptions<R, I>) {
    this.name = opts.name;
    this.description = opts.description;
    this.handler = opts.handler;
  }

  static withOptions<R extends object = AnyObject, I extends object = {}>(opts: {
    name?: string;
    description: string;
    handler: TestCaseHandler<R, I>;
  }) {
    return new TestCase(opts);
  }

  run() {
    return Promise.resolve(this.handler.execute());
  }
}
