'use client';
import { AccessTokenContextType } from "@/types/access";
import { createContext } from "react";

type ProviderProps = {
    rootLayoutLoading: boolean;
    accessTokenData: AccessTokenContextType;
    isLogin: boolean;
    children: React.ReactNode;
}

// Context
export const RootLayoutLoadingContext = createContext<boolean>(false); // 로딩여부
export const AccessTokenContext = createContext<AccessTokenContextType>(null); // AccessToken
export const IsLogin = createContext<boolean>(false); // 로그인 여부

/**
 * RootLayoutProvider
 * 
 * @param param0 
 * @returns 
 */
export default function RootLayoutProvider({rootLayoutLoading, accessTokenData, isLogin, children}: ProviderProps) {
    return (
        <RootLayoutLoadingContext.Provider value={rootLayoutLoading}>
            <AccessTokenContext.Provider value={accessTokenData}>
                <IsLogin.Provider value={isLogin}>
                    {children}
                </IsLogin.Provider>
            </AccessTokenContext.Provider>
        </RootLayoutLoadingContext.Provider>
    )
}