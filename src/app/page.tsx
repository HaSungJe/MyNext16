'use client';
import { useContext, useEffect } from "react";
import { IsLogin } from "./LayoutProvider";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    const isLogin: boolean = useContext(IsLogin);
    
    useEffect(() => {
        if (isLogin) {
            router.push('/dashboard');
        } else {
            router.push('/login');
        }
    }, []);
}
