import { AnyObject, ClassType, IdType } from '../../common';
import { UserProfile } from '@loopback/security';
import { IOAuth2AuthenticationHandler } from './oauth2-handlers/base';
import { Request as _Request, Response as _Response } from '@node-oauth/oauth2-server';
export declare class OAuth2Request extends _Request {
}
export declare class OAuth2Response extends _Response {
}
export interface JWTTokenPayload extends UserProfile {
    userId: IdType;
    roles: {
        id: IdType;
        identifier: string;
        priority: number;
    }[];
}
export interface TokenPayload extends JWTTokenPayload {
}
export interface IAuthenticateTokenOptions {
    tokenSecret: string;
    tokenExpiresIn: number;
    refreshExpiresIn: number;
    refreshSecret: string;
}
export interface IAuthenticateRestOptions<SI_RQ extends SignInRequest = SignInRequest, SU_RQ extends SignUpRequest = SignUpRequest, CP_RQ extends ChangePasswordRequest = ChangePasswordRequest> {
    restPath?: string;
    serviceKey?: string;
    requireAuthenticatedSignUp?: boolean;
    signInRequest?: ClassType<SI_RQ>;
    signUpRequest?: ClassType<SU_RQ>;
    changePasswordRequest?: ClassType<CP_RQ>;
}
export interface IAuthenticateOAuth2RestOptions {
    restPath?: string;
    tokenPath?: string;
    serviceKey?: string;
}
export interface IAuthenticateOAuth2Options {
    enable: boolean;
    handler?: IOAuth2AuthenticationHandler;
    restOptions?: IAuthenticateOAuth2RestOptions;
}
export declare class SignInRequest {
    identifier: {
        scheme: string;
        value: string;
    };
    credential: {
        scheme: string;
        value: string;
    };
}
export declare class ChangePasswordRequest {
    oldCredential: {
        scheme: string;
        value: string;
    };
    newCredential: {
        scheme: string;
        value: string;
    };
    userId: IdType;
}
export declare class SignUpRequest {
    username: string;
    credential: string;
    [additional: string | symbol]: any;
}
export interface IAuthService<SI_RQ extends SignInRequest = SignInRequest, SI_RS = AnyObject, SU_RQ extends SignUpRequest = SignUpRequest, SU_RS = AnyObject, CP_RQ extends ChangePasswordRequest = ChangePasswordRequest, CP_RS = AnyObject> {
    signIn(opts: SI_RQ): Promise<SI_RS>;
    signUp(opts: SU_RQ): Promise<SU_RS>;
    changePassword(opts: CP_RQ): Promise<CP_RS>;
}
export interface IOAuth2Service<T> {
    generateToken(opts: {
        request: OAuth2Request;
        response: OAuth2Response;
    }): T;
}
