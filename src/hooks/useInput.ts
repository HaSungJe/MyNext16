import { ChangeEvent, ChangeEventHandler, useCallback, useState } from "react";

export type UseInputType = {
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
    setValue: Function;
    resetValue: Function;
}

// 검색정보 변경
export default function useInput(initValue: string = ""): UseInputType {
    const [value, setValue] = useState<string>(initValue);

    // 값 변경
    const onChange = useCallback((event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setValue(event.target.value);
    }, []);

    // 값 초기화
    const resetValue = useCallback(() => {
        setValue(initValue);
    }, []);

    return {value, onChange, setValue, resetValue};
}