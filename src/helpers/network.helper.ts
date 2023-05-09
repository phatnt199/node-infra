import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { stringify } from '@/utilities';
import https from 'https';

const HTTP = 'http';
const HTTPS = 'https';

interface IRequestOptions {
  url: string;
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'options';
  params?: Record<string | symbol | number, any>;
  body?: any;
  headers?: Record<string | symbol | number, any>;
  configs?: object;
}

// -------------------------------------------------------------
export class NetworkHelper {
  private name: string;
  private worker: AxiosInstance;

  constructor(opts: { name: string; requestConfigs: AxiosRequestConfig; logger?: any }) {
    const { name, requestConfigs } = opts;
    this.name = name;
    opts?.logger?.info('Creating new network request worker instance! Name: %s', this.name);
    // const defaultConfigs = require('axios/lib/defaults/index');
    this.worker = axios.create({
      // ...defaultConfigs,
      ...requestConfigs,
    });
  }

  getProtocol(url: string) {
    return url.startsWith('http:') ? HTTP : HTTPS;
  }

  // -------------------------------------------------------------
  // SEND REQUEST
  // -------------------------------------------------------------
  async send(opts: IRequestOptions, logger?: any) {
    const t = new Date().getTime();

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
    if (protocol === HTTPS) {
      props.httpsAgent = new https.Agent({
        rejectUnauthorized: false,
      })
    }

    logger?.info('[send] URL: %s | Props: %o', url, props);
    const response = await this.worker.request(props);

    logger?.info(`[send] Response: %j | Took: %s(ms)`, response?.data, new Date().getTime() - t);
    return response;
  }

  // -------------------------------------------------------------
  // GET REQUEST
  // -------------------------------------------------------------
  async get(opts: IRequestOptions, logger?: any) {
    const { url, params, configs, ...rest } = opts;
    const response = await this.send({ ...rest, url, method: 'get', params, configs }, logger);
    return response;
  }

  // -------------------------------------------------------------
  // POST REQUEST
  // -------------------------------------------------------------
  async post(opts: IRequestOptions, logger?: any) {
    const { url, body, configs, ...rest } = opts;
    const response = await this.send({ ...rest, url, method: 'post', body, configs }, logger);
    return response;
  }

  // -------------------------------------------------------------
  async put(opts: IRequestOptions, logger?: any) {
    const { url, body, configs, ...rest } = opts;
    const response = await this.send({ ...rest, url, method: 'put', body, configs, ...rest }, logger);
    return response;
  }

  // -------------------------------------------------------------
  async patch(opts: IRequestOptions, logger?: any) {
    const { url, body, configs, ...rest } = opts;
    const response = await this.send({ ...rest, url, method: 'patch', body, configs }, logger);
    return response;
  }

  // -------------------------------------------------------------
  async delete(opts: IRequestOptions, logger?: any) {
    const { url, configs, ...rest } = opts;
    const response = await this.send({ ...rest, url, method: 'delete', configs }, logger);
    return response;
  }
}
