import { ChangeEvent, ChangeEventHandler, useCallback, useState } from "react";

export type UseInputFloatType = {
    value: string | number;
    onChange: ChangeEventHandler<HTMLInputElement>;
    setValue: Function;
    resetValue: Function;
}

// 검색정보 변경
export default function useInputNumberFloat(isNumberString: boolean, initValue: string | number = 0): UseInputFloatType {
    const [value, setValue] = useState<string | number>(initValue);

    // 값 생성
    const onCreate = useCallback((changeValue: string | number) => {
        changeValue = changeValue.toString().replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'); 
        if (parseInt(changeValue).toString() !== 'NaN') {
            if (isNumberString) {
                setValue(changeValue);
            } else {
                setValue(parseInt(changeValue));
            }
        } else {
            setValue(0);
        }
    }, []);

    // 값 변경
    const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        onCreate(event.target.value);
    }, []);

    // 값 초기화
    const resetValue = useCallback(() => {
        onCreate(initValue);
    }, []);

    return {value, onChange, setValue, resetValue};
}