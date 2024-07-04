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
    }, []);

    return (
        <main>
            あ
        </main>
    );
}