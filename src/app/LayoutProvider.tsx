'use client';
import { AccessTokenDataType } from "@/types/access";
import { UserInfoType, UserProfileType } from "@/types/user";
import { createContext } from "react";

type ProviderProps = {
    accessTokenData: AccessTokenDataType;
    isLogin: boolean;
    userInfo: UserInfoType;
    userProfile: UserProfileType;
    children: React.ReactNode;
}

// Context
export const AccessTokenContext = createContext<AccessTokenDataType>(null); // AccessToken
export const IsLogin = createContext<boolean>(false); // 로그인 여부
export const UserContext = createContext<UserInfoType | null>(null); // 회원정보
export const UserProfileContext = createContext<UserProfileType>(null); // 회원 프로필

/**
 * LayoutProvider
 * 
 * @param param0 
 * @returns 
 */
export default function LayoutProvider({accessTokenData, isLogin, userInfo, userProfile, children}: ProviderProps) {
    return (
        <AccessTokenContext.Provider value={accessTokenData}>
            <IsLogin.Provider value={isLogin}>
                <UserContext.Provider value={userInfo}> {/* 회원정보 */}
                    <UserProfileContext.Provider value={userProfile}> {/* 회원 프로필 */}
                        {children}
                    </UserProfileContext.Provider>
                </UserContext.Provider>
            </IsLogin.Provider>
        </AccessTokenContext.Provider>
    )
}