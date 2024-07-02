'use client';
import { useEffect } from 'react';
import { useGlobalState } from '../hooks/useStaticSWR';

export default function Web() {
    const { setIsWebPage } = useGlobalState();

    useEffect(() => {
        setIsWebPage(true);
        return () => {
            setIsWebPage(false);
        };
    }, [setIsWebPage]);

    return (
        <main>
            {/* このページの内容は iframe で表示されるため、ここは空でも問題ありません */}
        </main>
    );
}