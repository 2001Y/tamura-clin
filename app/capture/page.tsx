'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const IMAGE_KEY = 'medical-card-image';

export default function CapturePage() {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const router = useRouter();

    const stopCamera = useCallback(() => {
        stream?.getTracks().forEach(track => track.stop());
        setStream(null);
    }, [stream]);

    const startCamera = useCallback(async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { exact: "environment" } }
            });
            setStream(mediaStream);
            if (videoRef.current) videoRef.current.srcObject = mediaStream;
        } catch (err) {
            // 'environment' モードが失敗した場合、デフォルトのカメラにフォールバック
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
                setStream(mediaStream);
                if (videoRef.current) videoRef.current.srcObject = mediaStream;
                toast.warning('外カメラの起動に失敗しました。内カメラを使用します。');
            } catch (fallbackErr) {
                toast.error('カメラの起動に失敗しました');
            }
        }
    }, []);

    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, [startCamera, stopCamera]);

    useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

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
                stopCamera();
                router.push('/medical-card');
            }
        }
    }, [stopCamera, router]);

    return (
        <div>
            <h1>診察券を撮影</h1>
            {stream ? (
                <>
                    <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', maxWidth: '500px' }} />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    <button onClick={captureImage}>撮影</button>
                    <button onClick={() => { stopCamera(); router.push('/medical-card'); }}>キャンセル</button>
                </>
            ) : (
                <p>カメラを起動中...</p>
            )}
        </div>
    );
}