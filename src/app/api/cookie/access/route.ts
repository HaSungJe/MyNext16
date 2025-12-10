'use server';
import { accessTokenDecodeType } from "@/types/user";
import { cookies, headers as nextHeaders } from "next/headers";
import axios from "axios";
import https from 'https';
import dayjs from 'dayjs';
import * as jwt from 'jsonwebtoken';

const headers = {
    'Content-Type': 'application/json'
}

const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
})

/**
 * AccessToken 얻기
 * 
 * @param request 
 * @returns 
 */
export async function GET(request: Request): Promise<Response> {
    // http, https 구분
    const headerList = await nextHeaders();
    const proto = headerList.get('x-forwarded-proto') || 'http';
    const isSecure = proto === 'https';

    const refreshCutTime: number = 60; // 설정된 시간보다 accessToken의 만료시간이 적은경우, Refresh (단위: 초)
    const url = new URL(request.url);
    const option = url.searchParams.get('option') || '';
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');

    // AcecssToken이 존재하는 경우
    if (accessToken) {
        if (option) {
            const decode = jwt.verify(accessToken.value, process.env.NEXT_PUBLIC_JWT_CODE as string) as accessTokenDecodeType;
            const now = Math.round(new Date().getTime() / 1000);
            if (decode.exp - now > refreshCutTime) {
                return new Response(JSON.stringify({ success: true, data: decode }), {headers});
            }
        } else {
            return new Response(JSON.stringify({ success: true, data: accessToken.value }), {headers});
        }
    }

    // AccessToken이 존재하지 않거나 시간이 짧은 경우
    const refreshToken = cookieStore.get("refreshToken");
    if (refreshToken) {
        try {
            const refresh_token: string = refreshToken.value;
            
            // 시도할 URL 목록 (순서대로)
            const apiUrls = [
                process.env.SERVER_API_URL,      // 1순위: localhost (있으면)
                process.env.NEXT_PUBLIC_API_URL  // 2순위: 로드밸런서
            ].filter(Boolean); // undefined 제거

            let response;
            let lastError;

            // 순차적으로 시도
            for (const apiUrl of apiUrls) {
                try {
                    console.log(`[${dayjs().format('HH:mm:ss')}] Trying API: ${apiUrl}`);
                    
                    response = await axios.post(
                        `${apiUrl}/api/v1/common/user/refresh`,
                        { refresh_token },
                        { 
                            httpsAgent: apiUrl.startsWith('https') ? httpsAgent : undefined,
                            timeout: 3000, // 로컬은 빠르게 실패
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                    
                    console.log(`[${dayjs().format('HH:mm:ss')}] ✓ Success with: ${apiUrl}`);
                    break; // 성공하면 루프 종료
                    
                } catch (error: any) {
                    console.log(`[${dayjs().format('HH:mm:ss')}] ✗ Failed: ${apiUrl} - ${error.message}`);
                    lastError = error;
                    // 다음 URL로 계속 시도
                }
            }

            // 모든 시도 실패
            if (!response) {
                throw lastError || new Error('All API endpoints failed');
            }
            
            if (response.data.refresh_token) {
                cookieStore.set('refreshToken', response.data.refresh_token, {
                    path: "/",
                    httpOnly: true,
                    sameSite: "strict",
                    secure: process.env.NODE_ENV === 'development' ? false : isSecure, 
                });
            }

            const setTime = new Date(new Date(response.data.access_token_end_dt).getTime() - (60 * 1000)); 
            cookieStore.set('accessToken', response.data.access_token, {
                path: "/",
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === 'development' ? false : isSecure,
                expires: setTime
            });

            if (option) {
                const result = jwt.verify(response.data.access_token, process.env.NEXT_PUBLIC_JWT_CODE as string);
                return new Response(JSON.stringify({ success: true, data: result }), { headers });
            } else {
                return new Response(JSON.stringify({ success: true, data: response.data.access_token }), { headers });
            }
        } catch (error: any) {
            console.log(`-------------Refresh Error ${dayjs().format('YYYY-MM-DD HH:mm:ss')} --------------`)
            console.log('All endpoints failed')
            console.log('Last error:', error.message)
            console.log('Status:', error.response?.status)
            return new Response(JSON.stringify({ success: false }), { headers });
        }
    } else {
        return new Response(JSON.stringify({ success: false }), { headers });
    }
}

/**
 * AccessToken 생성
 * 
 * @param request 
 * @returns 
 */
export async function POST(request: Request): Promise<Response> {
    // http, https 구분
    const headerList = await nextHeaders();
    const proto = headerList.get('x-forwarded-proto') || 'http';
    const isSecure = proto === 'https';

    const { setTime, data } = await request.json();

    try {
        const cookieStore = await cookies();
        const endTime = new Date(new Date(setTime).getTime() - (60 * 1000)); // 유지시간보다 1분 빨리 끝나도록해서 가능한 재발급받도록
        
        cookieStore.set('accessToken', data, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === 'development' ? false : isSecure, 
            expires: endTime
        });
    
        return new Response(JSON.stringify({ success: true }), { headers });
    } catch (error) {
        return new Response(JSON.stringify({ success: false }), { headers });
    }
}