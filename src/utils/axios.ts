'use client';
import { deleteToken, getAccessToken } from '@/utils/cookie';
import axios from 'axios';

type AccessType = {
    accessToken: string;
    setAccessToken: (accessToken: string) => void;
    reload?: number;
}

/**
 * Get
 * 
 * @param access
 * @param url 
 * @param headers
 */
export async function axiosGet(access: AccessType, url: string, headers: object = {}) {
    access.reload = access?.reload ?? 0;

    try {
        const authorization = process.env.NEXT_PUBLIC_AUTHORIZATION;
        return await axios.get(url, {headers: {...headers, authorization, accessToken: access.accessToken}});
    } catch (error: any) {
        if (error.response.data.statusCode === 401) {
            if (access.reload < 5) {
                const accessToken = await getAccessToken();
                if (accessToken) {
                    access.setAccessToken(accessToken);
                    access.accessToken = accessToken;
                    access.reload += 1;
                    return await axiosGet(access, url, headers);
                } else {
                    access.setAccessToken(null);
                    await deleteToken();
                    throw error;
                }
            } else {
                access.setAccessToken(null);
                await deleteToken();
                throw error;
            }
        } else {
            throw error;
        }
    }
}

/**
 * Post 
 * 
 * @param access
 * @param url 
 * @param body 
 * @param headers
 * @returns 
 */
export async function axiosPost(access: AccessType, url: string, body: any, headers: object = {}) {
    access.reload = access?.reload ?? 0;
    
    try {
        const authorization = process.env.NEXT_PUBLIC_AUTHORIZATION;
        return await axios.post(url, body, {headers: {...headers, authorization, accessToken: access.accessToken}});
    } catch (error: any) {
        if (error.response.data.statusCode === 401) {
            if (access.reload < 5) {
                const accessToken = await getAccessToken();
                if (accessToken) {
                    access.setAccessToken(accessToken);
                    access.accessToken = accessToken;
                    access.reload += 1;
                    return await axiosPost(access, url, body, headers);
                } else {
                    access.setAccessToken(null);
                    await deleteToken();
                    throw error;
                }
            } else {
                access.setAccessToken(null);
                await deleteToken();
                throw error;
            }
        } else {
            throw error;
        }
    }
}

/**
 * Put
 * 
 * @param access
 * @param url 
 * @param body 
 * @param headers
 * @returns 
 */
export async function axiosPut(access: AccessType, url: string, body: any, headers: object = {}) {
    access.reload = access?.reload ?? 0;

    try {
        const authorization = process.env.NEXT_PUBLIC_AUTHORIZATION;
        return await axios.put(url, body, {headers: {...headers, authorization, accessToken: access.accessToken}});
    } catch (error: any) {
        if (error.response.data.statusCode === 401) {
            if (access.reload < 5) {
                const accessToken = await getAccessToken();
                if (accessToken) {
                    access.setAccessToken(accessToken);
                    access.accessToken = accessToken;
                    access.reload += 1;
                    return await axiosPut(access, url, body, headers);
                } else {
                    access.setAccessToken(null);
                    await deleteToken();
                    throw error;
                }
            } else {
                access.setAccessToken(null);
                await deleteToken();
                throw error;
            }
        } else {
            throw error;
        }
    }
}

/**
 * Patch
 * 
 * @param access
 * @param url 
 * @param body 
 * @param headers
 * @returns 
 */
export async function axiosPatch(access: AccessType, url: string, body: any, headers: object = {}) {
    access.reload = access?.reload ?? 0;

    try {
        const authorization = process.env.NEXT_PUBLIC_AUTHORIZATION;
        return await axios.patch(url, body, {headers: {...headers, authorization, accessToken: access.accessToken}});
    } catch (error: any) {
        if (error.response.data.statusCode === 401) {
            if (access.reload < 5) {
                const accessToken = await getAccessToken();
                if (accessToken) {
                    access.setAccessToken(accessToken);
                    access.accessToken = accessToken;
                    access.reload += 1;
                    return await axiosPatch(access, url, body, headers);
                } else {
                    access.setAccessToken(null);
                    await deleteToken();
                    throw error;
                }
            } else {
                access.setAccessToken(null);
                await deleteToken();
                throw error;
            }
        } else {
            throw error;
        }
    }
}

/**
 * Delete
 * 
 * @param access
 * @param url 
 * @param body 
 * @param headers
 */
export async function axiosDelete(access: AccessType, url: string, body: any, headers: object = {}) {
    access.reload = access?.reload ?? 0;

    try {
        const authorization = process.env.NEXT_PUBLIC_AUTHORIZATION;
        if (body && body !== null) {
            return await axios.delete(url, { data: body, headers: {...headers, authorization, accessToken: access.accessToken}});
        } else {
            return await axios.delete(url, { headers: {...headers, authorization, accessToken: access.accessToken}});
        }
    } catch (error: any) {
        if (error.response.data.statusCode === 401) {
            if (access.reload < 5) {
                const accessToken = await getAccessToken();
                if (accessToken) {
                    access.setAccessToken(accessToken);
                    access.accessToken = accessToken;
                    access.reload += 1;
                    return await axiosDelete(access, url, body, headers);
                } else {
                    access.setAccessToken(null);
                    await deleteToken();
                    throw error;
                }
            } else {
                access.setAccessToken(null);
                await deleteToken();
                throw error;
            }
        } else {
            throw error;
        }
    }
}