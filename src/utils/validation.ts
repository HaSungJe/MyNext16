import { validateOrReject } from "class-validator";

export type ValidationErrorType = {
    type: string;
    property: string;
    message: string;
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
        const validationErrors: ValidationErrorType[] = [];
        for (let i=0; i<err.length; i++) {
            const error = err[i];
            const key = (Object.keys(err[i]['constraints']))[0];
            if (key === 'isBoolean') {
                if (error['contexts']) {
                    validationErrors.push({
                        type: key,
                        property: error['contexts'][key]['target'],
                        message: error['constraints'][key]
                    });
                }
            } else {
                validationErrors.push({
                    type: key,
                    property: error['property'],
                    message: error['constraints'][key]
                });
            }
        }

        // Document 개수
        let setDocumentTextCount: number = 0;
        for (let i=0; i<validationErrors.length; i++) {
            const findDocument: any = document.querySelector(`span[data-type=validation-alert][data-id=${validationErrors[i].property}]`);
            if (findDocument) {
                setDocumentTextCount++;
                findDocument.innerText = validationErrors[i].message;
                findDocument.style.color = 'red';
                findDocument.style.display = 'block';
            }
        }
        
        if (validationErrors && validationErrors.length > 0 && setDocumentTextCount === 0) {
            alert(validationErrors[0].message);
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