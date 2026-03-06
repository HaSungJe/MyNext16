'use client';

/**
 * QueryString 만들기
 * 
 * @param obj 
 * @returns 
 */
export function createQueryString(obj: any): string {
    let str = '';
    const keys = Object.keys(obj);
    for (let i=0; i<keys.length; i++) {
        const key = keys[i];
        const value = obj[key];
        str += i === 0 ? `?${key}=${value}` : `&${key}=${value}`;
    }

    return str;
}