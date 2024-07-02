'use client';
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

type MedicalCardProps = {
    children: React.ReactNode;
};

export default function MedicalCard({ children }: MedicalCardProps) {
    // 診察券画像のstate
    const [cardImage, setCardImage] = useState<string | null>(null);
    // モーダルの表示状態
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    // モーダルを開く関数
    const openModal = () => {
        setIsModalOpen(true);
    };

    // モーダルを閉じる関数
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <Toaster position="top-center" />
            <header>
                <h1>診察券</h1>
            </header>
            {cardImage ? (
                <>
                    <Image
                        src={cardImage}
                        alt="診察券"
                        width={400}
                        height={500}
                        style={{ objectFit: 'contain' }}
                        onError={() => toast.error('画像の表示に失敗しました')}
                    />
                    <button onClick={deleteImage}>画像を削除</button>
                </>
            ) : (
                <>
                    <p>
                        一度登録すれば次回以降診察券を持ち運ばずに受診することができます。
                    </p>
                    <button onClick={openModal}>新しく登録する</button>
                </>
            )}
            {isModalOpen && (<>
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        {children}
                    </div>
                </div>
            </>)}
        </div>
    );
}
