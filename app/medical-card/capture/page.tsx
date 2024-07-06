'use client';
import { useState, useRef, useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import { useRouter } from 'next/navigation';

const IMAGE_KEY = 'medical-card-image';

export default function CapturePage() {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const router = useRouter();

    useEffect(() => {
        const startCamera = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'environment',
                        width: { ideal: 4096 },
                        height: { ideal: 2160 }
                    },
                    audio: false,
                });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                    videoRef.current.onloadedmetadata = () => {
                        if (videoRef.current) {
                            setCanvasSize({
                                width: videoRef.current.videoWidth,
                                height: videoRef.current.videoHeight
                            });
                        }
                    };
                }
            } catch (error) {
                toast.error(`カメラの起動に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
            }
        };

        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const captureImage = async () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {

                // 2倍に拡大した中央部分のみをキャプチャ
                const sourceWidth = canvasSize.width / 2;
                const sourceHeight = canvasSize.height / 2;
                const sourceX = (canvasSize.width - sourceWidth) / 2;
                const sourceY = (canvasSize.height - sourceHeight) / 2;

                context.drawImage(
                    videoRef.current,
                    sourceX, sourceY, sourceWidth, sourceHeight,
                    0, 0, canvasSize.width, canvasSize.height
                );

                // グレースケール変換とコントラスト調整
                const imageData = context.getImageData(0, 0, canvasSize.width, canvasSize.height);
                const data = imageData.data;
                for (let i = 0; i < data.length; i += 4) {
                    const gray = 0.2989 * data[i] + 0.5870 * data[i + 1] + 0.1140 * data[i + 2];
                    const adjustedGray = Math.min(255, Math.max(0, (gray - 128) * 2 + 128));
                    data[i] = data[i + 1] = data[i + 2] = adjustedGray;
                }
                context.putImageData(imageData, 0, 0);

                // JPEG形式で保存（品質は0.7に設定）
                const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.7);

                try {
                    localStorage.setItem(IMAGE_KEY, dataUrl);
                    toast.success('画像を保存しました');
                    window.location.href = '/medical-card';
                } catch (error) {
                    toast.error(`画像の保存に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
                }
            }
        } else {
            toast.error('カメラが準備できていません');
        }
    };

    return (
        <main>
            <Toaster position="top-center" />
            <button className="close-button" onClick={() => window.location.href = '/medical-card'}>
                ✕
            </button>
            <h1>診察券の登録</h1>
            <p>当院の診察券の写真を撮影して下さい。</p>
            <div className="camera-container">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    style={{ width: '100%', height: 'auto' }}
                />
                <canvas
                    ref={canvasRef}
                    style={{ display: 'none' }}
                    width={canvasSize.width}
                    height={canvasSize.height}
                />
            </div>
            <button className="button" onClick={captureImage}>撮影</button>
        </main>
    );
}