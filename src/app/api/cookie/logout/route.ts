'use server';
import { cookies, headers as nextHeaders } from "next/headers";

const headers = {
    'Content-Type': 'application/json'
}

// 로그아웃 생성
export async function POST(request: Request): Promise<Response> {
    try {
        // http, https 구분
        const headerList = await nextHeaders();
        const proto = headerList.get('x-forwarded-proto') || 'http';
        const isSecure = proto === 'https';

        const cookieStroe = await cookies();
        cookieStroe.set('accessToken', '', {
            path: "/",
            domain: process.env.SERVER_DOMAIN ?? undefined,
            httpOnly: true,
            sameSite: process.env.SERVER_DOMAIN ? "lax" : "strict",
            secure: process.env.NODE_ENV === 'development' ? false : isSecure, 
            maxAge: 0
        });

        cookieStroe.set('refreshToken', '', {
            path: "/",
            domain: process.env.SERVER_DOMAIN ?? undefined,
            httpOnly: true,
            sameSite: process.env.SERVER_DOMAIN ? "lax" : "strict",
            secure: process.env.NODE_ENV === 'development' ? false : isSecure, 
            maxAge: 0
        })
        return new Response(JSON.stringify({ success: true }), { headers });
    } catch (error) {
        return new Response(JSON.stringify({ success: false }), { headers });
    }
}