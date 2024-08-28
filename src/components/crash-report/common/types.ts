import { AnyObject, IdType } from '@/common';
import { model, property } from '@loopback/repository';

// ----------------------------------------------------------------------------------------------------------------------------------------
@model({
  name: 'CreateEventRequest',
})
export class CreateEventRequest {
  @property({ type: 'string' })
  appVersion?: string;

  @property({ type: 'string' })
  appType?: string;

  @property({ type: 'string' })
  type?: string;

  @property({
    type: 'object',
    jsonSchema: {
      properties: {
        language: { type: 'string' },
        userAgent: { type: 'string' },
        title: { type: 'string' },
        referrer: { type: 'string' },
        url: { type: 'string' },
      },
    },
  })
  device?: {
    language?: string;
    userAgent?: string;
    title?: string;
    referrer?: string;
    url?: string;
  };

  @property({
    type: 'object',
    jsonSchema: {
      properties: {
        platform: { type: 'string' },
        version: { type: 'string' },
      },
    },
  })
  sdk?: {
    platform?: string;
    version?: string;
  };

  @property({
    type: 'array',
    itemType: 'object',
  })
  actions?: Array<AnyObject>;

  @property({
    type: 'object',
    jsonSchema: {
      properties: {
        name: { type: 'string' },
        message: { type: 'string' },
        filename: { type: 'string' },
        lineno: { type: 'string' },
        colno: { type: 'string' },
        stack: { type: 'string' },
        location: { type: 'string' },
      },
    },
  })
  details?: {
    name?: string;
    message?: string;
    filename?: string;
    lineno?: string;
    colno?: string;
    stack?: string;
    location?: string;
  };

  @property({
    type: 'object',
  })
  metadata?: AnyObject;

  @property({
    type: 'object',
  })
  extra?: AnyObject;
}

// ----------------------------------------------------------------------------------------------------------------------------------------
export interface ICrashReportRestOptions {
  restPath?: string;
  endPoint?: string;
  projectId?: IdType;
  apiKey?: string;
  secretKey?: string;
  environment?: string;
  createEventRequest?: any;
  generateBodyFn?: () => void;
}
