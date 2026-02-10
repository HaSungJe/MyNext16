'use client';
import { memo, useContext, useEffect, useState } from "react";
import { LoginDTO } from "./dto";
import { axiosErrorHandle, validateAction } from "@/utils/util";
import { useRouter } from "next/navigation";
import { setAccessToken, setRefreshToken } from "@/utils/cookie";
import axios from "axios";
import Loading from "@/components/Loading";
import useInput, { UseInputType } from "@/hooks/useInput";
import { IsLogin } from "../LayoutProvider";

const Login: React.FC<null> = memo(() => {
    const router = useRouter();
    const isLogin: boolean = useContext(IsLogin);
    const [loading, setLoading] = useState<boolean>(true);

    // 커스텀 훅 사용
    const loginId: UseInputType = useInput('');
    const loginPw: UseInputType = useInput('');

    // 이미 로그인된 경우 대시보드로 이동
    useEffect(() => {
        if (isLogin) {
            router.push('/dashboard');
        } else {
            setLoading(false);
        }
    }, [router, isLogin]);

   // 로그인
    async function login(): Promise<void> {
        const dto = new LoginDTO({login_id: loginId.value, login_pw: loginPw.value});
        const vCheck = await validateAction(dto);
        if (vCheck) {
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/login`, dto);
                await setRefreshToken(response.data.refresh_token);
                await setAccessToken(response.data.access_token, response.data.access_token_end_dt);
                router.push('/dashboard');
            } catch (error) {
                await axiosErrorHandle(router, error);
            }
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
                                <input type="text" value={loginId.value} onChange={loginId.onChange} />
                                <span data-type="validation-alert" data-id="login_id"></span>
                            </td>
                        </tr>
                        <tr>
                            <th>비밀번호</th>
                            <td>
                                <input type="password" value={loginPw.value} onChange={loginPw.onChange}/>
                                <span data-type="validation-alert" data-id="login_pw"></span>
                            </td>
                        </tr>
                    </tbody>
                </table>
    
                <button type="button" onClick={() => login()}>로그인</button>
            </>
        )
    }
})

export default Login;