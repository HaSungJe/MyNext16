'use client';
import { deleteToken, getAccessToken } from '@/utils/cookie';
import { useRouter } from 'next/navigation';
import { axiosErrorHandle } from './util';
import axios from 'axios';

type AppRouterInstance = ReturnType<typeof useRouter>;

/**
 * Get
 * 
 * @param router
 * @param url 
 * @param headers
 */
export async function axiosGet(router: AppRouterInstance, url: string, headers: object = {}) {
    try {
        const accessToken = await getAccessToken();
        const authorization = process.env.NEXT_PUBLIC_AUTHORIZATION;
        return await axios.get(url, {headers: {...headers, authorization, accessToken: accessToken}});
    } catch (error: any) {
        if (error.response.data.statusCode === 401) {
            await deleteToken();
            await axiosErrorHandle(error, router);
        } else {
            throw error;
        }
    }
}

/**
 * Post 
 * 
 * @param router
 * @param url 
 * @param body 
 * @param headers
 * @returns 
 */
export async function axiosPost(router: AppRouterInstance, url: string, body: any, headers: object = {}) {
    try {
        const accessToken = await getAccessToken();
        const authorization = process.env.NEXT_PUBLIC_AUTHORIZATION;
        return await axios.post(url, body, {headers: {...headers, authorization, accessToken: accessToken}});
    } catch (error: any) {
        if (error.response.data.statusCode === 401) {
            await deleteToken();
            await axiosErrorHandle(error, router);
        } else {
            throw error;
        }
    }
}

/**
 * Put
 * 
 * @param router
 * @param url 
 * @param body 
 * @param headers
 * @returns 
 */
export async function axiosPut(router: AppRouterInstance, url: string, body: any, headers: object = {}) {
    try {
        const accessToken = await getAccessToken();
        const authorization = process.env.NEXT_PUBLIC_AUTHORIZATION;
        return await axios.put(url, body, {headers: {...headers, authorization, accessToken: accessToken}});
    } catch (error: any) {
        if (error.response.data.statusCode === 401) {
            await deleteToken();
            await axiosErrorHandle(error, router);
        } else {
            throw error;
        }
    }
}

/**
 * Patch
 * 
 * @param router
 * @param url 
 * @param body 
 * @param reload 
 * @param headers
 * @returns 
 */
export async function axiosPatch(router: AppRouterInstance, url: string, body: any, headers: object = {}) {
    try {
        const accessToken = await getAccessToken();
        const authorization = process.env.NEXT_PUBLIC_AUTHORIZATION;
        return await axios.patch(url, body, {headers: {...headers, authorization, accessToken: accessToken}});
    } catch (error: any) {
        if (error.response.data.statusCode === 401) {
            await deleteToken();
            await axiosErrorHandle(error, router);
        } else {
            throw error;
        }
    }
}

/**
 * Delete
 * 
 * @param router
 * @param url 
 * @param body 
 * @param headers
 */
export async function axiosDelete(router: AppRouterInstance, url: string, body: any, headers: object = {}) {
    try {
        const accessToken = await getAccessToken();
        const authorization = process.env.NEXT_PUBLIC_AUTHORIZATION;
        if (body && body !== null) {
            await axios.delete(url, { data: body, headers: {...headers, authorization, accessToken: accessToken}});
        } else {
            await axios.delete(url, { headers: {...headers, authorization, accessToken: accessToken}});
        }
    } catch (error: any) {
        if (error.response.data.statusCode === 401) {
            await deleteToken();
            await axiosErrorHandle(error, router);
        } else {
            throw error;
        }
    }
}