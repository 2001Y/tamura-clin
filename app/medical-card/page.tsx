'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Toaster, toast } from 'sonner';
import Link from 'next/link';

const IMAGE_KEY = 'medical-card-image';

export default function MedicalCardPage() {
    const [cardImage, setCardImage] = useState<string | null>(null);

    useEffect(() => {
        const isPWA = window.matchMedia('(display-mode: standalone)').matches;
        if (!isPWA) {
            window.location.href = '/install';
        }
        const storedImage = localStorage.getItem(IMAGE_KEY);
        if (storedImage) {
            setCardImage(storedImage);
        }
    }, []);

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
    const lastPositionRef = useRef({ x: 0, y: 0 });

    const handleTouchStart = (e: React.TouchEvent<HTMLImageElement>) => {
        if (e.touches.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const midX = (touch1.clientX + touch2.clientX) / 2;
            const midY = (touch1.clientY + touch2.clientY) / 2;
            lastPositionRef.current = { x: midX, y: midY };
        }
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLImageElement>) => {
        if (e.touches.length === 2) {
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const distance = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
            const newScale = Math.min(Math.max(distance / 100, 1), 3);
            setScale(newScale);

            const midX = (touch1.clientX + touch2.clientX) / 2;
            const midY = (touch1.clientY + touch2.clientY) / 2;
            const deltaX = midX - lastPositionRef.current.x;
            const deltaY = midY - lastPositionRef.current.y;

            setPosition(prev => ({
                x: prev.x + deltaX / newScale,
                y: prev.y + deltaY / newScale
            }));

            lastPositionRef.current = { x: midX, y: midY };
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
                    ref={imageRef}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    style={{
                        transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                        transition: scale === 1 ? 'all 0.3s ease-out' : 'none',
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