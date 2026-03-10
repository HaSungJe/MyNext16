import { resetValidationError } from "./validation";

/**
 * Axios Error 핸들링
 * 
 * @param router
 * @param error 
 * @returns
 */
export async function axiosErrorHandle(error: any, isReset: boolean = true): Promise<void> {
    if (error?.status) {
        const validationErrors: Array<{type: string, property: string, message: string}> = error?.response?.data?.validationErrors ?? [];
        if (validationErrors && validationErrors.length > 0) {
            if (isReset) {
                resetValidationError();
            }
    
            let count = 0;
            for (let i=0; i<error.response.data.validationErrors.length; i++) {
                const doc: any = document.querySelector(`span[data-type=validation-alert][data-id=${error.response.data.validationErrors[i].property}]`);
                console.log(doc)
                
                if (doc) {
                    count++;
                    doc.innerText = error.response.data.validationErrors[i].message;
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
    }
}