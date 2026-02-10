// AccessToken 정보
export type accessTokenDecodeType = {
    type: string;
    auth_code: string;
    auth_name: string;
    sns_code: string;
    user_id: string;
    user_email: string;
    user_name: string;
    user_nickname: string;
    iat: number;
    exp: number;
}

// AccessToken
export type AccessTokenDataType = {
    accessToken: string;
    setAccessToken: (accessToken: string) => void;
}