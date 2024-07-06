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
                allow="accelerometer; autoplay; camera; encrypted-media; fullscreen; geolocation; gyroscope; microphone; midi; payment; picture-in-picture; usb; vr"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-top-navigation"
            />
        </>
    );
}
