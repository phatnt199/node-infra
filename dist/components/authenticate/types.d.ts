import { AnyObject, ClassType, IdType } from '../../common';
import { UserProfile } from '@loopback/security';
export interface JWTTokenPayload extends UserProfile {
    userId: IdType;
    roles: {
        id: IdType;
        identifier: string;
        priority: number;
    }[];
    clientId?: string;
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
    authorizePath?: string;
    oauth2ServiceKey?: string;
    authStrategy?: {
        name: string;
    };
}
export interface IAuthenticateOAuth2Options {
    enable: boolean;
    handler: {
        type: 'authorization_code';
        authServiceKey: string;
    };
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
    clientId?: string;
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
export declare class OAuth2Request {
    clientId: string;
    clientSecret: string;
    redirectUrl?: string;
}
export interface IAuthService<SI_RQ extends SignInRequest = SignInRequest, SI_RS = AnyObject, SU_RQ extends SignUpRequest = SignUpRequest, SU_RS = AnyObject, CP_RQ extends ChangePasswordRequest = ChangePasswordRequest, CP_RS = AnyObject, UI_RQ = AnyObject, UI_RS = AnyObject> {
    signIn(opts: SI_RQ): Promise<SI_RS>;
    signUp(opts: SU_RQ): Promise<SU_RS>;
    changePassword(opts: CP_RQ): Promise<CP_RS>;
    getUserInformation?(opts: UI_RQ): Promise<UI_RS>;
}
