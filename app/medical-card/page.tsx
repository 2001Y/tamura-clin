'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Camera } from 'react-camera-pro';
import { toast, Toaster } from 'sonner';

const IMAGE_KEY = 'medical-card-image';

export default function CapturePage() {
    const [isCameraReady, setIsCameraReady] = useState(false);
    const camera = useRef(null);

    useEffect(() => {
        // カメラの準備ができたらステートを更新
        setIsCameraReady(true);
    }, []);

    const captureImage = useCallback(() => {
        if (camera.current) {
            try {
                const dataUrl = camera.current.takePhoto();
                localStorage.setItem(IMAGE_KEY, dataUrl);
                toast.success('画像を保存しました');
                window.location.reload();
            } catch (error) {
                toast.error(`画像のキャプチャに失敗しました: ${error.message}`);
            }
        } else {
            toast.error('カメラが準備できていません');
        }
    }, [camera]);

    return (
        <div>
            <Toaster position="top-center" />
            {isCameraReady ? (
                <>
                    <h1>診察券の登録</h1>
                    <p>
                        当院の診察券の写真を撮影して下さい。
                    </p>
                    <Camera ref={camera} facingMode="environment" aspectRatio={16 / 9} />
                    <button onClick={captureImage}>撮影</button>
                    <button className="cancel" onClick={() => { window.location.reload(); }}>キャンセル</button>
                </>
            ) : (
                <h2>カメラを起動中...</h2>
            )}
        </div>
    );
}