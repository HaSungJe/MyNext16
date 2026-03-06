import { IsNotEmpty } from "class-validator";

// 로그인
export class LoginDto {
    @IsNotEmpty({message: '아이디를 입력해주세요.'})
    login_id: string;

    @IsNotEmpty({message: '비밀번호를 입력해주세요.'})
    login_pw: string;

    constructor(data: any) {
        if (data) {
            this.login_id = data['login_id'] ? data['login_id'] : null;
            this.login_pw = data['login_pw'] ? data['login_pw'] : null;
        }
    }  
}