import { IncomingHttpHeaders } from 'http';
import { ParsedUrlQuery } from 'querystring';

export interface Handshake {
  headers: IncomingHttpHeaders;
  time: string;
  address: string;
  xdomain: boolean;
  secure: boolean;
  issued: number;
  url: string;
  query: ParsedUrlQuery;
  auth: {
    [key: string]: any;
  };
}
