import { AnyObject } from '@/common';
import { stringify } from '@/utilities/url.utility';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import https from 'node:https';
import { AbstractNetworkFetchableHelper } from './base-fetcher';

export interface IAxiosRequestOptions extends AxiosRequestConfig {
  url: string;
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'options';
  params?: AnyObject;
  body?: AnyObject;
  headers?: AnyObject;
  configs?: AnyObject;
}

// -------------------------------------------------------------
export class AxiosFetcher extends AbstractNetworkFetchableHelper<
  IAxiosRequestOptions,
  axios.AxiosResponse
> {
  private worker: AxiosInstance;

  constructor(opts: { name: string; defaultConfigs: AxiosRequestConfig; logger?: any }) {
    super({ name: opts.name });
    const { defaultConfigs } = opts;
    opts?.logger?.info('Creating new network request worker instance! Name: %s', this.name);

    this.worker = axios.create({ ...defaultConfigs });
  }

  // -------------------------------------------------------------
  // SEND REQUEST
  // -------------------------------------------------------------
  send<T = any>(opts: IAxiosRequestOptions & AxiosRequestConfig, logger?: any) {
    const { url, method = 'get', params = {}, body: data, headers, configs } = opts;
    const props: AxiosRequestConfig = {
      url,
      method,
      params,
      data,
      headers,
      paramsSerializer: { serialize: p => stringify(p) },
      ...configs,
    };

    const protocol = this.getProtocol(url);
    if (protocol === 'https') {
      props.httpsAgent = new https.Agent({
        rejectUnauthorized: false,
      });
    }

    logger?.info('[send] URL: %s | Props: %o', url, props);
    return this.worker.request<T>(props);
  }
}
