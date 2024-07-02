'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'sonner';

const IMAGE_KEY = 'medical-card-image';

export default function CapturePage() {
    const [stream, setStream] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const stopCameraRef = useRef(() => { });
    const router = useRouter();

    const stopCamera = useCallback(() => {
        stopCameraRef.current();
    }, []);

    const startCamera = useCallback(async () => {
        try {
            // まず外向きカメラを試す
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setStream(mediaStream);

            stopCameraRef.current = () => {
                mediaStream.getTracks().forEach(track => track.stop());
                setStream(null);
            };
        } catch (err) {
            try {
                // 失敗した場合、制約なしで再試行
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
                setStream(mediaStream);
                toast.warning(`外カメラの起動に失敗しました。内カメラを使用します。(${err.message})`);

                stopCameraRef.current = () => {
                    mediaStream.getTracks().forEach(track => track.stop());
                    setStream(null);
                };
            } catch (fallbackErr) {
                toast.error(`カメラの起動に失敗しました。ブラウザの設定を確認してください。(${fallbackErr.message})`);
            }
        }
    }, []);

    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, []); // 空の依存配列

    const captureImage = useCallback(() => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

                const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.7);
                localStorage.setItem(IMAGE_KEY, dataUrl);
                toast.success('画像を保存しました');
                // router.push('/next-page'); // 必要に応じて次のページに遷移
            }
        }
    }, []); // 空の依存配列

    return (
        <div>
            <Toaster position="top-center" />
            {stream ? (
                <>
                    <h1>診察券の登録</h1>
                    <p>
                        当院の診察券の写真を撮影して下さい。
                    </p>
                    <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', maxWidth: '500px' }} />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    <button onClick={captureImage}>撮影</button>
                    <button className="cancel" onClick={() => { window.location.reload(); }}>キャンセル</button>
                </>
            ) : (
                <h2>カメラを起動中...</h2>
            )}
        </div>
    );
}
