'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Toaster, toast } from 'sonner';
import Link from 'next/link';

const IMAGE_KEY = 'medical-card-image';
const DB_NAME = 'MedicalCardDB';
const STORE_NAME = 'images';

export default function MedicalCardPage() {
    const [cardImage, setCardImage] = useState<string | null>(null);

    const loadImage = useCallback(async () => {
        try {
            const imageDataUrl = await getImageFromIndexedDB();
            if (imageDataUrl) {
                setCardImage(imageDataUrl);
            }
        } catch (error) {
            toast.error(`画像の読み込みに失敗しました: ${JSON.stringify(error)}`);
        }
    }, []);

    useEffect(() => {
        loadImage();
    }, [loadImage]);

    const deleteImage = async () => {
        try {
            await deleteImageFromIndexedDB();
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
                <>
                    <div className="cardImage_wrapper">
                        <Image
                            className='cardImage'
                            src={cardImage}
                            alt="診察券"
                            width={2000}
                            height={3200}
                            onError={(error) => toast.error(`画像の表示に失敗しました: ${JSON.stringify(error)}`)}
                        />
                    </div>
                    <button className="button" onClick={deleteImage}>登録を解除する</button>
                </>
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

const getImageFromIndexedDB = (): Promise<string | null> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onerror = (event) => reject(new Error(`IndexedDBを開けませんでした: ${JSON.stringify(event)}`));

        request.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);

            const getRequest = store.get(IMAGE_KEY);

            getRequest.onerror = (event) => reject(new Error(`画像の取得に失敗しました: ${JSON.stringify(event)}`));
            getRequest.onsuccess = () => {
                const result = getRequest.result;
                resolve(result ? result.data : null);
            };
        };
    });
};

const deleteImageFromIndexedDB = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onerror = (event) => reject(new Error(`IndexedDBを開けませんでした: ${JSON.stringify(event)}`));

        request.onsuccess = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            const deleteRequest = store.delete(IMAGE_KEY);

            deleteRequest.onerror = (event) => reject(new Error(`画像の削除に失敗しました: ${JSON.stringify(event)}`));
            deleteRequest.onsuccess = () => resolve();
        };
    });
};