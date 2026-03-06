'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { deleteToken, getAccessToken } from '@/utils/cookie';
import { axiosErrorHandle } from '@/utils/axios-error';
import NextTopLoader from 'nextjs-toploader';
import Scripts from '@/components/Scripts';
import RootLayoutProvider from './RootLayoutProvider';

export default function RootLayoutContent({ children }: { children: React.ReactNode }): React.ReactNode {
    const router = useRouter();
    const pathname = usePathname();

    // 기본정보
    const [rootLayoutLoading, setRootLayoutLoading] = useState<boolean>(true); // 최상위 레이아웃 로딩여부
    const [accessToken, setAccessToken] = useState<string>(null); // ACcessToken

    // 페이지 변경
    useEffect(() => {
        // 이전페이지정보 저장.
        if (pathname.indexOf('/sign') === -1) {
            sessionStorage.setItem('referer', pathname);
        }

        getAccessToken().then(async (accessToken: string) => {
            if (accessToken) {
                setAccessToken(accessToken);
    
                try {

                } catch (error: any) {
                    await axiosErrorHandle(router, error);
                } finally {
                    // 레이아웃 로딩완료
                    setRootLayoutLoading(false);
                }
            } else {
                await deleteToken();
                setAccessToken(null);
                setRootLayoutLoading(false);
            }
        });
    }, [pathname]);

    return (
        <>
            <NextTopLoader showSpinner={false} /> 
            <div id="wrap">
                <Scripts />
                <RootLayoutProvider
                    rootLayoutLoading={rootLayoutLoading}
                    accessTokenData={{accessToken, setAccessToken}}
                    isLogin={accessToken ? true : false}
                >
                    {children}
                </RootLayoutProvider>
            </div>
        </>
    )
}