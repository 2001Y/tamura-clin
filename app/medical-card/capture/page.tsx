'use client';
import { useState, useRef, useEffect } from 'react';
import { toast, Toaster } from 'sonner';
import { useRouter } from 'next/navigation';

const IMAGE_KEY = 'medical-card-image';
const DB_NAME = 'MedicalCardDB';
const STORE_NAME = 'images';

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
                        facingMode: 'environment'
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
                if (error instanceof Error) {
                    toast.error(`カメラの起動に失敗しました: ${error.message}`);
                } else {
                    toast.error('カメラの起動に失敗しました');
                }
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
                context.drawImage(videoRef.current, 0, 0, canvasSize.width, canvasSize.height);
                const dataUrl = canvasRef.current.toDataURL('image/png');

                try {
                    await saveToIndexedDB(dataUrl);
                    toast.success('画像を保存しました');
                    router.push('/medical-card');
                } catch (error) {
                    if (error instanceof Error) {
                        toast.error(`画像の保存に失敗しました: ${error.message}`);
                    } else {
                        toast.error('画像の保存に失敗しました');
                    }
                }
            }
        } else {
            toast.error('カメラが準備できていません');
        }
    };

    const saveToIndexedDB = (dataUrl: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, 2);

            request.onerror = () => reject(new Error('IndexedDBを開けませんでした'));

            request.onsuccess = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                const transaction = db.transaction([STORE_NAME], 'readwrite');
                const store = transaction.objectStore(STORE_NAME);

                const saveRequest = store.put({ id: IMAGE_KEY, data: dataUrl });

                saveRequest.onerror = () => reject(new Error('画像の保存に失敗しました'));
                saveRequest.onsuccess = () => resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            };
        });
    };

    return (
        <main>
            <Toaster position="top-center" />
            <button className="close-button" onClick={() => router.push('/medical-card')}>
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