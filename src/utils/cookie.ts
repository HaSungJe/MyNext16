'use client';
import axios from 'axios';

/**
 * 소셜 로그인 정보 얻기
 * 
 * @returns 
 */
export async function getSNSAccessToken(): Promise<any> {
    try {
        const response = await axios.get(`/api/cookie/sns`);
        if (response.data.success) {
            return response.data.data;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}

/**
 * 소셜 로그인 정보 삭제
 * 
 * @returns 
 */
export async function deleteSNSAccessToken(): Promise<boolean> {
    try {
        const response = await axios.delete(`/api/cookie/sns`);
        if (response.data.success) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}

/**
 * AccessToken 얻기
 * 
 * @returns 
 */
export async function getAccessToken(): Promise<string | null> {
    try {
        const response = await axios.get(`/api/cookie/access`);
        if (response.data.success) {
            return response.data.data;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}

/**
 * AccessToken를 복호화해서 얻기
 * 
 * @returns 
 */
export async function getAccessTokenData(): Promise<any> {
    try {
        const response = await axios.get(`/api/cookie/access?option=1`);
        if (response.data.success) {
            return response.data.data;
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}

/**
 * AccessToken 존재여부 확인
 * 
 * @returns 
 */
export async function checkAuth(): Promise<boolean> {
    try {
        const response = await axios.get(`/api/cookie/access`);
        if (response.data.success) {
            return true;
        } else {
            return false;
        }
    } catch (error: any) {
        return false;
    }
}

/**
 * RefreshToken 저장
 * 
 * @param refreshToken 
 * @param setTime 
 * @return
 */
export async function setRefreshToken(refreshToken: string, setTime: string): Promise<boolean> {
    try {
        const response = await axios.post(`/api/cookie/refresh`, {setTime, data: refreshToken});
        if (response.data.success) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}

/**
 * AccessToken 저장
 * 
 * @param accessToken 
 * @param setTime 
 * @returns 
 */
export async function setAccessToken(accessToken: string, setTime: string): Promise<boolean> {
    try {
        const response = await axios.post(`/api/cookie/access`, {setTime, data: accessToken});
        if (response.data.success) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}

/**
 * 토큰 삭제
 * 
 * @returns 
 */
export async function deleteToken(): Promise<boolean> {
    try {
        const response = await axios.post(`/api/cookie/logout`, {});
        if (response.data.success) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}