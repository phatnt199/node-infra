import { ApplicationError } from '@/base/base.model';

export const getError = (opts: { message: string; statusCode?: number }) => {
  const error = new ApplicationError(opts);
  return error;
};
