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

/**
 * 画像を圧縮する関数
 * @param file 圧縮する画像ファイル
 * @param maxWidth 最大幅
 * @param quality 圧縮品質 (0-1)
 * @returns 圧縮された画像のData URL
 */
const compressImage = (file: File, maxWidth: number, quality: number): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new globalThis.Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let { width, height } = img;
                // アスペクト比を保持しながら、最大幅に合わせてリサイズ
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d')?.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = reject;
            img.src = event.target?.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
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
            <h1>診察券</h1>
            {cardImage ? (
                <>
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
            ) : (
                <Link href="/capture">
                    <button>カメラを起動</button>
                </Link>
            )}
        </div>
    );
}
