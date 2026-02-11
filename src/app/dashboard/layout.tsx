'use client';
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { IsLogin, RootLayoutLoadingContext } from "../LayoutProvider";
import Loading from "@/components/Loading";

export default function LoginAfterLayout({children}: {children: React.ReactNode}) {
    const router = useRouter();
    const rootLayoutLoadingContext: boolean = useContext(RootLayoutLoadingContext);
    const isLogin: boolean = useContext(IsLogin);
    const [loading, setLoading] = useState<boolean>(true);
    
    // 로그인이 되어있지 않은 경우, 로그인 페이지로 이동
    useEffect(() => {
        if (rootLayoutLoadingContext) {
            setLoading(true);
        } else {
            if (isLogin) {
                setLoading(false);
            } else {
                router.push('/login');
            }
        }
    }, [rootLayoutLoadingContext, isLogin]);

    if (loading) {
        return (
            <Loading />
        )
    } else {
        return (
            <>
                {children}
            </>
        )
    }
}