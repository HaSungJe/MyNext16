import { resetValidationError, ValidationErrorType } from "./validation";

/**
 * Axios Error 핸들링
 * - ValidationErrors(유효성 검증 실패 목록)를 넘겨받으면, 해당 값에 맞는 Document를 찾아 메세지 출력. (못찾으면 Alert)
 * 
 * @param error API 에러
 * @param isReset 기존 Document에 출력한 에러 정보를 초기상태로 되돌릴지의 여부
 */
export async function axiosErrorHandle(error: any, isReset: boolean = true): Promise<void> {
    if (error?.status) {
        const validationErrors: Array<ValidationErrorType> = error?.response?.data?.validationErrors ?? [];
        if (validationErrors && validationErrors.length > 0) {
            if (isReset) {
                resetValidationError();
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
            
            if (setDocumentTextCount === 0 && error?.response?.data?.message) {
                alert(error.response.data.message);
            }
        } else {
            if (error?.response?.data?.message) {
                alert(error.response.data.message);
            }
        }        
    }
}