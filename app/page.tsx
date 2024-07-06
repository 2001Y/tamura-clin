'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  useEffect(() => {
    const isPWA = window.matchMedia('(display-mode: standalone)').matches;
    if (!isPWA) {
      window.location.href = '/install';
    }
  }, []);

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