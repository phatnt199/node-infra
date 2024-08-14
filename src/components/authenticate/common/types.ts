import { AnyObject, ClassType, IdType } from '@/common';
import { model, property } from '@loopback/repository';
import { UserProfile } from '@loopback/security';

// ----------------------------------------------------------------------------------------------------------------------------------------
export interface JWTTokenPayload extends UserProfile {
  userId: IdType;
  roles: { id: IdType; identifier: string; priority: number }[];
  clientId?: string;
}

export interface TokenPayload extends JWTTokenPayload {}

// ----------------------------------------------------------------------------------------------------------------------------------------
export interface IAuthenticateTokenOptions {
  tokenSecret: string;
  tokenExpiresIn: number;
  refreshExpiresIn: number;
  refreshSecret: string;
}

// ----------------------------------------------------------------------------------------------------------------------------------------
export interface IAuthenticateRestOptions<
  SI_RQ extends SignInRequest = SignInRequest,
  SU_RQ extends SignUpRequest = SignUpRequest,
  CP_RQ extends ChangePasswordRequest = ChangePasswordRequest,
> {
  restPath?: string;
  serviceKey?: string;
  requireAuthenticatedSignUp?: boolean;
  signInRequest?: ClassType<SI_RQ>;
  signUpRequest?: ClassType<SU_RQ>;
  changePasswordRequest?: ClassType<CP_RQ>;
}

// ----------------------------------------------------------------------------------------------------------------------------------------
export interface IAuthenticateOAuth2RestOptions {
  restPath?: string;
  tokenPath?: string;
  authorizePath?: string;
  oauth2ServiceKey?: string;
}

// ----------------------------------------------------------------------------------------------------------------------------------------
export interface IAuthenticateOAuth2Options {
  enable: boolean;

  // TODO only authorization_code is supported at this moment
  handler: {
    type: 'authorization_code';
    authServiceKey: string;
  };

  restOptions?: IAuthenticateOAuth2RestOptions;
  viewFolder?: string;
}

// ----------------------------------------------------------------------------------------------------------------------------------------
@model({
  name: 'SignInRequest',
  jsonSchema: {
    required: ['identifier', 'credential'],
    examples: [
      {
        identifier: { scheme: 'username', value: 'test_username' },
        credential: { scheme: 'basic', value: 'test_password' },
      },
      {
        clientId: 'mt-hrm',
        identifier: { scheme: 'username', value: 'test_username' },
        credential: { scheme: 'basic', value: 'test_password' },
      },
    ],
  },
})
export class SignInRequest {
  @property({
    type: 'object',
    jsonSchema: {
      properties: { scheme: { type: 'string' }, value: { type: 'string' } },
    },
  })
  identifier: { scheme: string; value: string };

  @property({
    type: 'object',
    jsonSchema: {
      properties: { scheme: { type: 'string' }, value: { type: 'string' } },
    },
  })
  credential: { scheme: string; value: string };

  @property({ type: 'string' })
  clientId?: string;
}

@model({
  name: 'ChangePasswordRequest',
  jsonSchema: {
    required: ['oldCredential', 'newCredential'],
    examples: [
      {
        oldCredential: { scheme: 'basic', value: 'old_password' },
        newCredential: { scheme: 'basic', value: 'new_password' },
      },
    ],
  },
})
export class ChangePasswordRequest {
  @property({
    type: 'object',
    jsonSchema: {
      properties: { scheme: { type: 'string' }, value: { type: 'string' } },
    },
  })
  oldCredential: { scheme: string; value: string };

  @property({
    type: 'object',
    jsonSchema: {
      properties: { scheme: { type: 'string' }, value: { type: 'string' } },
    },
  })
  newCredential: { scheme: string; value: string };

  userId: IdType;
}

// -------------------------------------------------------------------
@model({
  name: 'SignUpRequest',
  jsonSchema: {
    required: ['username'],
    examples: [{ username: 'example_username', credential: 'example_credential' }],
  },
})
export class SignUpRequest {
  @property({ type: 'string' })
  username: string;

  @property({ type: 'string' })
  credential: string;

  [additional: string | symbol]: any;
}

// -------------------------------------------------------------------
@model({
  name: 'OAuth2Request',
  jsonSchema: {
    required: ['clientId', 'clientSecret', 'redirectUrl'],
    examples: [
      {
        clientId: 'example_id',
        clientSecret: 'example_secret',
        redirectUrl: 'example_redirect_url',
      },
    ],
  },
})
export class OAuth2Request {
  @property({ type: 'string' })
  clientId: string;

  @property({ type: 'string' })
  clientSecret: string;

  @property({ type: 'string' })
  redirectUrl: string;
}

// -------------------------------------------------------------------
export interface IAuthService<
  // SignIn types
  SI_RQ extends SignInRequest = SignInRequest,
  SI_RS = AnyObject,
  // SignUp types
  SU_RQ extends SignUpRequest = SignUpRequest,
  SU_RS = AnyObject,
  // ChangePassword types
  CP_RQ extends ChangePasswordRequest = ChangePasswordRequest,
  CP_RS = AnyObject,
  // UserInformation types
  UI_RQ = AnyObject,
  UI_RS = AnyObject,
> {
  signIn(opts: SI_RQ): Promise<SI_RS>;
  signUp(opts: SU_RQ): Promise<SU_RS>;
  changePassword(opts: CP_RQ): Promise<CP_RS>;
  getUserInformation?(opts: UI_RQ): Promise<UI_RS>;
}
