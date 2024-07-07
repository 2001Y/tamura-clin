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

    return (
        <div>
            <Toaster position="bottom-center" className="sonner-toaster" />
            <header>
                <h1>診察券</h1>
            </header>
            {cardImage ? (
                <div
                    className="cardImage_wrapper"
                >
                    <Image
                        className='cardImage'
                        src={cardImage}
                        alt="診察券"
                        width={4000}
                        height={6400}
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