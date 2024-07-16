import { AnyObject, ClassType, IdType } from '../../common';
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
export interface IAuthenticationControllerRestOptions<SI_RQ extends SignInRequest = SignInRequest, SU_RQ extends SignUpRequest = SignUpRequest, CP_RQ extends ChangePasswordRequest = ChangePasswordRequest> {
    restPath?: string;
    serviceKey?: string;
    requireAuthenticatedSignUp?: boolean;
    signInRequest?: ClassType<SI_RQ>;
    signUpRequest?: ClassType<SU_RQ>;
    changePasswordRequest?: ClassType<CP_RQ>;
}
export interface IAuthService<SI_RQ extends SignInRequest = SignInRequest, SI_RS = AnyObject, SU_RQ extends SignUpRequest = SignUpRequest, SU_RS = AnyObject, CP_RQ extends ChangePasswordRequest = ChangePasswordRequest, CP_RS = AnyObject> {
    signIn(opts: SI_RQ): Promise<SI_RS>;
    signUp(opts: SU_RQ): Promise<SU_RS>;
    changePassword(opts: CP_RQ): Promise<CP_RS>;
}
