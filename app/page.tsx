'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const isPWA = window.matchMedia('(display-mode: standalone)').matches;
    if (!isPWA) {
      router.push('/install');
    }
  }, [router]);

  return (
    <main>
      <header>
        <h1>たむらクリニック</h1>
      </header>
      <Link href="/medical-card">
        <button className="button">診察券をみる</button>
      </Link>
    </main>
  );
}