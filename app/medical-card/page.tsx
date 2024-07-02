'use client';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Toaster, toast } from 'sonner';

// ローカルストレージのキー
const IMAGE_KEY = 'medical-card-image';

// ローカルストレージ操作用のヘルパーオブジェクト
const localStorageHelper = {
    save: (imageDataUrl: string) => localStorage.setItem(IMAGE_KEY, imageDataUrl),
    get: () => localStorage.getItem(IMAGE_KEY),
    delete: () => localStorage.removeItem(IMAGE_KEY),
};

export default function MedicalCard() {
    // 診察券画像のstate
    const [cardImage, setCardImage] = useState<string | null>(null);

    // ローカルストレージから画像を読み込む関数
    const loadImage = useCallback(() => {
        const imageDataUrl = localStorageHelper.get();
        if (imageDataUrl) {
            setCardImage(imageDataUrl);
            toast.success('保存された画像を読み込みました');
        }
    }, []);

    // コンポーネントマウント時に画像を読み込む
    useEffect(() => {
        loadImage();
    }, [loadImage]);

    // 画像を削除する関数
    const deleteImage = () => {
        localStorageHelper.delete();
        setCardImage(null);
        toast.success('画像を削除しました');
    };

    return (
        <div>
            <Toaster />
            <Link href="/">＜ ホームに戻る</Link>
            {cardImage ? (
                <>
                    <h1>診察券</h1>
                    <Image
                        src={cardImage}
                        alt="診察券"
                        width={300}
                        height={400}
                        style={{ objectFit: 'contain' }}
                        onError={() => toast.error('画像の表示に失敗しました')}
                    />
                    <button onClick={deleteImage}>画像を削除</button>
                </>
            ) : (<>
                <h1>アプリに診察券を登録します</h1>
                <Link href="/capture">
                    <button>登録する</button>
                </Link>
            </>)}
        </div>
    );
}
