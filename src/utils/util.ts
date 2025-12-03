'use client';
import { validateOrReject } from "class-validator";
import { useRouter } from "next/navigation";
import { deleteToken } from "./cookie";
type AppRouterInstance = ReturnType<typeof useRouter>;

/**
 * URL의 쿼리정보 얻기
 * - next/script로 jquery 등의 기능 사용시, useSearchParam 기능을 사용할 수 없으므로 해당 기능으로 대체함.
 * 
 * @returns 
 */
export function createQueryJSONForURL(pathname: string, url: string): Object {
    const result: any = {};
    const cutUrl = url.substring(url.indexOf(pathname) + pathname.length + 1);
    if (cutUrl) {
        const list = cutUrl.split("&");
        for (let i=0; i<list.length; i++) {
            const list2 = list[i].split('=');
            result[list2[0]] = decodeURIComponent(list2[1]);
        }
    }

    return result;
}

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

/**
 * Axios Error 핸들링
 * 
 * @param router
 * @param error 
 * @returns
 */
export async function axiosErrorHandle(router: AppRouterInstance, error: any, isReset: boolean = true): Promise<void> {
    const statusCode = error?.response?.data?.statusCode;
    if (statusCode === 400) {
        if (error?.response?.data?.validationError) {
            if (isReset) {
                resetValidationError();
            }

            let count = 0;
            for (let i=0; i<error.response.data.validationError.length; i++) {
                const doc: any = document.querySelector(`span[data-type=validation-alert][data-id=${error.response.data.validationError[i].property}]`);
                if (doc) {
                    count++;
                    doc.innerText = error.response.data.validationError[i].message;
                    doc.style.color = 'red';
                    doc.style.display = 'block';
                }
            }
            
            if (count === 0 && error?.response?.data?.message) {
                alert(error.response.data.message);
            }
        } else {
            if (error?.response?.data?.message) {
                alert(error.response.data.message);
            }
        }
    } else if (statusCode === 401) {
        await deleteToken();
        router.push('/login');
    } else if (statusCode === 403) {
        alert(error.response.data?.message);
        if (router) {
            router.push('/')
        }
    } else {
        alert('실패하였습니다.');
    }
}

/**
 * Validation Error 초기화
 */
export function resetValidationError(): void {
    const docs: any = document.querySelectorAll(`span[data-type=validation-alert]`);
    for (let i=0; i<docs.length; i++) {
        docs[i].innerText = '';
        docs[i].style.color = '';
        docs[i].style.display = 'none';
    }
}

/**
 * Validation 체크 및 오류처리
 * 
 * @param dto 
 * @param reset
 */
export async function validateAction(dto: any, reset: boolean = true): Promise<boolean> {
    if (reset) {
        resetValidationError();
    }

    try {
        await validateOrReject(dto);
        return true;
    } catch (err: any) {
        const errors = [];

        for (let i=0; i<err.length; i++) {
            const error = err[i];
            const key = (Object.keys(err[i]['constraints']))[0];
            if (key === 'isBoolean') {
                if (error['contexts']) {
                    errors.push({
                        type: key,
                        property: error['contexts'][key]['target'],
                        message: error['constraints'][key]
                    });
    
                } else {
                    errors.push({
                        type: key,
                        message: error['constraints'][key]
                    });
                }
            } else {
                errors.push({
                    type: key,
                    property: error['property'],
                    message: error['constraints'][key]
                });
            }
        }

        let span_alert_count = 0;
        for (let i=0; i<errors.length; i++) {
            const doc: any = document.querySelector(`span[data-type=validation-alert][data-id=${errors[i].property}]`);
            if (doc) {
                doc.innerText = errors[i].message;
                doc.style.color = 'red';
                doc.style.display = 'block';
                span_alert_count++;
            }
        }

        if (errors && errors.length > 0 && span_alert_count === 0) {
            alert(errors[0].message);
        }

        return false;
    }
}

/**
 * Validation 체크 및 오류처리
 * - dto 안의 dto
 * 
 * @param dto 
 * @param key
 * @returns 
 */
export async function validateActionChilds(dto: any, key: string): Promise<boolean> {
    try {
        await validateOrReject(dto);
        return true;
    } catch (err: any) {
        const errors = [];

        for (let i=0; i<err.length; i++) {
            const error = err[i];
            const key = (Object.keys(err[i]['constraints']))[0];
            if (key === 'isBoolean') {
                if (error['contexts']) {
                    errors.push({
                        type: key,
                        property: error['contexts'][key]['target'],
                        message: error['constraints'][key]
                    });
    
                } else {
                    errors.push({
                        type: key,
                        message: error['constraints'][key]
                    });
                }
            } else {
                errors.push({
                    type: key,
                    property: error['property'],
                    message: error['constraints'][key]
                });
            }
        }

        let span_alert_count = 0;
        for (let i=0; i<errors.length; i++) {
            const doc: any = document.querySelector(`span[data-type=validation-alert][data-id=${errors[i].property}][data-key='${key}']`);
            if (doc) {
                doc.innerText = errors[i].message;
                doc.style.color = 'red';
                doc.style.display = 'block';
                span_alert_count++;
            }
        }

        if (errors && errors.length > 0 && span_alert_count === 0) {
            alert(errors[0].message);
        }

        return false;
    }
}

/**
 * 10보다 작은 수 "0" 으로 채우기
 * 
 * @param {*} v 
 */
export function addZero(v: any): string {
    if (v) {
        if (parseInt(v) < 10) {
            v = "0" + v;
        } else {
            v = "" + v;
        }
    
        return v;
    } else {
        return "01";
    }
}
// 숫자에 3자리 마다 , 붙임
export function numberFormat(v: any): string {
    return new Intl.NumberFormat().format(v);
}

// 숫자만 입력하도록
export function onlyNumber(v: any): number {
    const temp_v = v.toString().replace(/[^0-9]/g, '');
    if (parseInt(temp_v).toString() !== 'NaN') {
        return parseInt(temp_v);
    } else {
        return 0;
    }
}