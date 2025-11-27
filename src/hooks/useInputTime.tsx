import { ChangeEvent, ChangeEventHandler, useCallback, useState } from "react";

export type UseInputTimeType = {
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
    setValue: Function;
    resetValue: Function;
}

// 검색정보 변경
export default function useInputTime(level: 'HOUR' | 'MINUTE' | 'SECOND', initValue: string = ""): UseInputTimeType {
    const size: number = level === 'HOUR' ? 2 : (level === 'MINUTE' ? 4 : 6);
    const [value, setValue] = useState<string>(initValue);

    // 값 생성
    const onCreate = useCallback((changeValue: string) => {
        changeValue = changeValue.toString().replace(/[^0-9]/g, '');
        changeValue = changeValue && changeValue.length > 0 ? changeValue = changeValue.substring(0, size) : changeValue;
        const hour = changeValue.substring(0, 2);
        const minute = changeValue.substring(2, 4);
        const second = changeValue.substring(4, 6);

        const result: Array<string> = [];
        if (hour) {
            result.push(hour);
        }
        if (minute) {
            result.push(minute);
        }
        if (second) {
            result.push(second);
        }

        return result.join(':');
    }, []);

    // 값 변경
    const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setValue(onCreate(event.target.value));
    }, []);

    // 값 초기화
    const resetValue = useCallback(() => {
        setValue(onCreate(initValue));
    }, []);

    return {value, onChange, setValue, resetValue};
}