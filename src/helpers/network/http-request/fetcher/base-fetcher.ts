import { AnyType } from '@/common/types';

const HTTP = 'http';
const HTTPS = 'https';

export interface IRequestOptions {
  url: string;
  params?: Record<string | symbol, any>;
  method?: string;
  [extra: symbol | string]: any;
}

export interface IFetchable<Request extends IRequestOptions, Response extends AnyType> {
  send(opts: Request, logger?: any): Promise<Response>;
  get(opts: Request, logger?: any): Promise<Response>;
  post(opts: Request, logger?: any): Promise<Response>;
  put(opts: Request, logger?: any): Promise<Response>;
  patch(opts: Request, logger?: any): Promise<Response>;
  delete(opts: Request, logger?: any): Promise<Response>;
}

export abstract class AbstractNetworkFetchableHelper<RQ extends IRequestOptions, RS extends AnyType>
  implements IFetchable<RQ, RS>
{
  protected name: string;

  constructor(opts: { name: string }) {
    this.name = opts.name;
  }

  abstract send(opts: RQ, logger?: any): Promise<RS>;

  getProtocol(url: string) {
    return url.startsWith('http:') ? HTTP : HTTPS;
  }

  // -------------------------------------------------------------
  // GET REQUEST
  // -------------------------------------------------------------
  get(opts: RQ, logger?: any) {
    const { ...rest } = opts;
    return this.send({ ...rest, method: 'get' }, logger);
  }

  // -------------------------------------------------------------
  // POST REQUEST
  // -------------------------------------------------------------
  post(opts: RQ, logger?: any) {
    const { ...rest } = opts;
    return this.send({ ...rest, method: 'post' }, logger);
  }

  // -------------------------------------------------------------
  // PUT REQUEST
  // -------------------------------------------------------------
  put(opts: RQ, logger?: any) {
    const { ...rest } = opts;
    return this.send({ ...rest, method: 'put' }, logger);
  }

  // -------------------------------------------------------------
  // PATCH REQUEST
  // -------------------------------------------------------------
  patch(opts: RQ, logger?: any) {
    const { ...rest } = opts;
    return this.send({ ...rest, method: 'patch' }, logger);
  }

  // -------------------------------------------------------------
  // DELETE REQUEST
  // -------------------------------------------------------------
  delete(opts: RQ, logger?: any) {
    const { ...rest } = opts;
    return this.send({ ...rest, method: 'delete' }, logger);
  }
}
