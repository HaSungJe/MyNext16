'use server';
import { cookies, headers as nextHeaders } from "next/headers";
import NaverProvider from "next-auth/providers/naver";
import KakaoProvider from "next-auth/providers/kakao";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import NextAuth from "next-auth";
import * as jwt from 'jsonwebtoken';

const handler = NextAuth({
    pages: {
        error: '/sign/in',
    },
    useSecureCookies: process.env.NODE_ENV === 'production',
    cookies: {
        pkceCodeVerifier: {
            name: 'next-auth.pkce.code_verifier',
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: process.env.NODE_ENV === 'production',
            },
        },
    },
    providers: [
        NaverProvider({
            clientId: process.env.NAVER_LOGIN_CLIENT_ID,
            clientSecret: process.env.NAVER_LOGIN_SECRET_ID,
        }),
        KakaoProvider({
            clientId: process.env.KAKAO_LOGIN_CLIENT_ID,
            clientSecret: process.env.KAKAO_LOGIN_SECRET_ID
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_LOGIN_CLIENT_ID,
            clientSecret: process.env.GOOGLE_LOGIN_SECRET_ID
        }),
        AppleProvider({
            clientId: process.env.APPLE_LOGIN_CLIENT_ID,
            clientSecret: process.env.APPLE_LOGIN_SECRET_ID
        }),        
    ],
    callbacks: {
        async signIn({ account, profile }) {
            const headerList = await nextHeaders();
            const proto = headerList.get('x-forwarded-proto') || 'http';
            const isSecure = proto === 'https';
            let data = {};

            // console.log(`--------------------`)
            // console.log(profile)

            if (account.provider === 'naver') {
                const naverProfile = profile as any;
                data = { 
                    sns_code: 'NAVER',
                    sns_id: naverProfile?.response?.id ?? account.providerAccountId,
                    access_token: account.access_token, 
                    name: naverProfile?.response?.name ?? `NAVER${new Date().getTime()}`, 
                }
            } else if (account.provider === 'kakao') {
                const kakaoProfile = profile as any;
                data = { 
                    sns_code: 'KAKAO',
                    sns_id: account.providerAccountId,
                    access_token: account.access_token, 
                    name: kakaoProfile?.kakao_account?.profile?.nickname ?? kakaoProfile?.name ?? `KAKAO${new Date().getTime()}`, 
                }
            } else if (account.provider === 'google') {
                data = { 
                    sns_code: 'GOOGLE',
                    sns_id: account.providerAccountId,
                    access_token: account.access_token, 
                    name: profile?.name ?? `GOOGLE${new Date().getTime()}`,
                }
            } else if (account.provider === 'apple') {
                data = { 
                    sns_code: 'APPLE',
                    sns_id: account.providerAccountId,
                    access_token: account.access_token, 
                    name: profile?.name ?? `APPLE${new Date().getTime()}`,
                }
            }

            // console.log(data)

            try {
                const setTime = new Date().getTime() + (60 * 60 * 1000);
                const token = jwt.sign(data, process.env.NEXT_PUBLIC_JWT_CODE, {expiresIn: `1d`});
                
                // await 추가
                const cookieStore = await cookies();
                cookieStore.set('sns', token, {
                    path: "/",
                    domain: process.env.SERVER_DOMAIN ?? undefined,
                    httpOnly: true,
                    sameSite: "lax",
                    secure: process.env.NODE_ENV === 'development' ? false : isSecure, 
                    expires: setTime
                });

                return '/sign/sns';
            } catch (error) {
                // console.log(`-----------sns 로그인 에러-----------`);
                // console.log(error);
                return false; // 에러 시 명시적 반환 추가
            }
        }
    }
});

export { handler as GET, handler as POST };