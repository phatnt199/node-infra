import { AnyObject, ClassType, IdType } from '@/common';
import { model, property } from '@loopback/repository';

@model({
  name: 'SignInRequest',
  jsonSchema: {
    required: ['identifier', 'credential'],
    examples: [
      {
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

export interface IAuthenticationControllerRestOptions<
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

// -------------------------------------------------------------------
export interface IAuthService<
  SI_RQ extends SignInRequest = SignInRequest,
  SI_RS = AnyObject,
  SU_RQ extends SignUpRequest = SignUpRequest,
  SU_RS = AnyObject,
  CP_RQ extends ChangePasswordRequest = ChangePasswordRequest,
  CP_RS = AnyObject,
> {
  signIn(opts: SI_RQ): Promise<SI_RS>;
  signUp(opts: SU_RQ): Promise<SU_RS>;
  changePassword(opts: CP_RQ): Promise<CP_RS>;
}
