import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { stringify } from '@/utilities';
import { ApplicationLogger, LoggerFactory } from '@/helpers';

const HTTP = 'http';
const HTTPS = 'https';

interface IRequestOptions {
  url: string;
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'options';
  params?: object;
  body?: object;
  configs?: object;
}

// -------------------------------------------------------------
export class NetworkHelper {
  private name: string;
  private worker: AxiosInstance;
  private logger: ApplicationLogger;

  constructor(opts: { name: string; requestConfigs: AxiosRequestConfig }) {
    const { name, requestConfigs } = opts;
    this.logger = LoggerFactory.getLogger([NetworkHelper.name]);
    this.name = name;

    this.logger.info(` Creating new network request worker instance! Name: ${this.name}`);
    this.worker = axios.create({
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

    const { url, method = 'get', params, body, configs } = opts;
    const props: AxiosRequestConfig = {
      url,
      method,
      params,
      data: body,
      paramsSerializer: {
        encode: (p: any) => stringify(p),
      },
      ...configs,
    };

    this.logger.info(`[send] URL: ${url} | Props: ${JSON.stringify(props)}`);
    const response = await this.worker.request(props);

    logger?.info(`[network]][send] Took: ${new Date().getTime() - t} ms!`);
    return response;
  }

  // -------------------------------------------------------------
  // GET REQUEST
  // -------------------------------------------------------------
  async get(opts: IRequestOptions) {
    const { url, params, configs, ...rest } = opts;
    const response = await this.send({ ...rest, url, method: 'get', params, configs });
    return response;
  }

  // -------------------------------------------------------------
  // POST REQUEST
  // -------------------------------------------------------------
  async post(opts: IRequestOptions) {
    const { url, body, configs, ...rest } = opts;
    const response = await this.send({ ...rest, url, method: 'post', body, configs });
    return response;
  }

  // -------------------------------------------------------------
  async put(opts: IRequestOptions) {
    const { url, body, configs, ...rest } = opts;
    const response = await this.send({ ...rest, url, method: 'put', body, configs, ...rest });
    return response;
  }

  // -------------------------------------------------------------
  async patch(opts: IRequestOptions) {
    const { url, body, configs, ...rest } = opts;
    const response = await this.send({ ...rest, url, method: 'patch', body, configs });
    return response;
  }

  // -------------------------------------------------------------
  async delete(opts: IRequestOptions) {
    const { url, configs, ...rest } = opts;
    const response = await this.send({ ...rest, url, method: 'delete', configs });
    return response;
  }
}
