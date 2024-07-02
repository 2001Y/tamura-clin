'use client';
import { useEffect } from 'react'
import useSWR from 'swr'

const useStaticSWR = <T>(key: string, initialData: T) => {
    const { data = initialData, mutate } = useSWR<T>(key, null, {
        fallbackData: initialData,
        revalidateOnFocus: false, // 画面フォーカス時の再検証（apiリクエスト）をオフ
        revalidateOnMount: false, // コンポーネントマウント時の再検証（apiリクエスト）をオフ
        revalidateOnReconnect: false, // ブラウザがネットワーク接続できた時の再検証(apiリクエスト)をオフ
        revalidateIfStale: false, // キャッシュが古くなったときの再検証（apiリクエスト）をオフ
    })

    useEffect(() => {
        // swrでキャッシュされているdataがundefinedだった場合に、initialDataをset
        mutate((_data) => _data || initialData, false)
    }, [])

    return { data, mutate }
}

// グローバルステート用の型と初期値
interface GlobalState {
    isWebPage: boolean;
}

const initialGlobalState: GlobalState = {
    isWebPage: false,
};

// useGlobalState フック
export function useGlobalState() {
    const { data, mutate } = useStaticSWR<GlobalState>('globalState', initialGlobalState);

    const setIsWebPage = (value: boolean) => {
        mutate({ ...data, isWebPage: value }, false);
    };

    return {
        isWebPage: data.isWebPage,
        setIsWebPage,
    };
}

export default useStaticSWR