'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Toaster, toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const IMAGE_KEY = 'medical-card-image';

export default function MedicalCardPage() {
    const [cardImage, setCardImage] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const isPWA = window.matchMedia('(display-mode: standalone)').matches;
        if (!isPWA) {
            router.push('/install');
        }
        const storedImage = localStorage.getItem(IMAGE_KEY);
        if (storedImage) {
            setCardImage(storedImage);
        }
    }, [router]);

    const deleteImage = () => {
        try {
            localStorage.removeItem(IMAGE_KEY);
            setCardImage(null);
            toast.info('画像を削除しました');
        } catch (error) {
            toast.error(`画像の削除に失敗しました: ${JSON.stringify(error)}`);
        }
    };

    const imageRef = useRef<HTMLImageElement>(null);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const startPointRef = useRef({ x: 0, y: 0, distance: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // 画像の中央位置を計算
        if (containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const centerX = (containerRect.width - 2000) / 2; // 2000は画像の幅
            const centerY = (containerRect.height - 3200) / 2; // 3200は画像の高さ
            setPosition({ x: centerX, y: centerY });
        }
    }, [cardImage, router]);

    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const midX = (touch1.clientX + touch2.clientX) / 2;
            const midY = (touch1.clientY + touch2.clientY) / 2;
            const distance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
            startPointRef.current = { x: midX, y: midY, distance };
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const midX = (touch1.clientX + touch2.clientX) / 2;
            const midY = (touch1.clientY + touch2.clientY) / 2;
            const distance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);

            const newScale = Math.min(Math.max(scale * (distance / startPointRef.current.distance), 1), 3);

            // 拡大開始時の中点を基準に位置を調整
            const scaleChange = newScale / scale;
            const newX = startPointRef.current.x - (startPointRef.current.x - position.x) * scaleChange;
            const newY = startPointRef.current.y - (startPointRef.current.y - position.y) * scaleChange;

            setScale(newScale);
            setPosition({ x: newX, y: newY });
        }
    };

    const handleTouchEnd = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    return (
        <div>
            <Toaster position="bottom-center" className="sonner-toaster" />
            <header>
                <h1>診察券</h1>
            </header>
            {cardImage ? (
                <div
                    className="cardImage_wrapper"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{
                        transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                        transformOrigin: '0 0',
                        transition: 'transform 0.1s ease-out'
                    }}
                >
                    <Image
                        className='cardImage'
                        src={cardImage}
                        alt="診察券"
                        width={2000}
                        height={3200}
                        onError={(error) => toast.error(`画像の表示に失敗しました: ${JSON.stringify(error)}`)}
                    />
                    <button className="deleteImage_button" onClick={deleteImage}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                        削除
                    </button>
                </div>
            ) : (
                <>
                    <p>
                        一度登録すれば次回以降診察券を持ち運ばずに受診することができます。
                    </p>
                    <Link href="/medical-card/capture">
                        <button className="button">新しく登録する</button>
                    </Link>
                </>
            )}
        </div>
    );
}