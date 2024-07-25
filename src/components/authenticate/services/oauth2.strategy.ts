import { EnvironmentKeys } from '@/common';
import { applicationEnvironment } from '@/helpers';
import { BaseNetworkRequest } from '@/services';
import { getError } from '@/utilities';
import { AuthenticationStrategy } from '@loopback/authentication';
import { Request } from '@loopback/rest';
import { securityId } from '@loopback/security';
import isEmpty from 'lodash/isEmpty';

class AuthProviderNetworkRequest extends BaseNetworkRequest {}

export const defineOAuth2Strategy = (opts: { name: string }) => {
  class Strategy implements AuthenticationStrategy {
    name = opts.name;

    authProvider: AuthProviderNetworkRequest;
    authPath: string;

    constructor() {
      const baseURL = applicationEnvironment.get<string>(EnvironmentKeys.APP_ENV_REMOTE_AUTH_SERVER_URL);
      if (!baseURL || isEmpty(baseURL)) {
        throw getError({
          message: `[RemoteAuthenticationStrategy][DANGER] INVALID baseURL | Missing env: APP_ENV_REMOTE_AUTH_SERVER_URL`,
        });
      }

      this.authPath = applicationEnvironment.get<string>(EnvironmentKeys.APP_ENV_REMOTE_AUTH_PATH) ?? '/auth/who-am-i';

      this.authProvider = new AuthProviderNetworkRequest({
        name: AuthProviderNetworkRequest.name,
        scope: `${Strategy.name}_${opts.name}`,
        networkOptions: { baseURL },
      });
    }

    async authenticate(request: Request) {
      const networkService = this.authProvider.getNetworkService();
      const rs = await networkService.send({
        url: this.authProvider.getRequestUrl({ paths: [this.authPath] }),
        headers: { Authorization: request.headers['authorization'] },
      });

      if (rs?.data?.error) {
        throw getError(rs.data.error);
      }

      return { ...rs?.data, [securityId]: rs?.data?.userId?.toString() };
    }
  }

  return Strategy;
};
