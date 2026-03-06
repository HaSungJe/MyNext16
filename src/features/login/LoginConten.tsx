'use client';
import { useContext, useEffect, useState } from "react";
import { IsLogin, RootLayoutLoadingContext } from "@/app/RootLayoutProvider";
import { useRouter } from "next/navigation";
import { setAccessToken, setRefreshToken } from "@/utils/cookie";
import { validateAction } from "@/utils/validation";
import { axiosErrorHandle } from "@/utils/axios-error";
import { LoginDto } from "./dto";
import axios from "axios";
import Loading from "@/components/Loading";
import useInput, { UseInputType } from "@/hooks/useInput";

export default function LoginContent(): React.ReactNode {
    const router = useRouter();
    const rootLayoutLoadingContext: boolean = useContext(RootLayoutLoadingContext);
    const isLogin: boolean = useContext(IsLogin);
    const [loading, setLoading] = useState<boolean>(true);

    // 커스텀 훅 사용
    const loginId: UseInputType = useInput('');
    const loginPw: UseInputType = useInput('');

    // 이미 로그인된 경우 대시보드로 이동
    useEffect(() => {
        if (rootLayoutLoadingContext) {
            setLoading(true);
        } else {
            if (isLogin) {
                router.push('/dashboard');
            } else {
                setLoading(false);
            }
        }
    }, [rootLayoutLoadingContext, isLogin]);

    // 로그인
    async function login(): Promise<void> {
        const dto = new LoginDto({login_id: loginId.value, login_pw: loginPw.value});
        const vCheck = await validateAction(dto);
        if (vCheck) {
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/login`, dto);
                await setRefreshToken(response.data.refresh_token, response.data.refresh_token_end_dt);
                await setAccessToken(response.data.access_token, response.data.access_token_end_dt);
                router.push('/dashboard');
            } catch (error) {
                await axiosErrorHandle(error);
            }
        }
    }

    // 엔터키 입력 반응
    async function enterScope(e: React.KeyboardEvent<HTMLInputElement>): Promise<void> {
        if (e.key === 'Enter') {
            await login();
        }
    }

    if (loading) {
        return (
            <Loading />
        )
    } else {
        return (
            <>
                <table>
                    <colgroup>
                        <col style={{width: '20%'}}/>
                        <col style={{width: '80%'}}/>
                    </colgroup>
                    <tbody>
                        <tr>
                            <th>아이디</th>
                            <td>
                                <input 
                                    type="text" 
                                    value={loginId.value} 
                                    onChange={loginId.onChange} 
                                    onKeyDown={enterScope}
                                />
                                <span data-type="validation-alert" data-id="login_id" />
                            </td>
                        </tr>
                        <tr>
                            <th>비밀번호</th>
                            <td>
                                <input 
                                    type="password" 
                                    value={loginPw.value} 
                                    onChange={loginPw.onChange}
                                    onKeyDown={enterScope}
                                />
                                <span data-type="validation-alert" data-id="login_pw" />
                            </td>
                        </tr>
                    </tbody>
                </table>
    
                <button 
                    type="button" 
                    onClick={() => login()}
                >로그인
                </button>
            </>
        )
    }
}