'use client';

import React from 'react';
import { useGlobalState } from '../hooks/useStaticSWR';

interface IframeWrapperProps {
    children: React.ReactNode;
}

export function IframeWrapper({ children }: IframeWrapperProps) {
    const { isWebPage } = useGlobalState();

    return (
        <>
            {children}
            <iframe
                src="https://dr-tamura.net"
                title="たむらクリニック公式ウェブサイト"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    opacity: isWebPage ? 1 : 0,
                    pointerEvents: isWebPage ? 'auto' : 'none',
                    // zIndex: -99,
                }}
                allow="*"
                sandbox="allow-scripts allow-same-origin"
            />
        </>
    );
}
