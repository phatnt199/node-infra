import { AnyObject, IdType } from '@/common';

// ----------------------------------------------------------------------------------------------------------------------------------------
export interface ICreateEventRequest {
  appVersion?: string;
  appType?: string;
  type?: string;
  device?: {
    language?: string;
    userAgent?: string;
    title?: string;
    referrer?: string;
    url?: string;
  };
  sdk?: {
    platform?: string;
    version?: string;
  };
  actions?: Array<AnyObject>;
  details?: {
    name?: string;
    message?: string;
    filename?: string;
    lineno?: string;
    colno?: string;
    stack?: string;
    location?: string;
  };
  metadata?: AnyObject;
  extra?: AnyObject;
}

// ----------------------------------------------------------------------------------------------------------------------------------------
export interface ICrashReportRestOptions {
  endPoint?: string;
  projectId?: IdType;
  apiKey?: string;
  secretKey?: string;
  environment?: string;
  createEventRequest?: ICreateEventRequest | AnyObject;
  generateBodyFn?: () => AnyObject;
}
