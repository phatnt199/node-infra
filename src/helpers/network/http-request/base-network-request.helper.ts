import { BaseHelper } from '@/base/base.helper';
import { AnyObject } from '@/common/types';
import { getError } from '@/utilities';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { AxiosFetcher } from './fetcher/axios-fetcher';
import { NodeFetcher } from './fetcher/node-fetcher';
import { AbstractNetworkFetchableHelper, IRequestOptions } from './fetcher';

export class BaseNetworkRequest extends BaseHelper {
  protected baseUrl: string;
  protected fetcher: AbstractNetworkFetchableHelper<IRequestOptions, any>;

  constructor(opts: {
    name: string;
    scope: string;
    variant?: 'node-fetch' | 'axios';
    networkOptions: {
      baseUrl?: string;
      headers?: AnyObject;
    };
  }) {
    super({ scope: opts.name, identifier: opts.name });

    const { name, variant = 'axios', networkOptions } = opts;
    const { baseUrl = '', headers = {}, ...rest } = networkOptions;

    this.baseUrl = baseUrl;

    const defaultConfigs = {
      ...rest,
      withCredentials: true,
      timeout: 60 * 1000,
      validateStatus: (status: number) => {
        return status < 500;
      },
      headers,
    };

    const defaultHeader = get(defaultConfigs, "headers['Content-Type']");
    if (!defaultHeader) {
      defaultConfigs.headers['Content-Type'] = 'application/json; charset=utf-8';
    }

    switch (variant) {
      case 'axios': {
        this.fetcher = new AxiosFetcher({
          name,
          defaultConfigs,
        });
        break;
      }
      case 'node-fetch': {
        this.fetcher = new NodeFetcher({
          name,
          defaultConfigs,
        });
        break;
      }
      default: {
        break;
      }
    }
  }

  getRequestPath(opts: { paths: Array<string> }) {
    const paths = opts?.paths ?? [];

    const rs = paths
      .map((path: string) => {
        if (!path.startsWith('/')) {
          path = `/${path}`; // Add / to the start of url path
        }

        return path;
      })
      .join('');

    return rs;
  }

  getRequestUrl(opts: { baseUrl?: string; paths: Array<string> }) {
    let baseUrl = opts?.baseUrl ?? this.baseUrl ?? '';
    const paths = opts?.paths ?? [];

    if (!baseUrl || isEmpty(baseUrl)) {
      throw getError({
        statusCode: 500,
        message: '[getRequestUrl] Invalid configuration for third party request base url!',
      });
    }

    if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl.slice(0, -1); // Remove / at the end
    }

    const joined = this.getRequestPath({ paths });
    return `${baseUrl ?? this.baseUrl}${joined}`;
  }

  getNetworkService() {
    return this.fetcher;
  }
}
