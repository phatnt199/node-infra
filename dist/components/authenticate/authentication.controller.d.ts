import { Getter } from '@loopback/core';
import { IdType } from '../../common';
import { ChangePasswordRequest, IAuthenticationControllerRestOptions, IUserService, SignInRequest, SignUpRequest } from './types';
export declare const defineAuthenticationController: <SI_RQ extends SignInRequest = SignInRequest, SI_RS = object, SU_RQ extends SignUpRequest = SignUpRequest, SU_RS = object, CP_RQ extends ChangePasswordRequest = ChangePasswordRequest, CP_RS = object>(opts: IAuthenticationControllerRestOptions) => {
    new (userService: IUserService<SI_RQ, SI_RS, SU_RQ, SU_RS, CP_RQ, CP_RS>, getCurrentUser: Getter<{
        userId: IdType;
    }>): {
        userService: IUserService<SI_RQ, SI_RS, SU_RQ, SU_RS, CP_RQ, CP_RS>;
        getCurrentUser: Getter<{
            userId: IdType;
        }>;
        whoami(): Promise<{
            userId: IdType;
        }>;
        signIn(payload: SI_RQ): Promise<SI_RS>;
        signUp(payload: SU_RQ): Promise<SU_RS>;
        changePassword(payload: CP_RQ): Promise<unknown>;
        logger: import("../..").ApplicationLogger;
        defaultLimit: number;
    };
};
