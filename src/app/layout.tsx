'use client';
import { useEffect, useState } from "react";
import { UserInfoType, UserProfileType } from "@/types/user";
import { getAccessToken } from "@/utils/cookie";
import { usePathname, useRouter } from "next/navigation";
import LayoutProvider from "./LayoutProvider";
import Loading from "@/components/Loading";
import { axiosErrorHandle } from "@/utils/util";

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState<boolean>(true);
    const [accessToken, setAccessToken] = useState<string>(null); // ACcessToken
    const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);

    useEffect(() => {
        setLoading(true);

        // 이전페이지정보 저장.
        if (pathname.indexOf('/sign') === -1) {
            sessionStorage.setItem('referer', pathname);
        }

        // AccessToken 조회
        getAccessToken().then(async (accessToken: string) => {
            if (accessToken) {
                setAccessToken(accessToken);
  
                try {
                    // 회원정보 입력
                    setUserInfo({
                        user_id: 'asdf1234',
                        name: '김테스트',
                        age: 30
                    });
            
                    // 회원 프로필 입력
                    setUserProfile({
                        tel: '010-0000-0000',
                        email: 'asdf@naver.com',
                        push_receive_yn: 'Y'
                    });

                } catch (error: any) {
                    await axiosErrorHandle(router, error);
                } finally {
                    // 레이아웃 로딩완료
                    setLoading(false);
                }
            } else {
                setAccessToken(null);
                setLoading(false);
            }
        });
    }, [pathname, accessToken]);

    return (
        <html lang="ko">
            <body>
                <LayoutProvider 
                    loading={loading}
                    accessTokenData={{accessToken, setAccessToken}} 
                    isLogin={accessToken ? true : false}
                    userInfo={userInfo} 
                    userProfile={userProfile}
                >
                    {
                        loading ?
                        <Loading />
                        :
                        <>
                            {children}
                        </>
                    }
                </LayoutProvider>
            </body>
        </html>
    );
}
